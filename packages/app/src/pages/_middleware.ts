import type { NextFetchEvent, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const publicPages = ['/', '/login', '/design']

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const page = req.nextUrl.pathname
  const authenticated = Boolean(req.cookies.token)

  // Redirect authenticated users to their releases instead of the homepage
  if (authenticated && page === '/') return NextResponse.rewrite('/releases')
  // Allow users to go forward in case of a public page or if they are authenticated
  if (publicPages.includes(page) || authenticated) return NextResponse.next()

  return NextResponse.rewrite('/login')
}
