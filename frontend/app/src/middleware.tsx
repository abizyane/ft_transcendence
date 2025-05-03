import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access')?.value
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value
  if (request.nextUrl.pathname === '/auth/mfa') {
    return NextResponse.next()
  }
  if (request.nextUrl.pathname === '/' && isLoggedIn === undefined) 
  {
    return NextResponse.next()
  }
  if (!token && !request.url.includes('/auth/') && isLoggedIn !== 'True') {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  if (isLoggedIn === "True" && request.nextUrl.pathname === '/')
  {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  // if (isLoggedIn === 'True' && (request.nextUrl.pathname.includes('/auth/') || request.nextUrl.pathname === '/')) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    '/dashboard',
    '/chat/:id*',
    '/friends',
    '/game/',
    '/game/solo',
    '/game/solo/maps',
    '/game/solo/maps/:id*',
    '/game/solo/maps/matchmaking',
    '/game/tournaments',
    '/game/tournaments/:id*',
    '/ranking',
    '/settings',
    '/profile/:id*',
    '/history/:id*',
    '/((?!auth/).)',
    '/auth/:path*',
    "/auth/mfa"
  ],
}
