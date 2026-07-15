// app/admin/contacts/page.tsx
// Si-Si — Admin: Public Contact Information Editor.
//
// ARCHITECTURE STATUS:
// No contacts persistence API exists yet in this project.
// This page provides a complete, production-ready UI for editing contact data
// and is wired to POST /api/admin/contacts — which does NOT exist yet.
// Until that API is created, save attempts will return a 404 and the UI
// will surface an honest error message explaining this to staff.
//
// The form state, validation, field structure, and UX are fully implemented
// so that adding the API route in the next step requires zero UI changes.
//
// Staff-facing copy is in Russian. Code identifiers and comments are in English.

'use client'

import React, { useState } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ContactsConfig = {
  phoneDisplay: string      // Human-readable display: "+7 (999) 123-45-67"
  phoneTel: string          // tel: href value: "+79991234567"
  telegramHandle: string    // without @: "si-si"
  whatsappNumber: string    // international digits only: "79991234567"
  email: string
  instagramHandle: string   // without @: "si-si.decor"
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

// ---------------------------------------------------------------------------
// Default values — match the constants currently used in site components.
// When the API is connected, these will be replaced by the fetched values.
// ---------------------------------------------------------------------------

const DEFAULT_CONTACTS: ContactsConfig = {
  phoneDisplay: '+7 (999) 123-45-67',
  phoneTel: '+79991234567',
  telegramHandle: 'si-si',
  whatsappNumber: '79991234567',
  email: 'info@si-si.ru',
  instagramHandle: 'si-si.decor',
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

type ValidationErrors = Partial<Record<keyof ContactsConfig, string>>

function validate(data: ContactsConfig): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!data.phoneDisplay.trim()) {
    errors.phoneDisplay = 'Введите номер телефона для отображения на сайте.'
  }

  if (!data.phoneTel.trim()) {
    errors.phoneTel = 'Введите номер для ссылки tel: (только цифры и + в начале).'
  } else if (!/^\+\d{10,15}$/.test(data.phoneTel.trim())) {
    errors.phoneTel = 'Формат: +79991234567 (+ и от 10 до 15 цифр).'
  }

  if (!data.telegramHandle.trim()) {
    errors.telegramHandle = 'Введите Telegram-username без @.'
  } else if (/\s/.test(data.telegramHandle)) {
    errors.telegramHandle = 'Username не должен содержать пробелы.'
  }

  if (!data.whatsappNumber.trim()) {
    errors.whatsappNumber = 'Введите номер WhatsApp (только цифры, без +).'
  } else if (!/^\d{10,15}$/.test(data.whatsappNumber.trim())) {
    errors.whatsappNumber = 'Только цифры без + и пробелов. Пример: 79991234567.'
  }

  if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Введите корректный e-mail или оставьте поле пустым.'
  }

  if (data.instagramHandle.trim() && /\s/.test(data.instagramHandle)) {
    errors.instagramHandle = 'Username не должен содержать пробелы.'
  }

  return errors
}

// ---------------------------------------------------------------------------
// Sub-components — defined inline (single-file rule)
// ---------------------------------------------------------------------------

/** Labelled text input with optional error */
function ContactField({
  label,
  id,
  value,
  onChange,
  type = 'text',
  prefix,
  placeholder,
  description,
  error,
  autoComplete,
}: {
  label: string
  id: string
  value: string
  onChange: (val: string) => void
  type?: 'text' | 'email' | 'tel'
  prefix?: string
  placeholder?: string
  description?: string
  error?: string
  autoComplete?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-brand-ink"
      >
        {label}
      </label>

      {description && (
        <p className="text-xs text-brand-ink/50 leading-snug">{description}</p>
      )}

      <div className="flex items-center gap-0">
        {prefix && (
          <span
            aria-hidden="true"
            className="
              inline-flex items-center rounded-l-lg border border-r-0
              border-brand-ink/15 bg-brand-cream
              px-3 py-2 text-sm text-brand-ink/50
              select-none shrink-0
            "
          >
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          className={`
            w-full border border-brand-ink/15 bg-white
            px-3 py-2 text-sm text-brand-ink
            placeholder:text-brand-ink/30
            focus:outline-none focus:ring-2 focus:ring-brand-gold
            transition-shadow duration-150
            ${prefix ? 'rounded-r-lg' : 'rounded-lg'}
            ${error ? 'border-red-400 focus:ring-red-400' : ''}
          `}
        />
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-red-600 leading-snug"
        >
          {error}
        </p>
      )}
    </div>
  )
}

/** Section card */
function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section
      aria-labelledby={`section-${title.replace(/\s/g, '-')}`}
      className="
        rounded-xl border border-brand-ink/8
        bg-white shadow-card overflow-hidden
      "
    >
      <div className="px-6 py-4 border-b border-brand-ink/8 bg-brand-cream/60">
        <h2
          id={`section-${title.replace(/\s/g, '-')}`}
          className="font-display text-display-md text-brand-ink"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-xs text-brand-ink/50">{description}</p>
        )}
      </div>
      <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {children}
      </div>
    </section>
  )
}

