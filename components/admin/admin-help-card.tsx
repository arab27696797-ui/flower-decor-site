import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type AdminHelpCardProps = {
  title: string
  description: string
  children?: ReactNode
  tone?: 'default' | 'soft'
}

export function AdminHelpCard({
  title,
  description,
  children,
  tone = 'soft',
}: AdminHelpCardProps) {
  return (
    <aside
      className={cn(
        'rounded-card border p-5 shadow-card md:p-6',
        tone === 'soft'
          ? 'border-brand-gold/30 bg-brand-gold/10 text-brand-ink'
          : 'border-brand-ink/10 bg-white/85 text-brand-ink'
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-forest/70">
        Подсказка
      </p>
      <h2 className="mt-2 text-lg font-semibold leading-tight text-brand-ink">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-brand-ink/75 md:text-base">
        {description}
      </p>

      {children ? <div className="mt-4 flex flex-col gap-3">{children}</div> : null}
    </aside>
  )
}
