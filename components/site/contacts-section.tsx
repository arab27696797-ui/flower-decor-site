'use client'

// components/site/contacts-section.tsx
// Si-Si — Contacts section.
// Phone, Telegram, WhatsApp, service area, response time.
// All contact constants are isolated at the top for easy admin replacement later.
// External links use target="_blank" rel="noopener noreferrer" per security rules.

import React from 'react'
import { useTranslations } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Contact constants — replace these when contacts admin is wired up
// ---------------------------------------------------------------------------

const CONTACT_PHONE_DISPLAY  = '+7 (999) 000-00-00'
const CONTACT_PHONE_TEL      = '+79990000000'          // tel: href — digits only
const CONTACT_TELEGRAM_HANDLE = 'si-si_msk'       // without @
const CONTACT_WHATSAPP_NUMBER = '79990000000'          // digits only, with country code
const CONTACT_EMAIL           = 'info@si-si.ru'   // optional — shown in footer only
const CONTACT_INSTAGRAM       = 'si-si.msk'       // Instagram handle

// ---------------------------------------------------------------------------
// Inline SVG icons
// ---------------------------------------------------------------------------

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07
               A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38
               A2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72
               c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56
               a16 16 0 0 0 6.12 6.12l1.27-1.27a2 2 0 0 1 2.11-.45
               c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

function IconTelegram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d="M22 2 L11 13"
        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M22 2 L15 22 L11 13 L2 9 L22 2Z"
        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8
               8.5 8.5 0 0 1-7.6 4.7
               8.38 8.38 0 0 1-3.8-.9
               L3 21 l1.9-5.7
               a8.38 8.38 0 0 1-.9-3.8
               8.5 8.5 0 0 1 4.7-7.6
               8.38 8.38 0 0 1 3.8-.9
               h.5
               a8.48 8.48 0 0 1 8 8
               v.5Z" />
    </svg>
  )
}

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
      <path d="M12 21 C12 21 5 14 5 9 a7 7 0 0 1 14 0 c0 5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7 v5 l3.5 3.5" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Messenger button sub-component
// ---------------------------------------------------------------------------

interface MessengerButtonProps {
  href:         string
  icon:         React.ReactNode
  label:        string
  sublabel:     string
  colorClass:   string
  borderClass:  string
}

function MessengerButton({
  href,
  icon,
  label,
  sublabel,
  colorClass,
  borderClass,
}: MessengerButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`
        group flex items-center gap-3
        rounded-xl border ${borderClass}
        bg-white px-5 py-4
        shadow-sm hover:shadow-md
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-brand-gold focus-visible:ring-offset-2
      `}
    >
      <span
        aria-hidden="true"
        className={`
          flex h-10 w-10 shrink-0 items-center justify-center
          rounded-full ${colorClass}
          transition-transform duration-200 group-hover:scale-105
        `}
      >
        {icon}
      </span>
      <span className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-brand-ink leading-tight">
          {label}
        </span>
        <span className="text-xs text-brand-ink/50 mt-0.5 leading-tight">
          {sublabel}
        </span>
      </span>
      {/* Arrow */}
      <svg
        viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5}
        strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
        className="ml-auto h-4 w-4 text-brand-ink/30 group-hover:text-brand-ink/60
                   transition-colors shrink-0"
      >
        <path d="M3 8 h10 M9 4 l4 4-4 4" />
      </svg>
    </a>
  )
}

// ---------------------------------------------------------------------------
// Info row sub-component
// ---------------------------------------------------------------------------

