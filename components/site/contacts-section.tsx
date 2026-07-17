'use client'

// components/site/contacts-section.tsx
// Si-Si — Contacts section, "Noir Bloom" design.
// Contact channels as glass cards with gold icon chips; phone CTA with sheen.

import { motion } from 'framer-motion'
import { useTranslations } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Contact constants — real business contacts
// ---------------------------------------------------------------------------

const CONTACT_PHONE_DISPLAY   = '+7 (495) 792-18-98'
const CONTACT_PHONE_TEL       = '+74957921898'      // tel: href — digits only
const CONTACT_PHONE2_DISPLAY  = '+7 (903) 792-18-98'
const CONTACT_PHONE2_TEL      = '+79037921898'
const CONTACT_TELEGRAM_HANDLE = 'SI_SI_Dekor'       // without @
const CONTACT_WHATSAPP_NUMBER = '79037921898'       // digits only, with country code
const CONTACT_EMAIL           = 'sisidekor860@xmail.ru'
const CONTACT_INSTAGRAM       = 'si_si_dekor'       // Instagram handle

// ---------------------------------------------------------------------------
// Motion variants
// ---------------------------------------------------------------------------

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' as const },
  },
}

// ---------------------------------------------------------------------------
// Channel icons
// ---------------------------------------------------------------------------

