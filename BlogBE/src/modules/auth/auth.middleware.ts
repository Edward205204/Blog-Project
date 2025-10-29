import { validate } from '~/shared/middleware/validate.middleware.js'
import { loginSchema, refreshSchema, registerSchema } from './auth.schema.js'

export const registerValidation = validate(registerSchema)
export const loginValidation = validate(loginSchema)
export const refreshValidation = validate(refreshSchema)
