'use client'

// components/site/lead-form.tsx
// Lead capture form — fully rewritten to work with the new multi-accumulative
// calculator architecture (EstimateCart) and the accepted project stack:
// react-hook-form + zod + translation layer + /api/leads POST.
// Falls back gracefully to a contact-only form when no estimate is passed.

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import type { EstimateCart } from '@/lib/calculator-config'
import { useTranslations } from '@/lib/i18n'
import { useScrollReveal } from '../../hooks/use-scroll-reveal'

// ---------------------------------------------------------------------------
// Zod validation schema
// ---------------------------------------------------------------------------

const leadSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'name_too_short' })
    .max(80, { message: 'name_too_long' }),
  phone: z
    .string()
    .min(7, { message: 'phone_too_short' })
    .max(30, { message: 'phone_too_long' })
    .regex(/^[\d\s\+\-\(\)]+$/, { message: 'phone_invalid' }),
  location: z
    .string()
    .min(3, { message: 'location_too_short' })
    .max(200, { message: 'location_too_long' }),
  comment: z.string().max(1000, { message: 'comment_too_long' }).optional(),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: 'consent_required' }),
})

type LeadFormValues = z.infer<typeof leadSchema>

// ---------------------------------------------------------------------------
// Request payload type — matches /api/leads expected body
// ---------------------------------------------------------------------------

interface LeadRequestPayload {
  name:        string
  phone:       string
  location:    string
  comment:     string
  estimateCart: EstimateCart | null
  deviceType:  string
}

// ---------------------------------------------------------------------------
// Submission state
// ---------------------------------------------------------------------------

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface LeadFormProps {
  /**
   * Optional estimate cart from the calculator summary.
   * When null or undefined, the form works as a plain contact / request form.
   * When provided, the full cart is serialized into the POST body and
   * displayed as a read-only summary above the fields.
   */
  estimateCart?: EstimateCart | null

  /**
   * Optional: override the section id anchor (for scroll targeting).
   * Defaults to "lead-form".
   */
  sectionId?: string
}

// ---------------------------------------------------------------------------
// Sub-component: Estimate mini-summary (shown above form when cart is passed)
// ---------------------------------------------------------------------------

interface EstimateMiniSummaryProps {
  cart:   EstimateCart
  locale: 'ru' | 'en'
}

