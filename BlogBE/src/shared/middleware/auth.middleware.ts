import { ErrorWithStatus } from '~/shared/utils/error-status.js'
import { Request, Response, NextFunction } from 'express'
import { injectable, inject } from 'tsyringe'
import { JwtUtils } from '~/shared/utils/jwt.utils.js'
import { UserService } from '~/modules/user-core/user-core.service.js'
import { wrapRequestHandler } from '~/shared/utils/handler.js'
import { HTTP_STATUS } from '~/constants/http-status.js'
import { omit } from '../utils/omit.js'
import { TokenPayload } from '~/modules/auth/auth.dto.js'
import { env } from '~/config/env.js'

@injectable()
export class AuthMiddleware {
  constructor(
    @inject(JwtUtils) private jwtUtils: JwtUtils,
    @inject(UserService) private userService: UserService
  ) {}

  public execute = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) {
      throw new ErrorWithStatus(HTTP_STATUS.UNAUTHORIZED, 'Authentication required')
    }

    const decoded = this.jwtUtils.verify(token)
    if (!decoded || !decoded.id) {
      throw new ErrorWithStatus(HTTP_STATUS.UNAUTHORIZED, 'Token không hợp lệ hoặc hết hạn')
    }

    const user = await this.userService.findUserByEmailOrFail(decoded.email)

    req.user = omit(user, ['password_hash'])
    req.token_decoded = decoded
    next()
  })

  public validateRefreshToken = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const refresh_token = req.body.refresh_token
    if (!refresh_token) {
      throw new ErrorWithStatus(HTTP_STATUS.UNAUTHORIZED, 'Refresh token không hợp lệ hoặc hết hạn')
    }
    const decoded = this.jwtUtils.verify(refresh_token, env.REFRESH_TOKEN_SECRET)
    if (!decoded || !decoded.id) {
      throw new ErrorWithStatus(HTTP_STATUS.UNAUTHORIZED, 'Refresh token không hợp lệ hoặc hết hạn')
    }
    req.refresh_token_decoded = decoded as TokenPayload
    next()
  })
}
