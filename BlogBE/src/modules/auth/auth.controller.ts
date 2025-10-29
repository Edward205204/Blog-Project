import { Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'
import { AuthService } from './auth.service.js'
import { HTTP_STATUS } from '~/constants/http-status.js'
import { TokenPayload } from './auth.dto.js'
import { LoggerService } from '../logger-core/logger.service.js'

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(LoggerService) private logger: LoggerService
  ) {}

  public register = async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body)
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Register successfully',
      data: result
    })
  }

  public login = async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body)
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Login successfully',
      data: result
    })
  }

  public logout = async (req: Request, res: Response) => {
    const refresh_token = req.body.refresh_token
    await this.authService.logout(refresh_token)
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Logout successfully'
    })
  }

  public refreshToken = async (req: Request, res: Response) => {
    const refresh_token_decoded = req.refresh_token_decoded as TokenPayload
    const refresh_token = req.body.refresh_token
    const { accessToken, refreshToken } = await this.authService.refreshToken(refresh_token_decoded, refresh_token)
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Refresh token successfully',
      data: {
        accessToken,
        refreshToken
      }
    })
  }
}
