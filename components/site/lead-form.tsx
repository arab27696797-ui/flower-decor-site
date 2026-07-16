'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, useReducedMotion } from 'framer-motion'

import type { EstimateCart } from '@/lib/calculator-config'
import { useTranslations } from '@/lib/i18n'

const leadSchema = z.object({
  name: z.string().min(2, { message: 'name_too_short' }).max(80, { message: 'name_too_long' }),
  phone: z
    .string()
    .min(7, { message: 'phone_too_short' })
    .max(30, { message: 'phone_too_long' })
    .regex(/^[\d\s\+\-\(\)]+$/, { message: 'phone_invalid' }),
  location: z.string().min(3, { message: 'location_too_short' }).max(200, { message: 'location_too_long' }),
  comment: z.string().max(1000, { message: 'comment_too_long' }).optional(),
  consent: z.boolean().refine((v) => v === true, { message: 'consent_required' }),
})

type LeadFormValues = z.infer<typeof leadSchema>

interface LeadRequestPayload {
  name: string
  phone: string
  location: string
  comment: string
  estimateCart: EstimateCart | null
  deviceType: string
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

interface LeadFormProps {
  estimateCart?: EstimateCart | null
  sectionId?: string
}

interface EstimateMiniSummaryProps {
  cart: EstimateCart
  locale: 'ru' | 'en'
}

function EstimateMiniSummary({ cart, locale }: EstimateMiniSummaryProps) {
  const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽'

  return (
    <div className="rounded-card border border-brand-gold/25 bg-brand-midnight-soft p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
        {locale === 'en' ? 'Attached estimate' : 'Прикреплённая смета'}
      </p>

      <ul className="mt-3 space-y-2">
        {cart.items.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-4 text-sm text-brand-stone"
          >
            <span>{locale === 'en' ? (item.categoryLabelEn ?? item.categoryLabelRu) : item.categoryLabelRu}</span>
            <span className="shrink-0 font-medium text-brand-parchment tabular-nums">
              {fmt(item.subtotalWithMarkup)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-brand-parchment/10 pt-4 text-sm font-semibold">
        <span className="text-brand-stone">
          {locale === 'en' ? 'Total (approximate)' : 'Итого (ориентировочно)'}
        </span>
        <span className="text-brand-gold">{fmt(cart.totalWithMarkup)}</span>
      </div>

      <p className="mt-3 text-xs leading-6 text-brand-stone-soft">
        {locale === 'en'
          ? 'Approximate cost. Final price depends on measurements, materials, logistics, urgency, and approval.'
          : 'Ориентировочная стоимость. Итоговая цена зависит от замеров, материалов, логистики, срочности и согласования.'}
      </p>
    </div>
  )
}

interface FieldErrorProps {
  messageKey: string | undefined
  locale: 'ru' | 'en'
}

const fieldErrorMessages: Record<string, { ru: string; en: string }> = {
  name_too_short: { ru: 'Введите имя (минимум 2 символа)', en: 'Name must be at least 2 characters' },
  name_too_long: { ru: 'Имя слишком длинное', en: 'Name is too long' },
  phone_too_short: { ru: 'Введите номер телефона', en: 'Enter a phone number' },
  phone_too_long: { ru: 'Номер слишком длинный', en: 'Phone number is too long' },
  phone_invalid: { ru: 'Допустимы только цифры, +, -, (, )', en: 'Only digits and +, -, (, ) are allowed' },
  location_too_short: { ru: 'Укажите адрес или площадку (мин. 3 симв.)', en: 'Enter location (min. 3 characters)' },
  location_too_long: { ru: 'Адрес слишком длинный', en: 'Location is too long' },
  comment_too_long: { ru: 'Комментарий слишком длинный', en: 'Comment is too long' },
  consent_required: { ru: 'Необходимо ваше согласие', en: 'Your consent is required' },
}

function FieldError({ messageKey, locale }: FieldErrorProps) {
  if (!messageKey) return null
  const entry = fieldErrorMessages[messageKey]
  const text = entry ? (locale === 'en' ? entry.en : entry.ru) : messageKey

  return (
    <p role="alert" className="mt-1 text-xs leading-snug text-red-300">
      {text}
    </p>
  )
}

const inputClass = `
  min-h-11 w-full rounded-card border border-brand-parchment/12 bg-brand-midnight-soft
  px-4 py-3 text-base text-brand-parchment
  shadow-dark-card placeholder:text-brand-stone-soft
  transition-[border-color,box-shadow,background-color] duration-200
  focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/25
`.trim()

const inputErrorClass = `
  min-h-11 w-full rounded-card border border-red-400/60 bg-brand-midnight-soft
  px-4 py-3 text-base text-brand-parchment
  shadow-dark-card placeholder:text-brand-stone-soft
  transition-[border-color,box-shadow,background-color] duration-200
  focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20
`.trim()

export function LeadForm({
  estimateCart = null,
  sectionId = 'lead-form',
}: LeadFormProps) {
  const { locale } = useTranslations()
  const reduceMotion = useReducedMotion()
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      phone: '',
      location: '',
      comment: '',
      consent: false,
    },
  })

