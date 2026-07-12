import type { ReactNode } from 'react'

import { AdminShell } from '@/components/admin/admin-shell'
import type { AdminNavigationItem } from '@/components/admin/admin-navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'

const navigationItems: AdminNavigationItem[] = [
  {
    href: '/admin/leads',
    label: 'Заявки',
    description: 'Новые обращения и статусы клиентов.',
  },
  {
    href: '/admin/pricing',
    label: 'Правила цен',
    description: 'Диапазоны рынка, коэффициенты и наценка.',
  },
  {
    href: '/admin/pricing/history',
    label: 'История цен',
    description: 'Проверка прошлых изменений и правок.',
  },
  {
    href: '/admin/subscriptions',
    label: 'Подписки',
    description: 'Тарифы на обслуживание и регулярные выезды.',
  },
  {
    href: '/admin/portfolio',
    label: 'Портфолио',
    description: 'Фотографии работ для сайта и презентации.',
  },
]

type AdminLayoutProps = {
  children: ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const authenticated = await isAdminAuthenticated()

  const navigation = navigationItems.map((item) => ({
    ...item,
    description: authenticated ? item.description : undefined,
  }))

  return (
    <AdminShell title="Панель управления" navigation={navigation}>
      {children}
    </AdminShell>
  )
}
