import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type AdminSectionCardProps = {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function AdminSectionCard({
  title,
  description,
  actions,
  children,
  className,
}: AdminSectionCardProps) {
  return (
    <section className={cn('rounded-card border border-brand-ink/10 bg-white/90 shadow-card', className)}>
      {title || description || actions ? (
        <header className="flex flex-col gap-4 border-b border-brand-ink/10 px-5 py-4 md:flex-row md:items-start md:justify-between md:px-6">
          <div className="min-w-0">
            {title ? <h2 className="text-lg font-semibold leading-tight text-brand-ink">{title}</h2> : null}
            {description ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-brand-ink/70">{description}</p>
            ) : null}
          </div>

          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
        </header>
      ) : null}

      <div className="px-5 py-5 md:px-6 md:py-6">{children}</div>
    </section>
  )
}
