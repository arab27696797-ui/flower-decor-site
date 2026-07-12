'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { AdminFormField } from '@/components/admin/admin-form-field'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminSectionCard } from '@/components/admin/admin-section-card'

type LoginState = {
  error: string | null
  success: string | null
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [state, setState] = useState<LoginState>({
    error: null,
    success: null,
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsSubmitting(true)
    setState({
      error: null,
      success: null,
    })

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const payload = (await response.json()) as { ok: boolean; error?: string }

      if (!response.ok || !payload.ok) {
        const errorMessage =
          payload.error === 'INVALID_CREDENTIALS'
            ? 'Неверный пароль. Проверьте данные и попробуйте снова.'
            : payload.error === 'VALIDATION_ERROR'
              ? 'Введите пароль для входа в панель.'
              : 'Не удалось выполнить вход. Попробуйте ещё раз.'

        setState({
          error: errorMessage,
          success: null,
        })

        return
      }

      setState({
        error: null,
        success: 'Вход выполнен. Перенаправляем в панель управления.',
      })

      router.replace('/admin')
      router.refresh()
    } catch {
      setState({
        error: 'Произошла ошибка сети. Попробуйте ещё раз.',
        success: null,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-brand-cream text-brand-ink">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <AdminPageHeader
          eyebrow="Admin access"
          title="Вход в панель управления"
          description="Используйте пароль администратора, чтобы открыть заявки, правила цен, подписки и портфолио."
        />

        <div className="mt-6 max-w-xl">
          <AdminSectionCard
            title="Авторизация"
            description="Для MVP используется вход по паролю из переменной окружения ADMIN_PASSWORD."
          >
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <AdminFormField
                id="password"
                label="Пароль"
                required
                error={state.error ?? undefined}
                hint={!state.error ? 'Пароль сверяется на сервере и сохраняет admin session cookie.' : undefined}
                inputProps={{
                  type: 'password',
                  name: 'password',
                  autoComplete: 'current-password',
                  placeholder: 'Введите пароль администратора',
                  value: password,
                  onChange: (event) => setPassword(event.target.value),
                  disabled: isSubmitting,
                }}
              />

              {state.success ? (
                <div className="rounded-card border border-brand-forest/15 bg-brand-forest/10 px-4 py-3 text-sm leading-6 text-brand-forest">
                  {state.success}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-11 items-center justify-center rounded-card bg-brand-forest px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-forest/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream disabled:cursor-not-allowed disabled:bg-brand-forest/55"
                >
                  {isSubmitting ? 'Выполняем вход...' : 'Войти'}
                </button>

                <p className="text-sm leading-6 text-brand-ink/65">
                  После успешного входа вы будете перенаправлены в административную панель.
                </p>
              </div>
            </form>
          </AdminSectionCard>
        </div>
      </div>
    </main>
  )
}
