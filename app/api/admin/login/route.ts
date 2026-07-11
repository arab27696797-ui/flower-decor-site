import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { ADMIN_COOKIE_NAME, getAdminPassword } from '@/lib/admin-auth'

const loginSchema = z.object({
  password: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const adminPassword = getAdminPassword()

    if (!adminPassword || parsed.data.password !== adminPassword) {
      return NextResponse.json(
        { ok: false, error: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    const cookieStore = await cookies()
    cookieStore.set(ADMIN_COOKIE_NAME, adminPassword, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    )
  }
}
