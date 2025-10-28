import { ErrorWithStatus } from '~/shared/utils/error-status.js'
import { injectable, inject } from 'tsyringe'
import bcrypt from 'bcrypt'
import { UserService } from '../users-core/user-core.service.js'
import { JwtUtils } from '~/shared/utils/jwt.utils.js'

import { TokenType, UserRole } from '~/generated/prisma/enums.js'
import { env } from '~/config/env.js'
import { SignOptions } from 'jsonwebtoken'
import { LoginDto, RegisterDto, TokenPayload } from './auth.dto.js'

@injectable()
export class AuthService {
  constructor(
    @inject(UserService) private userService: UserService,
    @inject(JwtUtils) private jwtUtils: JwtUtils
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

  private async signAccessTokenAndRefreshToken(
    payload: TokenPayload
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload)
    ])
    return { accessToken: accessToken, refreshToken: refreshToken }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  private async comparePassword(password: string, passwordHash: string): Promise<boolean> {
    const userPasswordHash = await this.hashPassword(password)
    return bcrypt.compare(userPasswordHash, passwordHash)
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
      id: user.id,
      email: user.email,
      tokenType: TokenType.access,
      role: user.role
    })

    return { accessToken, refreshToken }
  }

  public async login(data: LoginDto) {
    const user = await this.userService.findUserByEmailOrFail(data.email)

    const isPasswordMatch = await this.comparePassword(data.password, user.password_hash)
    if (!isPasswordMatch) {
      throw new ErrorWithStatus(401, 'Email or password is incorrect')
    }

    const accessToken = await this.signAccessToken({
      id: user.id,
      email: user.email,
      tokenType: TokenType.access,
      role: user.role
    })
    const refreshToken = await this.signRefreshToken({
      id: user.id,
      email: user.email,
      tokenType: TokenType.refresh,
      role: user.role
    })

    const { password_hash: _, ...userWithoutPassword } = user
    return { user: userWithoutPassword, accessToken, refreshToken }
  }
}
