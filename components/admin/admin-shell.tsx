import type { ReactNode } from 'react'

import { AdminNavigation, type AdminNavigationItem } from '@/components/admin/admin-navigation'
import { cn } from '@/lib/utils'

type AdminShellProps = {
  title?: string
  navigation: AdminNavigationItem[]
  children: ReactNode
}

export function AdminShell({ title, navigation, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink md:grid md:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-b border-brand-ink/10 bg-white/70 backdrop-blur-sm md:border-b-0 md:border-r">
        <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-4 sm:px-6 md:max-w-none md:px-5 md:py-6">
          <div className="mb-5 flex items-center justify-between gap-3 md:mb-8 md:block">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-forest/70">
                Atelier Admin
              </p>
              <div className="mt-1 text-lg font-semibold text-brand-ink">
                {title ?? 'Панель управления'}
              </div>
            </div>
            <div className="rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1 text-xs font-medium text-brand-forest md:hidden">
              MVP
            </div>
          </div>

          <AdminNavigation items={navigation} />
        </div>
      </aside>

      <div className="min-w-0">
        <div className={cn('mx-auto flex w-full max-w-7xl flex-col px-4 py-5 sm:px-6 md:px-8 md:py-8')}>
          {children}
        </div>
      </div>
    </div>
  )
}
