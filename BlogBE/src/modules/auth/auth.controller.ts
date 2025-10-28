import { Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'
import { AuthService } from './auth.service.js'

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) {}

  public register = async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body)
    res.status(201).json({
      success: true,
      message: 'Register successfully',
      data: result
    })
  }

  public login = async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body)
    res.status(200).json({
      success: true,
      message: 'Login successfully',
      data: result
    })
  }
}
