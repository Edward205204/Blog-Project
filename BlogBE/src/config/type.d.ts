import { User } from '../../modules/users/user.model'

declare global {
  namespace Express {
    export interface Request {
      user?: Omit<User, 'passwordHash'>
    }
  }
}
