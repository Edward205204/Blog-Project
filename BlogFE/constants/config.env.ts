import ms from 'ms'

export const CONFIG_ENV = {
  BE_URL: process.env.BE_URL ?? 'http://localhost:3001',
  FE_URL: process.env.FE_URL ?? 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  ACCESS_TOKEN_EXPIRES_IN: Math.floor(ms((process.env.ACCESS_TOKEN_EXPIRE ?? '15m') as ms.StringValue) / 1000),
  REFRESH_TOKEN_EXPIRES_IN: Math.floor(ms((process.env.REFRESH_TOKEN_EXPIRE ?? '7d') as ms.StringValue) / 1000)
} as const
