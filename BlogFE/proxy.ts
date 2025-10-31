import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import URL from '@/constants/url'

const PUBLIC_ROUTES = [URL.LOGIN, URL.REGISTER]

export function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const url = request.nextUrl.clone()
  const path = url.pathname

  if (!token && path.startsWith('/protected')) {
    url.pathname = URL.LOGIN
    return NextResponse.redirect(url)
  }

  if (token && PUBLIC_ROUTES.includes(path as (typeof PUBLIC_ROUTES)[number])) {
    url.pathname = URL.HOME
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*']
}
