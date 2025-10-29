import { TokenPayload } from '~/modules/auth/auth.dto.ts'
import { User } from '../../modules/users/user.model'

declare global {
  namespace Express {
    export interface Request {
      user?: Omit<User, 'passwordHash'>
      token_decoded?: TokenPayload
      refresh_token_decoded?: TokenPayload
    }
  }
}
