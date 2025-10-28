import { Router } from 'express'
import { injectable, inject } from 'tsyringe'
import { AuthController } from './auth.controller.js'
import { validate } from '~/shared/middleware/validate.middleware.js'
import { registerSchema, loginSchema } from './auth.schema.js'
import { wrapRequestHandler } from '~/shared/utils/handler.js'

@injectable()
export class AuthRoutes {
  public router = Router()

  constructor(@inject(AuthController) private authController: AuthController) {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post('/register', validate(registerSchema), wrapRequestHandler(this.authController.register))

    this.router.post('/login', validate(loginSchema), wrapRequestHandler(this.authController.login))
  }
}
