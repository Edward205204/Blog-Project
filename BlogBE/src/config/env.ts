import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(process.cwd(), '.env')
})

export const env = {
  PORT: Number(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || '',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || '',
  RESET_PASSWORD_TOKEN_SECRET: process.env.RESET_PASSWORD_TOKEN_SECRET || '',
  EMAIL_VERIFICATION_TOKEN_SECRET: process.env.EMAIL_VERIFICATION_TOKEN_SECRET || '',

  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || '1d',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '24w',
  RESET_PASSWORD_TOKEN_EXPIRES_IN: process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN || '24h',
  EMAIL_VERIFICATION_TOKEN_EXPIRES_IN: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN || '24h',

  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  APP_NAME: process.env.APP_NAME || 'blog-backend',

  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  APP_NAME_MS: process.env.APP_NAME_MS || '',
  CLIENT_URL: process.env.CLIENT_URL || ''
}
