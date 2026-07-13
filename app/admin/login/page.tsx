// app/admin/login/page.tsx
// PRIMA Decor — Admin login page (/admin/login).
//
// This page is intentionally minimal.
// All login UI, form state, API calls, and post-login redirect are
// fully handled inside the existing AdminLoginForm component.
// The component renders its own <main> wrapper and full-page layout,
// so this page acts purely as a route shell.
//
// AUTHENTICATION APPROACH:
// The existing AdminLoginForm posts to /api/admin/login (already in repo).
// On success, the server sets an admin session cookie and the client
// redirects to /admin via router.replace('/admin').
// This matches the pattern confirmed by the existing logout route at
// /api/admin/logout, which the AdminNavigation component also references.
//
// SERVER-SIDE REDIRECT (intentionally omitted):
// No server-side redirect from /admin/login → /admin for already-authenticated
// users is implemented here, because no confirmed server-side session check
// utility exists in the accepted architecture. If middleware.ts or a server
// auth helper is added in a future step, that redirect should live there —
// not in this page component. Rebuilding auth logic here would be unsafe duplication.
//
// This file must NOT be 'use client'. It is a plain server component route
// that simply mounts the client login form component.

import { AdminLoginForm } from '@/components/admin/admin-login-form'
import type { Metadata } from 'next'

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Вход — PRIMA Decor Admin',
  // Prevent search engines from indexing the admin login page.
  robots: {
    index: false,
    follow: false,
  },
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function AdminLoginPage() {
  // AdminLoginForm renders its own <main>, full-page layout, heading,
  // password field, error/success states, and post-login redirect.
  // No additional wrapping is needed or appropriate here.
  return <AdminLoginForm />
}