function ChannelIcon({ kind }: { kind: 'telegram' | 'whatsapp' | 'instagram' }) {
  const cls = 'h-5 w-5'
  if (kind === 'telegram') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true">
        <path d="M21.9 4.6 18.8 19c-.2 1-.8 1.2-1.6.8l-4.5-3.3-2.2 2.1c-.2.2-.4.4-.9.4l.3-4.6 8.4-7.6c.4-.3-.1-.5-.6-.2L7.3 13.2l-4.4-1.4c-1-.3-1-1 .2-1.4l17.2-6.6c.8-.3 1.5.2 1.6.8Z" />
      </svg>
    )
  }
  if (kind === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden="true">
        <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Z" />
        <path d="M8.8 8.9c.2-.5.5-.5.8-.5h.6c.2 0 .4 0 .6.4l.8 1.9c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.4 0 .6.5.9 1.4 1.8 2.5 2.3.3.1.5.1.6-.1l.6-.7c.2-.2.4-.3.6-.2l1.9.9c.3.2.4.4.4.6-.1.6-.5 1.4-1 1.6-.5.3-1.2.4-2 .1-2.4-.8-4.7-3-5.6-5.3-.3-.8-.2-1.5.1-2 .1-.3.3-.5.5-.7Z" fill="currentColor" stroke="none" opacity="0.9" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ContactsSection() {
  const { locale } = useTranslations()

  const channels = [
    {
      kind: 'telegram' as const,
      label: 'Telegram',
      sublabel: locale === 'en' ? 'Write any time' : 'Напишите в любое время',
      href: `https://t.me/${CONTACT_TELEGRAM_HANDLE}`,
      value: `@${CONTACT_TELEGRAM_HANDLE}`,
    },
    {
      kind: 'whatsapp' as const,
      label: 'WhatsApp',
      sublabel: locale === 'en' ? 'Photos, details, quotes' : 'Фото, детали, расчёт',
      href: `https://wa.me/${CONTACT_WHATSAPP_NUMBER}`,
      value: CONTACT_PHONE2_DISPLAY,
    },
    {
      kind: 'instagram' as const,
      label: 'Instagram',
      sublabel: locale === 'en' ? 'Our work and portfolio' : 'Наши работы и портфолио',
      href: `https://instagram.com/${CONTACT_INSTAGRAM}`,
      value: `@${CONTACT_INSTAGRAM}`,
    },
  ]

  return (
    <div className="relative overflow-hidden bg-brand-onyx-soft py-20 sm:py-24 lg:py-28">
      {/* Gold glow behind the phone card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-0 h-[24rem] w-[24rem] rounded-full bg-brand-gold/[0.06] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-gold">
            {locale === 'en' ? 'Contacts' : 'Контакты'}
          </p>
          <h2 className="font-display text-display-lg font-semibold text-brand-parchment">
            {locale === 'en' ? (
              <>
                Tell us about{' '}
                <span className="text-gold-gradient italic">your event</span>
              </>
            ) : (
              <>
                Расскажите о{' '}
                <span className="text-gold-gradient italic">вашем событии</span>
              </>
            )}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-brand-stone sm:text-base">
            {locale === 'en'
              ? 'Call, write in any messenger, or leave a request — we reply within 30 minutes during working hours.'
              : 'Позвоните, напишите в любой мессенджер или оставьте заявку — отвечаем в течение 30 минут в рабочее время.'}
          </p>
        </motion.div>

        <motion.div
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5"
        >
          {/* Phone card — primary */}
          <motion.a
            variants={item}
            href={`tel:${CONTACT_PHONE_TEL}`}
            className="glass-card glow-hover group flex flex-col gap-4 rounded-card p-6 lg:p-8"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-gold/25 bg-brand-gold/[0.08] text-brand-gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                <path d="M5 4h4l1.5 4L8 10c1 2.5 3.5 5 6 6l2-2.5 4 1.5v4c0 1-1 2-2 2C9.5 20.5 3.5 14.5 3 6c0-1 1-2 2-2Z" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-brand-stone">
                {locale === 'en' ? 'Phone' : 'Телефон'}
              </p>
              <p className="mt-2 font-display text-2xl font-semibold text-brand-parchment transition-colors group-hover:text-brand-gold-light sm:text-3xl">
                {CONTACT_PHONE_DISPLAY}
              </p>
              <p className="mt-1 font-display text-xl font-semibold text-brand-parchment/80 transition-colors group-hover:text-brand-gold-light sm:text-2xl">
                {CONTACT_PHONE2_DISPLAY}
              </p>
              <p className="mt-2 text-sm text-brand-stone">
                {locale === 'en'
                  ? 'Daily 09:00–22:00, urgent orders — around the clock'
                  : 'Ежедневно 09:00–22:00, срочные заказы — круглосуточно'}
              </p>
            </div>
          </motion.a>

          {/* Region & hours card */}
          <motion.div
            variants={item}
            className="glass-card flex flex-col gap-5 rounded-card p-6 lg:p-8"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-gold/25 bg-brand-gold/[0.08] text-brand-gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
                <circle cx="12" cy="10" r="2.6" />
              </svg>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-brand-stone">
                  {locale === 'en' ? 'Service area' : 'Регион работы'}
                </p>
                <p className="mt-1.5 font-medium text-brand-parchment">
                  {locale === 'en'
                    ? 'Moscow & Moscow region'
                    : 'Москва и Московская область'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-brand-stone">
                  {locale === 'en' ? 'Working hours' : 'Режим работы'}
                </p>
                <p className="mt-1.5 font-medium text-brand-parchment">
                  {locale === 'en' ? 'Daily, 09:00–22:00' : 'Ежедневно, 09:00–22:00'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-brand-stone">
                  E-mail
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-1.5 inline-block font-medium text-brand-gold underline-offset-4 transition-colors hover:text-brand-gold-light hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Messenger channels */}
          <motion.div variants={item} className="flex flex-col gap-4">
            {channels.map((channel) => (
              <a
                key={channel.kind}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card glow-hover group flex flex-1 items-center gap-4 rounded-card p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-gold/25 bg-brand-gold/[0.08] text-brand-gold transition-colors group-hover:text-brand-gold-light">
                  <ChannelIcon kind={channel.kind} />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-brand-parchment">
                    {channel.label}
                    <span className="ml-2 text-sm text-brand-stone">{channel.value}</span>
                  </p>
                  <p className="truncate text-xs text-brand-stone">{channel.sublabel}</p>
                </div>
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="ml-auto h-4 w-4 shrink-0 text-brand-stone transition-all duration-base group-hover:translate-x-0.5 group-hover:text-brand-gold" aria-hidden="true">
                  <path d="M4 10h12M11 5l5 5-5 5" />
                </svg>
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="mt-12 text-center"
        >
          <a
            href="#contact"
            className="btn-gold-sheen animate-sheen inline-flex min-h-11 items-center gap-2 rounded-btn px-7 py-3 text-sm font-semibold text-brand-ink shadow-gold-glow transition-transform duration-base hover:-translate-y-0.5"
          >
            {locale === 'en' ? 'Leave a request' : 'Оставить заявку'}
          </a>
        </motion.div>
      </div>
    </div>
  )
}
