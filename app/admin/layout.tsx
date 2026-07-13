// app/admin/layout.tsx
// PRIMA Decor — Shared layout for all /admin routes.
//
// Uses the existing AdminShell and AdminNavigation components from the repo.
// AdminShell renders a two-column grid: sidebar (navigation) + main content area.
// AdminNavigation is a client component that reads usePathname() for active state.
//
// This layout is a SERVER COMPONENT by default (no 'use client' directive).
// It passes navigation config down to AdminShell which wires it into AdminNavigation.
//
// Routing:
//   /admin/pricing       — Calculator pricing configuration (implemented)
//   /admin/portfolio     — Gallery / portfolio management (future)
//   /admin/contacts      — Phone numbers, messengers, social links (future)
//   /admin/leads         — Submitted lead requests (future)
//
// Future nav items are listed but their href routes do not exist yet.
// They will render as visible nav links; 404 is acceptable until those pages exist.

import type { ReactNode } from 'react'
import type { AdminNavigationItem } from '@/components/admin/admin-navigation'
import { AdminShell } from '@/components/admin/admin-shell'

// ---------------------------------------------------------------------------
// Navigation items
// Each entry is visible in the sidebar / horizontal scroll bar on mobile.
// Add new admin pages here as they are created.
// ---------------------------------------------------------------------------

const ADMIN_NAV_ITEMS: AdminNavigationItem[] = [
  {
    href: '/admin/pricing',
    label: 'Цены калькулятора',
    description: 'Базовые цены и наценка',
  },
  {
    href: '/admin/portfolio',
    label: 'Портфолио',
    description: 'Фото и видео работ',
  },
  {
    href: '/admin/contacts',
    label: 'Контакты',
    description: 'Телефон, мессенджеры, соцсети',
  },
  {
    href: '/admin/leads',
    label: 'Заявки',
    description: 'Входящие заявки с сайта',
  },
]

// ---------------------------------------------------------------------------
// Layout component
// ---------------------------------------------------------------------------

type AdminLayoutProps = {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminShell
      title="PRIMA Decor"
      navigation={ADMIN_NAV_ITEMS}
    >
      {children}
    </AdminShell>
  )
}