interface InfoRowProps {
  icon:  React.ReactNode
  label: string
  value: string
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-brand-ink/6 last:border-0">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center
                       rounded-lg bg-brand-forest/8 text-brand-forest">
        {icon}
      </span>
      <span className="flex flex-col min-w-0">
        <span className="text-xs text-brand-ink/45 leading-tight">{label}</span>
        <span className="text-sm font-medium text-brand-ink leading-snug mt-0.5">{value}</span>
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

export function ContactsSection() {
  const { locale } = useTranslations()

  // ---- Localised strings --------------------------------------------------
  const sectionTitle = locale === 'en'
    ? 'Get in touch'
    : 'Свяжитесь с нами'

  const sectionSubtitle = locale === 'en'
    ? 'Call, write in Telegram or WhatsApp — we respond quickly and discuss your project without obligation.'
    : 'Позвоните, напишите в Telegram или WhatsApp — ответим быстро и обсудим ваш проект без обязательств.'

  const callCta = locale === 'en'
    ? 'Call now'
    : 'Позвонить'

  const requestCta = locale === 'en'
    ? 'Submit a request'
    : 'Оставить заявку'

  const labelRegion = locale === 'en' ? 'Service area'     : 'Регион работы'
  const valueRegion = locale === 'en'
    ? 'Moscow and Moscow region'
    : 'Москва и Московская область'

  const labelHours = locale === 'en' ? 'Working hours'    : 'Режим работы'
  const valueHours = locale === 'en'
    ? '7 days a week, 09:00 – 22:00'
    : '7 дней в неделю, 09:00 – 22:00'

  const labelUrgent = locale === 'en' ? 'Urgent orders'   : 'Срочные заказы'
  const valueUrgent = locale === 'en'
    ? 'Accepted same day — call us'
    : 'Принимаем в день обращения — звоните'

  const labelPhone  = locale === 'en' ? 'Phone'           : 'Телефон'

  const tgLabel      = locale === 'en' ? 'Telegram'                : 'Telegram'
  const tgSublabel   = locale === 'en' ? 'Write any time'          : 'Напишите в любое время'
  const waLabel      = locale === 'en' ? 'WhatsApp'                : 'WhatsApp'
  const waSublabel   = locale === 'en' ? 'Photos, details, quotes' : 'Фото, детали, расчёт'
  const igLabel      = locale === 'en' ? 'Instagram'               : 'Instagram'
  const igSublabel   = locale === 'en' ? 'Our work and portfolio'  : 'Наши работы и портфолио'

  const locationCardTitle = locale === 'en'
    ? 'We come to your venue'
    : 'Выезжаем на вашу площадку'

  const locationCardBody = locale === 'en'
    ? 'We work at any venue in Moscow and the Moscow region. Online consultation, site visit, measurement, and proposal — free of charge.'
    : 'Работаем на любой площадке в Москве и МО. Онлайн-консультация, выезд на объект, замер и предложение — бесплатно.'

  // -------------------------------------------------------------------------
  return (
    <section
      id="contacts"
      aria-labelledby="contacts-heading"
      className="bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">

        {/* ---- Section header ------------------------------------------ */}
        <div className="max-w-2xl mb-10 md:mb-14">
          <h2
            id="contacts-heading"
            className="font-display text-display-lg text-brand-ink leading-tight"
          >
            {sectionTitle}
          </h2>
          <p className="mt-3 text-base text-brand-ink/65 leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        {/* ---- Main grid: left col (CTAs) + right col (info) ------------ */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">

          {/* ---- Left column ------------------------------------------- */}
          <div className="flex flex-col gap-4">

            {/* Click-to-call primary CTA */}
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              aria-label={`${callCta}: ${CONTACT_PHONE_DISPLAY}`}
              className="
                group flex items-center gap-4
                rounded-xl bg-brand-forest text-white
                px-6 py-5 shadow-md
                hover:bg-brand-forest/90 active:bg-brand-forest/80
                transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-gold focus-visible:ring-offset-2
              "
            >
              <span
                aria-hidden="true"
                className="
                  flex h-11 w-11 shrink-0 items-center justify-center
                  rounded-full bg-white/15
                  transition-transform duration-200 group-hover:scale-105
                "
              >
                <IconPhone />
              </span>
              <span className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-widest text-white/60">
                  {callCta}
                </span>
                <span className="text-lg font-semibold tracking-wide mt-0.5">
                  {CONTACT_PHONE_DISPLAY}
                </span>
              </span>
            </a>

            {/* Messenger buttons */}
            <MessengerButton
              href={`https://t.me/${CONTACT_TELEGRAM_HANDLE}`}
              icon={<IconTelegram />}
              label={tgLabel}
              sublabel={tgSublabel}
              colorClass="bg-sky-50 text-sky-600"
              borderClass="border-sky-100"
            />

            <MessengerButton
              href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}`}
              icon={<IconWhatsApp />}
              label={waLabel}
              sublabel={waSublabel}
              colorClass="bg-green-50 text-green-600"
              borderClass="border-green-100"
            />

            <MessengerButton
              href={`https://instagram.com/${CONTACT_INSTAGRAM}`}
              icon={<IconInstagram />}
              label={igLabel}
              sublabel={igSublabel}
              colorClass="bg-rose-50 text-rose-500"
              borderClass="border-rose-100"
            />

            {/* Secondary lead-form CTA */}
            <a
              href="#lead-form"
              className="
                inline-flex items-center justify-center gap-2
                rounded-lg border border-brand-forest/25
                px-5 py-3 text-sm font-semibold text-brand-forest
                hover:bg-brand-forest/5 active:bg-brand-forest/10
                transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-gold focus-visible:ring-offset-2
              "
            >
              {requestCta}
            </a>
          </div>

          {/* ---- Right column ------------------------------------------ */}
          <div className="flex flex-col gap-4">

            {/* Info card */}
            <div className="rounded-xl border border-brand-ink/8 bg-brand-cream px-5 py-2 shadow-sm">
              <InfoRow
                icon={<IconPhone />}
                label={labelPhone}
                value={CONTACT_PHONE_DISPLAY}
              />
              <InfoRow
                icon={<IconPin />}
                label={labelRegion}
                value={valueRegion}
              />
              <InfoRow
                icon={<IconClock />}
                label={labelHours}
                value={valueHours}
              />
              <InfoRow
                icon={<IconClock />}
                label={labelUrgent}
                value={valueUrgent}
              />
            </div>

            {/* Location / service area card — replaces a map embed */}
            <div
              className="
                relative overflow-hidden
                rounded-xl border border-brand-ink/8
                bg-brand-forest text-white
                px-6 py-6 shadow-sm
              "
            >
              {/* Decorative background circle */}
              <div
                aria-hidden="true"
                className="
                  pointer-events-none absolute -right-10 -bottom-10
                  h-40 w-40 rounded-full
                  bg-white/5
                "
              />
              <div
                aria-hidden="true"
                className="
                  pointer-events-none absolute -right-4 -bottom-4
                  h-24 w-24 rounded-full
                  bg-brand-gold/15
                "
              />

              <div className="relative z-10 flex flex-col gap-3">
                <span className="flex h-10 w-10 items-center justify-center
                                  rounded-full bg-white/12 text-white">
                  <IconPin />
                </span>

                <h3 className="font-display text-base font-semibold text-white leading-snug">
                  {locationCardTitle}
                </h3>

                <p className="text-sm text-white/75 leading-relaxed max-w-xs">
                  {locationCardBody}
                </p>

                {/* Region pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(locale === 'en'
                    ? ['Moscow', 'Moscow region', 'New Moscow']
                    : ['Москва', 'Московская область', 'Новая Москва']
                  ).map((tag) => (
                    <span
                      key={tag}
                      className="
                        rounded-full bg-white/12 px-3 py-1
                        text-xs font-medium text-white/85
                      "
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

export default ContactsSection
