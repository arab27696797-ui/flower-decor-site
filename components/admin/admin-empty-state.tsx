import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type AdminEmptyStateProps = {
  title: string
  description: string
  action?: ReactNode
  tone?: 'default' | 'soft'
}

export function AdminEmptyState({
  title,
  description,
  action,
  tone = 'default',
}: AdminEmptyStateProps) {
  return (
    <section
      className={cn(
        'rounded-card border p-6 text-left shadow-card md:p-8',
        tone === 'soft'
          ? 'border-brand-gold/30 bg-brand-gold/10'
          : 'border-brand-ink/10 bg-white/85'
      )}
    >
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-forest/70">
          Пока пусто
        </p>
        <h2 className="mt-2 text-xl font-semibold leading-tight text-brand-ink">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-brand-ink/70 md:text-base">
          {description}
        </p>

        {action ? <div className="mt-5 flex flex-wrap items-center gap-3">{action}</div> : null}
      </div>
    </section>
  )
}
