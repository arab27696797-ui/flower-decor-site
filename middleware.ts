// middleware.ts
// PRIMA Decor — Next.js Edge Middleware for admin route protection.
//
// IMPORTANT EDGE RUNTIME CONSTRAINT:
// Next.js middleware runs in the Edge Runtime, which does NOT support
// the full Node.js API. This means:
//   - `next/headers` (cookies()) is NOT available here — it is Node.js only.
//   - lib/admin-auth.ts uses `next/headers` → cannot be imported in middleware.
// Instead, we read the session cookie directly from the incoming Request object,
// which is the correct and only safe pattern in Edge middleware.
//
// AUTHENTICATION CONTRACT (from lib/admin-auth.ts, confirmed):
//   Cookie name:  'admin_session'  (ADMIN_COOKIE_NAME)
//   Cookie value: process.env.ADMIN_PASSWORD (raw string comparison)
//
// We replicate this check inline here. It is not duplication — it is the
// necessary adaptation of the same contract to the Edge runtime context.
//
// PROTECTED ROUTES:
//   /admin             — admin dashboard index
//   /admin/*           — all admin sub-pages (except /admin/login)
//   /api/admin/*       — all admin API routes (except /api/admin/login)
//
// PUBLIC ROUTES (no auth required):
//   /admin/login       — login page
//   /api/admin/login   — login API endpoint
//   /api/admin/logout  — logout must remain callable when authenticated;
//                        unauthenticated calls are harmless (cookie is already absent)
//   everything else    — public site, static assets, public API
//
// REDIRECT LOOP PREVENTION:
//   Unauthenticated → /admin/login  (page routes only)
//   Authenticated   → /admin/login redirects to /admin
//   /api/* unauthenticated → JSON 401 (no HTML redirect for API consumers)

import { NextRequest, NextResponse } from 'next/server'

// ---------------------------------------------------------------------------
// Constants — must match lib/admin-auth.ts exactly
// ---------------------------------------------------------------------------

const ADMIN_COOKIE_NAME = 'admin_session'
const LOGIN_PAGE        = '/admin/login'
const ADMIN_ROOT        = '/admin'

// ---------------------------------------------------------------------------
// Route matchers
// ---------------------------------------------------------------------------

/** Returns true if this is an admin API route that requires authentication. */
function isProtectedAdminApi(pathname: string): boolean {
  if (!pathname.startsWith('/api/admin/')) return false
  // Login is public — the only unprotected admin API endpoint.
  if (pathname === '/api/admin/login' || pathname.startsWith('/api/admin/login/')) return false
  // Logout is allowed to run regardless of auth state (deleting a missing cookie is a no-op).
  if (pathname === '/api/admin/logout' || pathname.startsWith('/api/admin/logout/')) return false
  return true
}

/** Returns true if this is an admin page route that requires authentication. */
function isProtectedAdminPage(pathname: string): boolean {
  if (!pathname.startsWith('/admin')) return false
  // Login page is the only public admin page.
  if (pathname === LOGIN_PAGE || pathname.startsWith(`${LOGIN_PAGE}/`)) return false
  return true
}

// ---------------------------------------------------------------------------
// Session check — Edge-runtime safe
// Reads the admin_session cookie directly from the request.
// Replicates lib/admin-auth.ts isAdminAuthenticated() for Edge context.
// ---------------------------------------------------------------------------

function isAuthenticated(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  const adminPassword = process.env.ADMIN_PASSWORD

  // If either is missing, the session is invalid.
  if (!sessionCookie || !adminPassword) return false

  return sessionCookie === adminPassword
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  const authenticated = isAuthenticated(request)

  // ---- Case 1: Protected admin API — return 401 JSON, never redirect ----
  if (isProtectedAdminApi(pathname)) {
    if (!authenticated) {
      return NextResponse.json(
        {
          ok: false,
          error: 'UNAUTHORIZED',
          message: 'Admin authentication required.',
        },
        { status: 401 }
      )
    }
    // Authenticated: let the request through.
    return NextResponse.next()
  }

  // ---- Case 2: /admin/login — redirect authenticated users away ----
  // Prevents the login page from being shown to an already-logged-in admin.
  if (pathname === LOGIN_PAGE || pathname.startsWith(`${LOGIN_PAGE}/`)) {
    if (authenticated) {
      const adminUrl = request.nextUrl.clone()
      adminUrl.pathname = ADMIN_ROOT
      return NextResponse.redirect(adminUrl)
    }
    // Unauthenticated: let them see the login page.
    return NextResponse.next()
  }

  // ---- Case 3: Protected admin pages — redirect to login if unauthenticated ----
  if (isProtectedAdminPage(pathname)) {
    if (!authenticated) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = LOGIN_PAGE
      // Preserve the intended destination for post-login redirect (future use).
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
    // Authenticated: let the request through.
    return NextResponse.next()
  }

  // ---- Case 4: Everything else — public site, pass through ----
  return NextResponse.next()
}

// ---------------------------------------------------------------------------
// Matcher configuration
// Limits which requests trigger this middleware.
// Excludes Next.js internals (_next/static, _next/image, favicon.ico, etc.)
// to avoid unnecessary middleware execution on static assets.
// ---------------------------------------------------------------------------

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     *   - _next/static  (static files)
     *   - _next/image   (image optimisation)
     *   - favicon.ico
     *   - public folder files (images, fonts, etc. at root)
     *
     * This regex matches any path that doesn't start with the above prefixes.
     * Admin and API routes are matched; public site routes are matched but
     * pass through immediately (Case 4) without any auth logic.
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|otf)).*)',
  ],
}
