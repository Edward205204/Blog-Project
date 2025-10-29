import { Router } from 'express'
import { injectable, inject } from 'tsyringe'
import { AuthController } from './auth.controller.js'
import { wrapRequestHandler } from '~/shared/utils/handler.js'
import { loginValidation, refreshValidation, registerValidation } from './auth.middleware.js'
import { AuthMiddleware } from '~/shared/middleware/auth.middleware.js'

@injectable()
export class AuthRoutes {
  public router = Router()

  constructor(
    @inject(AuthController) private authController: AuthController,
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware
  ) {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post('/register', registerValidation, wrapRequestHandler(this.authController.register))

    this.router.post('/login', loginValidation, wrapRequestHandler(this.authController.login))

    this.router.post(
      '/logout',
      refreshValidation,
      this.authMiddleware.validateRefreshToken,
      wrapRequestHandler(this.authController.logout)
    )

    this.router.post(
      '/refresh-token',
      refreshValidation,
      this.authMiddleware.validateRefreshToken,
      wrapRequestHandler(this.authController.refreshToken)
    )
  }
}