/** Alert banner */
function Alert({
  type,
  children,
}: {
  type: 'info' | 'warning' | 'error' | 'success'
  children: React.ReactNode
}) {
  const styles: Record<string, string> = {
    info:    'bg-blue-50   border-blue-200   text-blue-800',
    warning: 'bg-amber-50  border-amber-200  text-amber-800',
    error:   'bg-red-50    border-red-200    text-red-800',
    success: 'bg-green-50  border-green-200  text-green-800',
  }
  const icons: Record<string, string> = {
    info: 'ℹ️', warning: '⚠️', error: '❌', success: '✅',
  }
  return (
    <div
      role="alert"
      className={`
        flex items-start gap-2.5 rounded-lg border
        px-4 py-3 text-sm leading-relaxed
        ${styles[type]}
      `}
    >
      <span aria-hidden="true" className="mt-0.5 shrink-0">{icons[type]}</span>
      <div>{children}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function AdminContactsPage() {
  const [data, setData]           = useState<ContactsConfig>(DEFAULT_CONTACTS)
  const [errors, setErrors]       = useState<ValidationErrors>({})
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)

  // ---- Field updater ----
  function setField<K extends keyof ContactsConfig>(key: K, val: string) {
    setData((prev) => ({ ...prev, [key]: val }))
    // Clear error for this field on change
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  // ---- Save ----
  async function handleSave() {
    const validationErrors = validate(data)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setSaveState('saving')
    setSaveError(null)

    try {
      // POST /api/admin/contacts — this route does not exist yet.
      // When it is created, no changes to this file will be required.
      const res = await fetch('/api/admin/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.status === 404) {
        // API not yet created — surface an honest, staff-friendly message.
        throw new Error(
          'API для сохранения контактов ещё не создан. ' +
          'Обратитесь к разработчику для подключения хранилища.'
        )
      }

      if (!res.ok) {
        const json = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(json.error ?? `Сервер вернул ошибку ${res.status}.`)
      }

      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 3500)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Неизвестная ошибка.')
      setSaveState('error')
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 space-y-8">

      {/* ---- Page header ---- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-display-lg text-brand-ink">
            Контактная информация
          </h1>
          <p className="mt-1 text-sm text-brand-ink/55">
            Номера телефонов, мессенджеры и социальные сети, отображаемые на сайте.
          </p>
        </div>

        {/* Save button */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saveState === 'saving'}
            aria-busy={saveState === 'saving'}
            className="
              inline-flex items-center gap-2
              rounded-lg bg-brand-forest px-5 py-2.5
              text-sm font-semibold text-white
              hover:bg-brand-forest-dark active:bg-brand-forest-dark
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-brand-gold focus-visible:ring-offset-2
            "
          >
            {saveState === 'saving' ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin"
                />
                Сохранение…
              </>
            ) : saveState === 'saved' ? (
              <>✓ Сохранено</>
            ) : (
              'Сохранить'
            )}
          </button>
        </div>
      </div>

      {/* ---- Architecture notice ---- */}
      <Alert type="warning">
        <strong>Статус интеграции:</strong> Форма полностью готова, но API для
        постоянного сохранения контактов ({' '}
        <code className="rounded bg-amber-100 px-1 text-xs font-mono">
          /api/admin/contacts
        </code>
        {' '}) ещё не создан. После нажатия «Сохранить» вы увидите сообщение об ошибке —
        это ожидаемо. Следующий шаг разработки: создать этот API-маршрут.
      </Alert>

      {/* ---- Save error ---- */}
      {saveState === 'error' && saveError && (
        <Alert type="error">
          <strong>Ошибка сохранения:</strong> {saveError}
        </Alert>
      )}

      {/* ---- Save success ---- */}
      {saveState === 'saved' && (
        <Alert type="success">
          Контактная информация сохранена успешно.
        </Alert>
      )}

      {/* ---- Instructions ---- */}
      <details className="rounded-xl border border-brand-ink/8 bg-brand-cream/50 overflow-hidden">
        <summary className="
          cursor-pointer select-none
          px-5 py-3.5 text-sm font-semibold text-brand-forest
          hover:bg-brand-cream transition-colors duration-150
          list-none flex items-center gap-2
        ">
          <span aria-hidden="true">📋</span>
          Инструкция по заполнению
        </summary>
        <div className="px-5 pb-4 pt-2 text-sm text-brand-ink/70 leading-relaxed space-y-2">
          <p>
            <strong>Телефон (отображение):</strong> номер в удобном для чтения формате,
            например <code className="rounded bg-brand-cream px-1 font-mono text-xs">+7 (999) 123-45-67</code>.
            Он показывается клиентам на сайте.
          </p>
          <p>
            <strong>Телефон (ссылка tel:):</strong> тот же номер без пробелов и скобок,
            только + и цифры: <code className="rounded bg-brand-cream px-1 font-mono text-xs">+79991234567</code>.
            Используется для кнопки «Позвонить» на мобильных устройствах.
          </p>
          <p>
            <strong>Telegram и Instagram:</strong> вводите username без символа @.
          </p>
          <p>
            <strong>WhatsApp:</strong> только цифры без + и пробелов, начиная с кода страны.
            Пример: <code className="rounded bg-brand-cream px-1 font-mono text-xs">79991234567</code>.
          </p>
        </div>
      </details>

      {/* ================================================================
          PHONE
         ================================================================ */}
      <Section
        title="Телефон"
        description="Основной контактный номер, отображаемый на сайте и используемый для кнопки звонка."
      >
        <ContactField
          id="phoneDisplay"
          label="Отображаемый номер"
          value={data.phoneDisplay}
          onChange={(v) => setField('phoneDisplay', v)}
          type="tel"
          placeholder="+7 (999) 123-45-67"
          description="Показывается клиентам в шапке, контактах и футере"
          error={errors.phoneDisplay}
          autoComplete="tel"
        />
        <ContactField
          id="phoneTel"
          label="Номер для ссылки tel:"
          value={data.phoneTel}
          onChange={(v) => setField('phoneTel', v)}
          type="tel"
          placeholder="+79991234567"
          description="Только + и цифры. Используется в href='tel:...'"
          error={errors.phoneTel}
          autoComplete="tel"
        />
      </Section>

      {/* ================================================================
          MESSENGERS
         ================================================================ */}
      <Section
        title="Мессенджеры"
        description="Ссылки на Telegram и WhatsApp для кнопок быстрой связи."
      >
        <ContactField
          id="telegramHandle"
          label="Telegram username"
          value={data.telegramHandle}
          onChange={(v) => setField('telegramHandle', v)}
          prefix="@"
          placeholder="si-si"
          description="Без символа @. Ссылка: t.me/si-si"
          error={errors.telegramHandle}
        />
        <ContactField
          id="whatsappNumber"
          label="WhatsApp номер"
          value={data.whatsappNumber}
          onChange={(v) => setField('whatsappNumber', v)}
          prefix="wa.me/"
          placeholder="79991234567"
          description="Только цифры, без +. Начинайте с кода страны."
          error={errors.whatsappNumber}
        />
      </Section>

      {/* ================================================================
          EMAIL & SOCIAL
         ================================================================ */}
      <Section
        title="Email и социальные сети"
        description="Контактная почта и публичные профили в соцсетях."
      >
        <ContactField
          id="email"
          label="Email"
          value={data.email}
          onChange={(v) => setField('email', v)}
          type="email"
          placeholder="info@si-si.ru"
          description="Деловая почта для клиентов (необязательно)"
          error={errors.email}
          autoComplete="email"
        />
        <ContactField
          id="instagramHandle"
          label="Instagram username"
          value={data.instagramHandle}
          onChange={(v) => setField('instagramHandle', v)}
          prefix="@"
          placeholder="si-si.decor"
          description="Без символа @. Необязательно."
          error={errors.instagramHandle}
        />
      </Section>

      {/* ---- Preview block ---- */}
      <section
        aria-label="Предпросмотр сгенерированных ссылок"
        className="rounded-xl border border-brand-ink/8 bg-brand-cream/50 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-brand-ink/8">
          <h2 className="font-display text-display-md text-brand-ink">
            Предпросмотр ссылок
          </h2>
          <p className="mt-0.5 text-xs text-brand-ink/50">
            Так будут выглядеть ссылки после сохранения. Проверьте перед публикацией.
          </p>
        </div>
        <dl className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {[
            {
              term: 'Звонок',
              value: `tel:${data.phoneTel}`,
              display: data.phoneDisplay,
            },
            {
              term: 'Telegram',
              value: `https://t.me/${data.telegramHandle}`,
              display: `t.me/${data.telegramHandle}`,
            },
            {
              term: 'WhatsApp',
              value: `https://wa.me/${data.whatsappNumber}`,
              display: `wa.me/${data.whatsappNumber}`,
            },
            ...(data.email
              ? [{ term: 'Email', value: `mailto:${data.email}`, display: data.email }]
              : []),
            ...(data.instagramHandle
              ? [{
                  term: 'Instagram',
                  value: `https://instagram.com/${data.instagramHandle}`,
                  display: `@${data.instagramHandle}`,
                }]
              : []),
          ].map(({ term, value, display }) => (
            <div key={term} className="flex flex-col gap-0.5">
              <dt className="text-xs font-semibold uppercase tracking-wider text-brand-ink/40">
                {term}
              </dt>
              <dd>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    text-brand-forest underline underline-offset-2
                    hover:text-brand-forest-dark transition-colors duration-150
                    break-all
                  "
                >
                  {display}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---- Bottom save button (repeated for long-page UX) ---- */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saveState === 'saving'}
          aria-busy={saveState === 'saving'}
          className="
            inline-flex items-center gap-2
            rounded-lg bg-brand-forest px-5 py-2.5
            text-sm font-semibold text-white
            hover:bg-brand-forest-dark active:bg-brand-forest-dark
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-brand-gold focus-visible:ring-offset-2
          "
        >
          {saveState === 'saving' ? 'Сохранение…' : 'Сохранить контакты'}
        </button>
      </div>

    </div>
  )
}