  useEffect(() => {
    if (submitStatus !== 'success') return
    const timer = setTimeout(() => {
      setSubmitStatus('idle')
      reset()
    }, 8000)
    return () => clearTimeout(timer)
  }, [submitStatus, reset])

  const sectionAnimation = reduceMotion
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        transition: { duration: 0.4, ease: 'easeOut' as const },
      }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.75, ease: 'easeOut' as const },
      }

  const cardHover = reduceMotion
    ? {}
    : {
        whileHover: { y: -4 },
        transition: { duration: 0.2, ease: 'easeOut' as const },
      }

  const onSubmit = async (values: LeadFormValues) => {
    setSubmitStatus('loading')

    const payload: LeadRequestPayload = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      location: values.location.trim(),
      comment: values.comment?.trim() ?? '',
      estimateCart,
      deviceType:
        typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        setSubmitStatus('error')
        return
      }

      const json = (await res.json()) as { ok?: boolean; error?: string }

      if (json.ok) {
        setSubmitStatus('success')
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    }
  }

  if (submitStatus === 'success') {
    return (
      <section
        id={sectionId}
        className="bg-brand-midnight px-4 py-12 sm:px-6 md:py-16"
      >
        <motion.div
          initial={sectionAnimation.initial}
          whileInView={sectionAnimation.whileInView}
          viewport={{ once: true, amount: 0.2 }}
          transition={sectionAnimation.transition}
          className="mx-auto max-w-5xl rounded-[28px] border border-green-500/20 bg-green-500/10 p-8 text-center shadow-dark-card"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 text-green-300"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <h2 className="mt-4 font-display text-display-md text-brand-parchment">
            {locale === 'en' ? 'Request sent!' : 'Заявка отправлена!'}
          </h2>

          <p className="mx-auto mt-3 max-w-[42ch] text-sm leading-7 text-brand-stone sm:text-base">
            {locale === 'en'
              ? 'Our team will contact you shortly to confirm the details and next step.'
              : 'Скоро свяжемся с вами, чтобы уточнить детали и подтвердить следующий шаг.'}
          </p>
        </motion.div>
      </section>
    )
  }

  const hasEstimate = estimateCart !== null && estimateCart.items.length > 0

  return (
    <section
      id={sectionId}
      className="bg-brand-midnight px-4 py-12 text-brand-parchment sm:px-6 md:py-16"
    >
      <motion.div
        initial={sectionAnimation.initial}
        whileInView={sectionAnimation.whileInView}
        viewport={{ once: true, amount: 0.2 }}
        transition={sectionAnimation.transition}
        className="mx-auto max-w-5xl"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Si-Si
          </p>
          <h2 className="mt-3 font-display text-display-md text-brand-parchment">
            {locale === 'en' ? 'Tell us about your event' : 'Расскажите о вашем мероприятии'}
          </h2>
          <p className="mt-3 text-sm leading-7 text-brand-stone sm:text-base">
            {locale === 'en'
              ? 'We will contact you, align the mood, venue details, and prepare a confirmed proposal.'
              : 'Свяжемся с вами, согласуем настроение, площадку и подготовим подтверждённое предложение.'}
          </p>
        </div>

        <motion.form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          {...cardHover}
          className="mt-8 rounded-[28px] border border-brand-parchment/10 bg-brand-midnight-card p-5 shadow-dark-card sm:p-6 md:p-8"
        >
          <div className="space-y-5">
            {hasEstimate && estimateCart && (
              <EstimateMiniSummary cart={estimateCart} locale={locale} />
            )}

            {!hasEstimate && (
              <div className="rounded-card border border-brand-gold/15 bg-brand-gold/5 p-4">
                <p className="text-sm leading-6 text-brand-stone">
                  {locale === 'en'
                    ? 'No estimate attached yet. Send the request now, and we will prepare a tailored proposal for your venue and budget.'
                    : 'Смета пока не прикреплена. Отправьте заявку сейчас — подготовим предложение под вашу площадку и бюджет.'}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="lead-name" className="block text-sm font-medium text-brand-parchment">
                  {locale === 'en' ? 'Your name' : 'Ваше имя'}
                </label>
                <input
                  id="lead-name"
                  type="text"
                  autoComplete="name"
                  placeholder={locale === 'en' ? 'Anna' : 'Анна'}
                  className={errors.name ? inputErrorClass : inputClass}
                  aria-invalid={!!errors.name}
                  {...register('name')}
                />
                <FieldError messageKey={errors.name?.message} locale={locale} />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="lead-phone" className="block text-sm font-medium text-brand-parchment">
                  {locale === 'en' ? 'Phone / messenger' : 'Телефон / мессенджер'}
                </label>
                <input
                  id="lead-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+7 (999) 000-00-00"
                  className={errors.phone ? inputErrorClass : inputClass}
                  aria-invalid={!!errors.phone}
                  {...register('phone')}
                />
                <FieldError messageKey={errors.phone?.message} locale={locale} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="lead-location" className="block text-sm font-medium text-brand-parchment">
                {locale === 'en' ? 'Location / venue' : 'Адрес или площадка'}
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
                {...register('location')}
              />
              <FieldError messageKey={errors.location?.message} locale={locale} />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="lead-comment" className="block text-sm font-medium text-brand-parchment">
                {locale === 'en' ? 'Wishes / notes' : 'Пожелания / примечания'}
              </label>
              <textarea
                id="lead-comment"
                rows={5}
                placeholder={
                  locale === 'en'
                    ? 'Venue details, colour preferences, guest count, date, budget range…'
                    : 'Детали площадки, предпочтения по цветам, число гостей, дата, диапазон бюджета…'
                }
                className={`${errors.comment ? inputErrorClass : inputClass} min-h-[120px] resize-y`}
                aria-invalid={!!errors.comment}
                {...register('comment')}
              />
              <FieldError messageKey={errors.comment?.message} locale={locale} />
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <input
                  id="lead-consent"
                  type="checkbox"
                  className="
                    mt-1 h-4 w-4 shrink-0 cursor-pointer rounded
                    border-brand-parchment/30 bg-brand-midnight-soft
                    accent-brand-gold
                  "
                  aria-invalid={!!errors.consent}
                  {...register('consent')}
                />
                <label
                  htmlFor="lead-consent"
                  className="text-xs leading-6 text-brand-stone sm:text-sm"
                >
                  {locale === 'en' ? (
                    <>
                      I agree to the{' '}
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 transition-colors hover:text-brand-gold"
                      >
                        processing of personal data
                      </a>{' '}
                      and to receiving a reply using the provided contacts.
                    </>
                  ) : (
                    <>
                      Я согласен(а) на{' '}
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 transition-colors hover:text-brand-gold"
                      >
                        обработку персональных данных
                      </a>{' '}
                      и получение ответа по указанным контактам.
                    </>
                  )}
                </label>
              </div>

              <div className="pl-7">
                <FieldError messageKey={errors.consent?.message} locale={locale} />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting || submitStatus === 'loading'}
              {...cardHover}
              className="
                inline-flex min-h-11 w-full items-center justify-center gap-2
                rounded-card border border-brand-gold/70
                bg-brand-gold px-5 py-3
                text-sm font-semibold text-brand-midnight
                transition-[background-color,box-shadow,transform] duration-200
                hover:bg-brand-gold-light hover:shadow-dark-hover
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-gold focus-visible:ring-offset-2
                focus-visible:ring-offset-brand-midnight-card
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {isSubmitting || submitStatus === 'loading'
                ? locale === 'en'
                  ? 'Sending…'
                  : 'Отправляем…'
                : locale === 'en'
                  ? 'Submit request'
                  : 'Отправить заявку'}
            </motion.button>

            {submitStatus === 'error' && (
              <div
                role="alert"
                className="rounded-card border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                {locale === 'en'
                  ? 'Could not send the request. Please try again or contact us directly.'
                  : 'Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами напрямую.'}
              </div>
            )}

            <p className="text-center text-xs leading-6 text-brand-stone-soft">
              {locale === 'en'
                ? 'Si-Si — wedding decor, floral styling, balloon installations, and urgent bouquets in Moscow and the region.'
                : 'Si-Si — свадебный декор, флористика, оформление шарами и срочные букеты в Москве и области.'}
            </p>
          </div>
        </motion.form>
      </motion.div>
    </section>
  )
}

export default LeadForm
