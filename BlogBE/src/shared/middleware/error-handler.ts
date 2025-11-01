import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { ErrorWithStatus } from '../utils/error-status.js'

export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    })
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Lỗi xác thực',
      errors: err.flatten().fieldErrors
    })
  }

  console.error('ERROR 💥', err)
  return res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi'
  })
}
