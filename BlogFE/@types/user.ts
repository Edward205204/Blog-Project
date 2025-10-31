import { AccountStatus, UserRole } from '@/constants/user'

export interface User {
  id: string
  email: string
  account_status: AccountStatus
  name: string
  role: UserRole
  created_at: string
  updated_at: string
}
