import { Request, Response, NextFunction } from 'express'
import { uuidv4 } from 'zod'
import { logger } from '~/modules/logger-core/logger.service.js'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = uuidv4()
  const reqLogger = logger.child({ requestId, path: req.path, method: req.method })

  reqLogger.info('Incoming request')
  res.on('finish', () => {
    reqLogger.info('Request finished', { statusCode: res.statusCode })
  })
  ;(req as any).logger = reqLogger
  next()
}
