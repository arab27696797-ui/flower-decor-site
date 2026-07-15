'use client'

import { useRouter } from 'next/navigation'
import { useState, type ReactNode } from 'react'

import type { PortfolioActionResult } from './actions'

type Props = {
  action: (formData: FormData) => Promise<PortfolioActionResult>
  children: ReactNode
  className?: string
}

export function PortfolioFormClient({ action, children, className }: Props) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setError(null)

    const result = await action(formData)

    setIsPending(false)

    if (result.ok) {
      router.refresh()
    } else {
      setError(result.error)
    }
  }

  return (
    <form action={handleSubmit} className={className}>
      {children}

      {error && (
        <div className="rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isPending && (
        <div className="text-sm text-brand-ink/60">Сохранение…</div>
      )}
    </form>
  )
}
