import Link from 'next/link'

import { cn } from '@/lib/utils'

export type AdminNavigationItem = {
  href: string
  label: string
  description?: string
  isActive?: boolean
}

type AdminNavigationProps = {
  items: AdminNavigationItem[]
}

export function AdminNavigation({ items }: AdminNavigationProps) {
  return (
    <nav
      aria-label="Навигация по админке"
      className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0"
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'group min-w-[220px] rounded-card border px-4 py-3 transition-colors duration-200 md:min-w-0',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream',
            item.isActive
              ? 'border-brand-forest/20 bg-brand-forest text-white shadow-card'
              : 'border-brand-ink/10 bg-white/80 text-brand-ink hover:border-brand-gold/50 hover:bg-white'
          )}
          aria-current={item.isActive ? 'page' : undefined}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div
                className={cn(
                  'text-sm font-semibold',
                  item.isActive ? 'text-white' : 'text-brand-ink'
                )}
              >
                {item.label}
              </div>
              {item.description ? (
                <p
                  className={cn(
                    'mt-1 text-xs leading-5',
                    item.isActive ? 'text-white/80' : 'text-brand-ink/65'
                  )}
                >
                  {item.description}
                </p>
              ) : null}
            </div>

            <span
              className={cn(
                'mt-1 h-2.5 w-2.5 shrink-0 rounded-full transition-colors',
                item.isActive
                  ? 'bg-brand-gold'
                  : 'bg-brand-ink/15 group-hover:bg-brand-gold/70'
              )}
            />
          </div>
        </Link>
      ))}
    </nav>
  )
}
