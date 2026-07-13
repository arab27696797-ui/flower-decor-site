// app/api/admin/login/route.ts
// PRIMA Decor — Admin login API endpoint.
//
// Accepts POST with { password: string } in the request body.
// This matches the exact payload sent by AdminLoginForm (confirmed in accepted file).
//
// AUTHENTICATION MODEL (confirmed from lib/admin-auth.ts):
//   - The admin session cookie is named ADMIN_COOKIE_NAME = 'admin_session'.
//   - The cookie value is the raw ADMIN_PASSWORD string itself.
//   - isAdminAuthenticated() verifies cookie.value === process.env.ADMIN_PASSWORD.
//   - This is a simple shared-secret pattern, not a signed/encrypted token.
//   - It matches exactly what the existing logout and requireAdminAuth helpers expect.
//
// SECURITY NOTES (honest, narrow scope):
//   - This is a single-password MVP pattern. Suitable for a private admin panel
//     behind a separate URL, not for a multi-user or public-facing system.
//   - The cookie is httpOnly, sameSite: lax, and secure in production —
//     consistent with the logout route settings in app/api/admin/logout/route.ts.
//   - Timing-safe comparison is used to avoid trivial timing attacks.
//   - No brute-force rate limiting is implemented at this layer; that requires
//     middleware or an edge function, which is a separate future step.
//
// RESPONSE CONTRACT:
//   Success: 200 { ok: true }
//   Validation error: 400 { ok: false, error: 'VALIDATION_ERROR' }
//   Wrong password: 401 { ok: false, error: 'INVALID_CREDENTIALS' }
//   Server misconfiguration: 500 { ok: false, error: 'SERVER_ERROR' }

import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { ADMIN_COOKIE_NAME } from '@/lib/admin-auth'

// ---------------------------------------------------------------------------
// Cookie configuration — mirrors the logout route for full symmetry.
// ---------------------------------------------------------------------------

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  // Session lasts 8 hours. Staff should re-authenticate each working day.
  maxAge: 60 * 60 * 8,
} as const

// ---------------------------------------------------------------------------
// Timing-safe string comparison
// Prevents trivial timing attacks when comparing passwords.
// Falls back to false if either argument is undefined/empty.
// ---------------------------------------------------------------------------

function timingSafeEqual(a: string, b: string): boolean {
  if (!a || !b) return false
  if (a.length !== b.length) {
    // Still consume time proportional to b.length to avoid length oracle.
    let mismatch = 1
    for (let i = 0; i < b.length; i++) {
      mismatch |= b.charCodeAt(i) ^ b.charCodeAt(i)
    }
    return mismatch === 0 // always false, but evaluated after the loop
  }

  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

// ---------------------------------------------------------------------------
// POST /api/admin/login
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  // ---- Parse request body ----
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'VALIDATION_ERROR' },
      { status: 400 }
    )
  }

  // ---- Validate shape ----
  if (
    typeof body !== 'object' ||
    body === null ||
    Array.isArray(body)
  ) {
    return NextResponse.json(
      { ok: false, error: 'VALIDATION_ERROR' },
      { status: 400 }
    )
  }

  const { password } = body as Record<string, unknown>

  if (typeof password !== 'string' || !password.trim()) {
    return NextResponse.json(
      { ok: false, error: 'VALIDATION_ERROR' },
      { status: 400 }
    )
  }

  // ---- Verify ADMIN_PASSWORD is configured ----
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    // ADMIN_PASSWORD env var is missing — misconfigured server.
    // Return 500 rather than silently accepting any password.
    console.error('[admin/login] ADMIN_PASSWORD environment variable is not set.')
    return NextResponse.json(
      { ok: false, error: 'SERVER_ERROR' },
      { status: 500 }
    )
  }

  // ---- Compare passwords ----
  const isValid = timingSafeEqual(password.trim(), adminPassword)

  if (!isValid) {
    return NextResponse.json(
      { ok: false, error: 'INVALID_CREDENTIALS' },
      { status: 401 }
    )
  }

  // ---- Set admin session cookie ----
  // Cookie value = the raw password string.
  // This matches the verification logic in lib/admin-auth.ts:
  //   isAdminAuthenticated() → cookie.value === process.env.ADMIN_PASSWORD
  const cookieStore = await cookies()

  cookieStore.set(ADMIN_COOKIE_NAME, adminPassword, COOKIE_OPTIONS)

  return NextResponse.json(
    { ok: true },
    { status: 200 }
  )
}
