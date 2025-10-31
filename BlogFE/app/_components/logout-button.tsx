'use client'

import { Button } from '@/components/ui/button'
import URL from '@/constants/url'
import { LogoutAction } from '@/lib/logout'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  const handleLogout = async () => {
    const result = await LogoutAction()
    if (!result) {
      return
    }
    router.push(URL.LOGIN)
  }
  return (
    <Button variant='outline' onClick={handleLogout}>
      Đăng xuất
    </Button>
  )
}
