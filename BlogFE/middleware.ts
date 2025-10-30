// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // ví dụ: chặn user chưa login
  const token = request.cookies.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// (tuỳ chọn)
export const config = {
  matcher: ['/dashboard/:path*'] // chỉ áp dụng với route cụ thể
}
