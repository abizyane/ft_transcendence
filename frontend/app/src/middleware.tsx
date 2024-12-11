import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access')?.value
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value
  if (!token && !request.url.includes('/auth/') && isLoggedIn !== 'True') {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  console.log('isLoggedIn ', isLoggedIn )
  console.log('request.url ', request.nextUrl.pathname )
  console.log('request.nextUrl.pathname === / ', request.nextUrl.pathname === '/')
  if (isLoggedIn === 'True' && (request.nextUrl.pathname.includes('/auth/') || request.nextUrl.pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  console.log('cookie exists, or path is under /auth/');
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/((?!auth/).)*',
    '/dashboard',
    '/chat/:id*',
    '/friends',
    '/game',
    '/ranking',
    '/settings',
    '/profile/:id*',
    '/((?!auth/).)',
    '/auth/:path*'
  ],
}
