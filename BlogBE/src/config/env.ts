import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(process.cwd(), '.env')
})

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || '',
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || '1d',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || '',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '24w',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  APP_NAME: process.env.APP_NAME || 'blog-backend'
}
