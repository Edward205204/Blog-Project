import { ErrorWithStatus } from '~/shared/utils/error-status.js'
import { injectable, inject } from 'tsyringe'
import bcrypt from 'bcrypt'
import { UserService } from '../user-core/user-core.service.js'
import { JwtUtils } from '~/shared/utils/jwt.utils.js'

import { TokenType, UserRole } from '~/generated/prisma/enums.js'
import { env } from '~/config/env.js'
import { SignOptions } from 'jsonwebtoken'
import { LoginDto, RegisterDto, TokenPayload } from './auth.dto.js'
import { HTTP_STATUS } from '~/constants/http-status.js'
import { omit } from '~/shared/utils/omit.js'
import { PrismaService } from '../prisma-core/prisma.service.js'
import { LoggerService } from '../logger-core/logger.service.js'
import { MailgunService } from '../mailgun-core/mailgun.service.js'
import { MailType } from '../mailgun-core/mailgun.dto.js'
import { User } from '~/generated/prisma/client.js'
import { getTokenSecret } from '~/shared/utils/get-token-secret.js'

@injectable()
export class AuthService {
  constructor(
    @inject(UserService) private userService: UserService,
    @inject(JwtUtils) private jwtUtils: JwtUtils,
    @inject(PrismaService) private prisma: PrismaService,
    @inject(LoggerService) private logger: LoggerService,
    @inject(MailgunService) private mailgunService: MailgunService
  ) {}

  private async signAccessToken(payload: TokenPayload): Promise<string> {
    return this.jwtUtils.sign(payload)
  }

  private async signRefreshToken(
    payload: TokenPayload,
    expiresIn?: SignOptions['expiresIn'],
    secret?: string
  ): Promise<string> {
    return this.jwtUtils.sign(payload, {
      expiresIn: expiresIn ?? (env.REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn']),
      secret: secret ?? env.REFRESH_TOKEN_SECRET
    })
  }

  private async signEmailVerificationToken(payload: TokenPayload): Promise<string> {
    return this.jwtUtils.sign(payload, {
      expiresIn: env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
      secret: env.EMAIL_VERIFICATION_TOKEN_SECRET
    })
  }

  private async signAccessTokenAndRefreshToken(
    payload: Omit<TokenPayload, 'tokenType'>
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken({ ...payload, tokenType: TokenType.access }),
      this.signRefreshToken({ ...payload, tokenType: TokenType.refresh })
    ])
    return { accessToken, refreshToken }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  private async comparePassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash)
  }

  private decodeToken<T = any>(token: string, secret: string): T {
    const decoded = this.jwtUtils.verify<T>(token, secret)
    if (!decoded) {
      throw new ErrorWithStatus(HTTP_STATUS.UNAUTHORIZED, 'Invalid token')
    }
    return decoded
  }

  private async signAndSaveToken(user: User, tokenType: TokenType) {
    const token = await this.signEmailVerificationToken({
      user_id: user.id,
      email: user.email,
      role: user.role,
      tokenType: tokenType
    })

    const secret_key = getTokenSecret(tokenType)

    const { exp, iat } = this.decodeToken<{ exp: number; iat: number }>(token, secret_key)

    await this.prisma.token.create({
      data: {
        user_id: user.id,
        token_type: tokenType,
        token_string: token,
        expires_at: exp,
        issued_at: iat
      }
    })
    return token
  }

  private sendMail(user: User, token: string, type: MailType) {
    this.mailgunService.sendMail(user.email, type, {
      USER_NAME: user.name,
      VERIFY_LINK: `${env.CLIENT_URL}/verify-email?token=${token}`
    })
  }

  public async register(data: RegisterDto) {
    await this.userService.checkEmailDoesNotExistOrFail(data.email)
    const password_hash = await this.hashPassword(data.password)

    const user = await this.userService.createUser({
      email: data.email,
      password_hash,
      role: UserRole.reader,
      name: data.name
    })

    const { accessToken, refreshToken } = await this.signAccessTokenAndRefreshToken({
      user_id: user.id,
      email: user.email,
      role: user.role
    })
    const userWithoutPassword = omit(user, ['password_hash'])
    const emailVerificationToken = await this.signAndSaveToken(user, TokenType.email_verification)
    this.sendMail(user, emailVerificationToken, MailType.VERIFY_EMAIL)
    return { user: userWithoutPassword, accessToken, refreshToken }
  }

  public async login(data: LoginDto) {
    const user = await this.userService.findUserByEmail(data.email)

    if (!user) {
      throw new ErrorWithStatus(HTTP_STATUS.UNAUTHORIZED, 'Email or password is incorrect')
    }

    const isPasswordMatch = await this.comparePassword(data.password, user.password_hash)
    if (!isPasswordMatch) {
      throw new ErrorWithStatus(HTTP_STATUS.UNAUTHORIZED, 'Email or password is incorrect')
    }

    const { accessToken, refreshToken } = await this.signAccessTokenAndRefreshToken({
      user_id: user.id,
      email: user.email,
      role: user.role
    })

    const { exp, iat } = this.decodeToken<{ exp: number; iat: number }>(refreshToken, env.REFRESH_TOKEN_SECRET)
    await this.prisma.token.create({
      data: {
        user_id: user.id,
        token_type: TokenType.refresh,
        token_string: refreshToken,
        expires_at: exp,
        issued_at: iat
      }
    })
    const userWithoutPassword = omit(user, ['password_hash'])
    return { user: userWithoutPassword, accessToken, refreshToken }
  }

  public async logout(refresh_token: string) {
    await this.prisma.token.delete({
      where: {
        token_string: refresh_token
      }
    })
  }

  public async refreshToken(refresh_token_decoded: TokenPayload, refresh_token: string) {
    const { user_id, email, role } = refresh_token_decoded
    const old_token = await this.prisma.token.findUnique({
      where: {
        token_string: refresh_token
      }
    })
    if (!old_token) {
      throw new ErrorWithStatus(HTTP_STATUS.UNAUTHORIZED, 'Refresh token is invalid or expired')
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken({
        user_id,
        email,
        role,
        tokenType: TokenType.access
      }),
      this.signRefreshToken(
        {
          user_id,
          email,
          role,
          tokenType: TokenType.refresh
        },
        env.REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
      )
    ])

    const { exp, iat } = this.decodeToken<{ exp: number; iat: number }>(refreshToken, env.REFRESH_TOKEN_SECRET)

    await this.prisma.token.update({
      where: {
        token_string: refresh_token
      },
      data: {
        token_string: refreshToken,
        expires_at: exp,
        issued_at: iat
      }
    })

    return { accessToken, refreshToken }
  }
}
