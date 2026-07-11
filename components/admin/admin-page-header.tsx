import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type AdminPageHeaderProps = {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
}

export function AdminPageHeader({
  title,
  description,
  eyebrow,
  actions,
}: AdminPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-brand-ink/10 pb-5 md:flex-row md:items-end md:justify-between md:gap-6 md:pb-6">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-forest/70">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mt-1 text-2xl font-semibold leading-tight text-brand-ink md:text-[2rem]">
          {title}
        </h1>

        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-ink/70 md:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div
          className={cn(
            'flex flex-wrap items-center gap-3',
            'md:justify-end'
          )}
        >
          {actions}
        </div>
      ) : null}
    </header>
  )
}
