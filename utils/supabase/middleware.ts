import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Create response first
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If no credentials, return early (for build time)
  if (!supabaseUrl || !supabaseKey) {
    return response
  }

  // Create Supabase client
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        // Set cookies on request for subsequent operations
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        // Set cookies on response
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, {
            ...options,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          })
        })
      },
    },
  })

  // Get user - this refreshes the session if needed
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define route types
  const pathname = request.nextUrl.pathname

  // Public routes (no auth required)
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/features',
    '/pricing',
    '/about',
    '/contact',
    '/faq',
    '/blog',
    '/docs',
    '/privacy',
    '/terms',
  ]

  // Protected routes (auth required)
  const protectedRoutes = ['/dashboard', '/settings', '/profile', '/admin']

  // Check route type
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  const isAuthRoute = ['/login', '/register', '/forgot-password'].includes(
    pathname
  )

  const isApiRoute = pathname.startsWith('/api/')

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users from auth routes
  if (isAuthRoute && user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  // API routes: return 401 for unauthenticated (not redirect)
  if (isApiRoute && !isPublicRoute && !user) {
    // Allow public API routes
    const publicApiPrefixes = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/forgot-password',
      '/api/auth/callback',
      '/api/health',
    ]

    if (!publicApiPrefixes.some((prefix) => pathname.startsWith(prefix))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return response
}
