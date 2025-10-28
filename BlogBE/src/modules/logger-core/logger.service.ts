import pino, { Logger as PinoLogger, LoggerOptions } from 'pino'
import { inject, singleton } from 'tsyringe'
import { ILoggerConfig, LoggerConfig } from '~/config/logger.config.js'

@singleton()
export class LoggerService {
  private logger: PinoLogger

  constructor(@inject(LoggerConfig) private loggerConfig: LoggerConfig) {
    const config: ILoggerConfig = loggerConfig.logger
    const options: LoggerOptions = {
      name: config.name,
      level: config.level,
      transport: config.isPretty
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
export class LoggerWrapper {
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
