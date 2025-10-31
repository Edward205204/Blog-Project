'use server'

import { cookies } from 'next/headers'

export async function LogoutAction() {
  const cookieStore = await cookies()
  if (!cookieStore.get('accessToken') || !cookieStore.get('refreshToken')) {
    return false
  }
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  return true
}
