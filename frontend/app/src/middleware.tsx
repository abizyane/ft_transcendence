import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access')?.value
  if (!token && !request.url.includes('/auth/')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard',
    '/chat',
    '/friends',
    '/game',
    '/ranking',
    '/settings',
    '/profile',
    '/((?!auth/).)'
  ],
}
