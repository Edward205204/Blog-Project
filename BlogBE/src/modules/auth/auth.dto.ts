import { z } from 'zod'
import { registerSchema, loginSchema, refreshSchema } from './auth.schema.js'
import { TokenType, UserRole } from '~/generated/prisma/enums.js'

export type RegisterDto = z.infer<typeof registerSchema>['body']

export type LoginDto = z.infer<typeof loginSchema>['body']

export type RefreshDto = z.infer<typeof refreshSchema>['body']

export type TokenPayload = {
  user_id: string
  email: string
  tokenType: TokenType
  role: UserRole
}
