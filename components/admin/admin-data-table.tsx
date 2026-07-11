import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type AdminTableColumn<T> = {
  key: string
  header: string
  className?: string
  render: (row: T) => ReactNode
}

type AdminDataTableProps<T> = {
  caption?: string
  columns: AdminTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  emptyState?: ReactNode
}

export function AdminDataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  emptyState,
}: AdminDataTableProps<T>) {
  if (rows.length === 0) {
    return emptyState ? <>{emptyState}</> : null
  }

  return (
    <div className="overflow-hidden rounded-card border border-brand-ink/10 bg-white/90 shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr className="border-b border-brand-ink/10 bg-brand-cream/70">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    'px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-forest/75',
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowKey(row)}
                className={cn(
                  'border-b border-brand-ink/10 last:border-b-0',
                  rowIndex % 2 === 0 ? 'bg-white' : 'bg-brand-cream/35',
                  'transition-colors duration-200 hover:bg-brand-gold/10'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn('px-4 py-4 align-top text-sm leading-6 text-brand-ink', column.className)}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
