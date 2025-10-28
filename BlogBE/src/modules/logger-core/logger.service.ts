import pino, { Logger as PinoLogger, LoggerOptions } from 'pino'
import { container, singleton } from 'tsyringe'

@singleton()
export class LoggerService {
  private logger: PinoLogger

  constructor(name?: string, level: string = 'info') {
    const options: LoggerOptions = {
      name,
      level,
      transport:
        process.env.NODE_ENV !== 'production'
          ? {
              target: 'pino-pretty',
              options: { colorize: true, translateTime: 'HH:MM:ss' }
            }
          : undefined
    }
    this.logger = pino(options)
  }

  info(message: string, meta?: Record<string, any>) {
    this.logger.info(meta, message)
  }

  warn(message: string, meta?: Record<string, any>) {
    this.logger.warn(meta, message)
  }

  error(message: string, meta?: Record<string, any>) {
    this.logger.error(meta, message)
  }

  debug(message: string, meta?: Record<string, any>) {
    this.logger.debug(meta, message)
  }

  child(meta: Record<string, any>) {
    return new LoggerWrapper(this.logger.child(meta))
  }
}

// wrapper để dùng child logger
class LoggerWrapper {
  constructor(private logger: PinoLogger) {}

  info(msg: string, meta?: Record<string, any>) {
    this.logger.info(meta, msg)
  }
  warn(msg: string, meta?: Record<string, any>) {
    this.logger.warn(meta, msg)
  }
  error(msg: string, meta?: Record<string, any>) {
    this.logger.error(meta, msg)
  }
  debug(msg: string, meta?: Record<string, any>) {
    this.logger.debug(meta, msg)
  }
}

export const logger = container.resolve(LoggerService)
