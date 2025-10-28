import { singleton } from 'tsyringe'
import { env } from '~/config/env.js'

export interface ILoggerConfig {
  level: string
  name: string
  isPretty: boolean
}

@singleton()
export class LoggerConfig {
  public readonly logger: ILoggerConfig

  constructor() {
    this.logger = {
      level: env.LOG_LEVEL || 'info',
      name: env.APP_NAME || 'MyApplication',
      isPretty: env.NODE_ENV !== 'production'
    }
  }
}
