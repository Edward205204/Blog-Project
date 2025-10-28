import { validate } from '~/shared/middleware/validate.middleware.js'
import { loginSchema, registerSchema } from './auth.schema.js'

export const registerValidation = validate(registerSchema)
export const loginValidation = validate(loginSchema)
