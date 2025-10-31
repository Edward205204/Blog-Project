import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import URL from '@/constants/url'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = URL.LOGIN
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

// khi đặt file proxy ở trong folder thì nó tự áp dụng trong nội bộ folder có thể ko cần export config nữa
// export const config = {
//   matcher: '/(protected)/:path*'
// }