function EstimateMiniSummary({ cart, locale }: EstimateMiniSummaryProps) {
  const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽'

  return (
    <div className="rounded-lg bg-brand-cream border border-brand-gold/25 px-4 py-3 space-y-2">
      <p className="text-xs font-semibold text-brand-forest uppercase tracking-wide">
        {locale === 'en' ? 'Attached estimate' : 'Прикреплённая смета'}
      </p>
      <ul className="space-y-1">
        {cart.items.map((item) => (
          <li
            key={item.id}
            className="flex justify-between gap-3 text-xs text-brand-ink/70"
          >
            <span>
              {locale === 'en' ? item.categoryLabelEn : item.categoryLabelRu}
            </span>
            <span className="font-medium text-brand-ink/90 tabular-nums">
              {fmt(item.subtotalWithMarkup)}
            </span>
          </li>
        ))}
      </ul>
      <div className="pt-1.5 border-t border-brand-gold/20 flex justify-between text-xs font-semibold">
        <span className="text-brand-ink/60">
          {locale === 'en' ? 'Total (approximate)' : 'Итого (ориентировочно)'}
        </span>
        <span className="text-brand-forest">{fmt(cart.totalWithMarkup)}</span>
      </div>
      <p className="text-xs text-brand-ink/45 leading-relaxed">
        {locale === 'en'
          ? 'Approximate cost. Final price depends on measurements, composition, materials, delivery, urgency, and approval.'
          : 'Ориентировочная стоимость. Итоговая цена зависит от замеров, состава, материалов, доставки, срочности и согласования.'}
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Inline field error
// ---------------------------------------------------------------------------

interface FieldErrorProps {
  messageKey: string | undefined
  locale:     'ru' | 'en'
}

const fieldErrorMessages: Record<string, { ru: string; en: string }> = {
  name_too_short:    { ru: 'Введите имя (минимум 2 символа)',      en: 'Name must be at least 2 characters'      },
  name_too_long:     { ru: 'Имя слишком длинное',                  en: 'Name is too long'                        },
  phone_too_short:   { ru: 'Введите номер телефона',               en: 'Enter a phone number'                    },
  phone_too_long:    { ru: 'Номер слишком длинный',                en: 'Phone number is too long'                },
  phone_invalid:     { ru: 'Допустимы только цифры, +, -, (, )',   en: 'Only digits and +, -, (, ) are allowed'  },
  location_too_short:{ ru: 'Укажите адрес или площадку (мин. 3 симв.)', en: 'Enter location (min. 3 characters)' },
  location_too_long: { ru: 'Адрес слишком длинный',               en: 'Location is too long'                    },
  comment_too_long:  { ru: 'Комментарий слишком длинный',          en: 'Comment is too long'                     },
  consent_required:  { ru: 'Необходимо ваше согласие',             en: 'Your consent is required'                },
}

function FieldError({ messageKey, locale }: FieldErrorProps) {
  if (!messageKey) return null
  const entry = fieldErrorMessages[messageKey]
  const text  = entry
    ? locale === 'en' ? entry.en : entry.ru
    : messageKey

  return (
    <p role="alert" className="mt-1 text-xs text-red-600 leading-snug">
      {text}
    </p>
  )
}

// ---------------------------------------------------------------------------
// Shared input class helper
// ---------------------------------------------------------------------------

const inputClass = `
  w-full rounded-lg border border-brand-ink/20 bg-white
  px-3 py-2.5 text-sm text-brand-ink
  shadow-sm placeholder:text-brand-ink/35
  transition-colors duration-200
  focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40
`.trim()

const inputErrorClass = `
  w-full rounded-lg border border-red-400 bg-white
  px-3 py-2.5 text-sm text-brand-ink
  shadow-sm placeholder:text-brand-ink/35
  transition-colors duration-200
  focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-300/50
`.trim()

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function LeadForm({
  estimateCart = null,
  sectionId   = 'lead-form',
}: LeadFormProps) {
  const { t, locale } = useTranslations()
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name:     '',
      phone:    '',
      location: '',
      comment:  '',
      consent:  false,
    },
  })

  // Reset success state after 8 s so the form becomes reusable
  useEffect(() => {
    if (submitStatus !== 'success') return
    const timer = setTimeout(() => {
      setSubmitStatus('idle')
      reset()
    }, 8000)
    return () => clearTimeout(timer)
  }, [submitStatus, reset])

  // -------------------------------------------------------------------------
  // Form submission
  // -------------------------------------------------------------------------

  const onSubmit = async (values: LeadFormValues) => {
    setSubmitStatus('loading')

    const payload: LeadRequestPayload = {
      name:         values.name.trim(),
      phone:        values.phone.trim(),
      location:     values.location.trim(),
      comment:      values.comment?.trim() ?? '',
      estimateCart: estimateCart,
      deviceType:   typeof window !== 'undefined' && window.innerWidth < 768
                      ? 'mobile'
                      : 'desktop',
    }

    try {
      const res = await fetch('/api/leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })

      // Handle non-2xx gracefully without throwing
      if (!res.ok) {
        setSubmitStatus('error')
        return
      }

      const json = await res.json() as { ok?: boolean; error?: string }

      if (json.ok) {
        setSubmitStatus('success')
      } else {
        setSubmitStatus('error')
      }
    } catch {
      // Network failure
      setSubmitStatus('error')
    }
  }

  // -------------------------------------------------------------------------
  // Render: success state
  // -------------------------------------------------------------------------

  if (submitStatus === 'success') {
    return (
      <section
        id={sectionId}
        className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14"
      >
        <div className="rounded-xl border border-green-200 bg-green-50 px-6 py-10 text-center space-y-3">
          {/* Checkmark */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>

          <h2 className="font-display text-display-md text-brand-forest">
            {locale === 'en' ? 'Request sent!' : 'Заявка отправлена!'}
          </h2>

          <p className="text-sm text-brand-ink/70 max-w-[40ch] mx-auto leading-relaxed">
            {locale === 'en'
              ? 'Our team will contact you within 30 minutes during business hours to confirm the details.'
              : 'Наш менеджер свяжется с вами в течение 30 минут в рабочее время для уточнения деталей.'}
          </p>

          <p className="text-xs text-brand-ink/50 italic">
            {locale === 'en'
              ? 'PRIMA Decor — we take care of everything.'
              : 'PRIMA Decor — все заботы берём на себя.'}
          </p>
        </div>
      </section>
    )
  }

  // -------------------------------------------------------------------------
  // Render: form
  // -------------------------------------------------------------------------

  const hasEstimate = estimateCart !== null && estimateCart.items.length > 0

  return (
    <section
      id={sectionId}
      className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14"
    >
      {/* Section header — scroll-revealed */}
      <div
        ref={ref}
        className={`
          space-y-2 transition-all duration-700
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        <h2 className="font-display text-display-md text-brand-ink">
          {locale === 'en'
            ? 'Tell us about your event'
            : 'Расскажите о вашем мероприятии'}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-brand-ink/70 md:text-base">
          {locale === 'en'
            ? 'We will reach out via messenger or phone, clarify the details, and provide a confirmed quote.'
            : 'Мы свяжемся с вами в мессенджере или по телефону, уточним детали и подтвердим смету.'}
        </p>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5 rounded-xl border border-brand-ink/10 bg-white/95 p-5 shadow-card"
      >

        {/* Attached estimate mini-summary */}
        {hasEstimate && estimateCart && (
          <EstimateMiniSummary cart={estimateCart} locale={locale} />
        )}

        {/* If no estimate: informational strip */}
        {!hasEstimate && (
          <div className="rounded-lg bg-brand-forest/5 border border-brand-forest/12 px-4 py-3">
            <p className="text-xs text-brand-forest/75 leading-relaxed">
              {locale === 'en'
                ? 'You can use the calculator above to get an approximate estimate, or simply submit a request and we\'ll prepare one for you.'
                : 'Вы можете использовать калькулятор выше для предварительного расчёта или просто отправьте заявку — мы подготовим смету сами.'}
            </p>
          </div>
        )}

        {/* ---- Name ---- */}
        <div className="space-y-1.5">
          <label
            htmlFor="lead-name"
            className="block text-sm font-medium text-brand-ink"
          >
            {locale === 'en' ? 'Your name' : 'Ваше имя'}
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <input
            id="lead-name"
            type="text"
            autoComplete="name"
            placeholder={locale === 'en' ? 'Anna' : 'Анна'}
            className={errors.name ? inputErrorClass : inputClass}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'lead-name-error' : undefined}
            {...register('name')}
          />
          <div id="lead-name-error">
            <FieldError
              messageKey={errors.name?.message}
              locale={locale}
            />
          </div>
        </div>

        {/* ---- Phone ---- */}
        <div className="space-y-1.5">
          <label
            htmlFor="lead-phone"
            className="block text-sm font-medium text-brand-ink"
          >
            {locale === 'en' ? 'Phone / messenger' : 'Телефон / мессенджер'}
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <input
            id="lead-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+7 (999) 000-00-00"
            className={errors.phone ? inputErrorClass : inputClass}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'lead-phone-error' : undefined}
            {...register('phone')}
          />
          <div id="lead-phone-error">
            <FieldError
              messageKey={errors.phone?.message}
              locale={locale}
            />
          </div>
        </div>

        {/* ---- Location / venue ---- */}
        <div className="space-y-1.5">
          <label
            htmlFor="lead-location"
            className="block text-sm font-medium text-brand-ink"
          >
            {locale === 'en' ? 'Location / venue' : 'Адрес или площадка'}
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <input
            id="lead-location"
            type="text"
            autoComplete="street-address"
            placeholder={
              locale === 'en'
                ? 'Moscow, venue name or address'
                : 'Москва, название площадки или адрес'
            }
            className={errors.location ? inputErrorClass : inputClass}
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? 'lead-location-error' : undefined}
            {...register('location')}
          />
          <div id="lead-location-error">
            <FieldError
              messageKey={errors.location?.message}
              locale={locale}
            />
          </div>
        </div>

        {/* ---- Comment (optional) ---- */}
        <div className="space-y-1.5">
          <label
            htmlFor="lead-comment"
            className="block text-sm font-medium text-brand-ink"
          >
            {locale === 'en' ? 'Wishes / notes' : 'Пожелания / примечания'}
            <span className="ml-1.5 text-xs font-normal text-brand-ink/45">
              {locale === 'en' ? '(optional)' : '(необязательно)'}
            </span>
          </label>
          <textarea
            id="lead-comment"
            rows={4}
            placeholder={
              locale === 'en'
                ? 'Venue details, colour preferences, budget range, event date…'
                : 'Детали площадки, предпочтения по цветам, бюджет, дата мероприятия…'
            }
            className={`${errors.comment ? inputErrorClass : inputClass} resize-y min-h-[96px]`}
            aria-invalid={!!errors.comment}
            aria-describedby={errors.comment ? 'lead-comment-error' : undefined}
            {...register('comment')}
          />
          <div id="lead-comment-error">
            <FieldError
              messageKey={errors.comment?.message}
              locale={locale}
            />
          </div>
        </div>

        {/* ---- Consent checkbox ---- */}
        <div className="space-y-1">
          <div className="flex items-start gap-3">
            <input
              id="lead-consent"
              type="checkbox"
              className="
                mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded
                border-brand-ink/30 text-brand-forest
                focus:ring-brand-gold focus:ring-offset-0
                accent-brand-forest
              "
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? 'lead-consent-error' : undefined}
              {...register('consent')}
            />
            <label
              htmlFor="lead-consent"
              className="text-xs leading-relaxed text-brand-ink/60 cursor-pointer"
            >
              {locale === 'en' ? (
                <>
                  I agree to the{' '}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-brand-forest transition-colors"
                  >
                    processing of personal data
                  </a>{' '}
                  and to receive a reply to the provided contacts.
                </>
              ) : (
                <>
                  Я согласен(а) на{' '}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-brand-forest transition-colors"
                  >
                    обработку персональных данных
                  </a>{' '}
                  и получение ответа по указанным контактам.
                </>
              )}
            </label>
          </div>
          <div id="lead-consent-error" className="pl-7">
            <FieldError
              messageKey={errors.consent?.message}
              locale={locale}
            />
          </div>
        </div>

        {/* ---- Submit button ---- */}
        <button
          type="submit"
          disabled={isSubmitting || submitStatus === 'loading'}
          className="
            inline-flex w-full items-center justify-center gap-2
            rounded-lg bg-brand-forest px-5 py-3
            text-sm font-semibold text-white
            hover:bg-brand-forest/90 active:bg-brand-forest/80
            transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-brand-gold focus-visible:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-60
          "
        >
          {isSubmitting || submitStatus === 'loading' ? (
            <>
              {/* Spinner */}
              <svg
                className="h-4 w-4 animate-spin text-white/70"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              {locale === 'en' ? 'Sending…' : 'Отправляем…'}
            </>
          ) : (
            locale === 'en' ? 'Submit request →' : 'Отправить заявку →'
          )}
        </button>

        {/* ---- Network / server error state ---- */}
        {submitStatus === 'error' && (
          <div
            role="alert"
            className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          >
            {locale === 'en'
              ? 'Could not send the request. Please check your details and try again, or call us directly.'
              : 'Не удалось отправить заявку. Проверьте данные и попробуйте снова или позвоните нам напрямую.'}
          </div>
        )}

        {/* ---- Supporting brand note ---- */}
        <p className="text-xs leading-relaxed text-brand-ink/45 text-center">
          {locale === 'en'
            ? 'PRIMA Decor — full-service decoration, Moscow & MO, within 24 h. Urgent projects on the same day.'
            : 'PRIMA Decor — оформление под ключ, Москва и МО, за 24 часа. Срочные проекты — в день обращения.'}
        </p>
      </form>
    </section>
  )
}

export default LeadForm
