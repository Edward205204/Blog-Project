import express, { Express } from 'express'
import cors from 'cors'
import { injectable, inject } from 'tsyringe'
import { globalErrorHandler } from './shared/middleware/error-handler.js'
import { ErrorWithStatus } from './shared/utils/error-status.js'
import { AuthRoutes } from './modules/auth/auth.routes.js'

@injectable()
export class Application {
  private app: Express

  constructor(@inject(AuthRoutes) private authRoutes: AuthRoutes) {
    this.app = express()
    this.setupMiddlewares()
    this.setupRoutes()
    this.setupErrorHandling()
  }

  private setupMiddlewares(): void {
    this.app.use(express.json())
    this.app.use(cors())
  }

  private setupRoutes(): void {
    this.app.use('/auth', this.authRoutes.router)

    this.app.use((req, res, next) => {
      next(new ErrorWithStatus(404, 'Not Found'))
    })
  }

  private setupErrorHandling(): void {
    this.app.use(globalErrorHandler)
  }

  public start(): void {
    const PORT = process.env.PORT || 3000
    this.app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy trên port ${PORT}`)
    })
  }
}
