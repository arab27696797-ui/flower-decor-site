import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_COOKIE_NAME = 'admin_session'

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  const adminPassword = getAdminPassword()

  if (!session || !adminPassword) {
    return false
  }

  return session === adminPassword
}

export async function requireAdminAuth() {
  const isAuthenticated = await isAdminAuthenticated()

  if (!isAuthenticated) {
    redirect('/admin/login')
  }
}

export { ADMIN_COOKIE_NAME }
