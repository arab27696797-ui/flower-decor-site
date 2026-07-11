import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type AdminStatsCardProps = {
  label: string
  value: string | number
  hint?: string
  trend?: ReactNode
  tone?: 'default' | 'accent' | 'soft'
}

export function AdminStatsCard({
  label,
  value,
  hint,
  trend,
  tone = 'default',
}: AdminStatsCardProps) {
  return (
    <section
      className={cn(
        'rounded-card border p-4 shadow-card transition-colors duration-200 md:p-5',
        tone === 'accent' && 'border-brand-forest/15 bg-brand-forest text-white',
        tone === 'soft' && 'border-brand-gold/30 bg-brand-gold/10 text-brand-ink',
        tone === 'default' && 'border-brand-ink/10 bg-white/85 text-brand-ink'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className={cn(
              'text-xs font-semibold uppercase tracking-[0.16em]',
              tone === 'accent' ? 'text-white/75' : 'text-brand-forest/70'
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              'mt-3 text-2xl font-semibold leading-none md:text-3xl',
              tone === 'accent' ? 'text-white' : 'text-brand-ink'
            )}
          >
            {value}
          </p>
        </div>

        {trend ? (
          <div
            className={cn(
              'shrink-0 rounded-full border px-3 py-1 text-xs font-medium',
              tone === 'accent'
                ? 'border-white/15 bg-white/10 text-white'
                : 'border-brand-ink/10 bg-brand-cream text-brand-ink/80'
            )}
          >
            {trend}
          </div>
        ) : null}
      </div>

      {hint ? (
        <p
          className={cn(
            'mt-4 text-sm leading-6',
            tone === 'accent' ? 'text-white/85' : 'text-brand-ink/70'
          )}
        >
          {hint}
        </p>
      ) : null}
    </section>
  )
}
