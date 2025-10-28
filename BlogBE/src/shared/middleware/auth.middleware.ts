import { ErrorWithStatus } from '~/shared/utils/error-status.js'
import { Request, Response, NextFunction } from 'express'
import { injectable, inject } from 'tsyringe'
import { JwtUtils } from '~/shared/utils/jwt.utils.js'
import { UserService } from '~/modules/users-core/user-core.service.js'
import { wrapRequestHandler } from '~/shared/utils/handler.js'

@injectable()
export class AuthMiddleware {
  constructor(
    @inject(JwtUtils) private jwtUtils: JwtUtils,
    @inject(UserService) private userService: UserService
  ) {}

  public execute = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) {
      throw new ErrorWithStatus(401, 'Authentication required')
    }

    const decoded = this.jwtUtils.verify(token)
    if (!decoded || !decoded.id) {
      throw new ErrorWithStatus(401, 'Token is invalid or expired')
    }

    const user = await this.userService.findUserByIdOrFail(decoded.id)

    const { password_hash: _, ...userWithoutPassword } = user
    req.user = userWithoutPassword
    next()
  })
}
