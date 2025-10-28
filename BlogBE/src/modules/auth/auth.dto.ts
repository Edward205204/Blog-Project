import { z } from 'zod'
import { registerSchema, loginSchema } from './auth.schema.js'
import { TokenType, UserRole } from '~/generated/prisma/enums.js'

export type RegisterDto = z.infer<typeof registerSchema>['body']

export type LoginDto = z.infer<typeof loginSchema>['body']

export type TokenPayload = {
  id: string
  email: string
  tokenType: TokenType
  role: UserRole
}
