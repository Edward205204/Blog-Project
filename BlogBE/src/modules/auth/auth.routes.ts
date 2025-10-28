import { Router } from 'express'
import { injectable, inject } from 'tsyringe'
import { AuthController } from './auth.controller.js'
import { wrapRequestHandler } from '~/shared/utils/handler.js'
import { loginValidation, registerValidation } from './auth.middleware.js'

@injectable()
export class AuthRoutes {
  public router = Router()

  constructor(@inject(AuthController) private authController: AuthController) {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post('/register', registerValidation, wrapRequestHandler(this.authController.register))

    this.router.post('/login', loginValidation, wrapRequestHandler(this.authController.login))
  }
}
