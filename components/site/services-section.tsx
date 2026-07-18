'use client'

// components/site/services-section.tsx
// Si-Si — Services bento grid, "Noir Bloom" design.
// Five service cards in an asymmetric bento layout with hover glow,
// decorative line icons, and staggered reveal on scroll.

import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Service definitions — icons are decorative inline SVGs (stroke, 1.6px)
// ---------------------------------------------------------------------------

interface ServiceDef {
  id: string
  titleRu: string
  titleEn: string
  textRu: string
  textEn: string
  priceRu: string
  priceEn: string
  icon: JSX.Element
  // Bento placement (lg grid)
  span: string
}

const iconCls = 'h-7 w-7'
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const SERVICES: ServiceDef[] = [
  {
    id: 'artificial',
    titleRu: 'Оформление искусственными цветами',
    titleEn: 'Artificial floral styling',
    textRu:
      'Премиальная искусственная флористика, неотличимая от живой: фотозоны, входные группы, арки. Не вянет, не осыпается, живёт годами.',
    textEn:
      'Premium faux florals indistinguishable from fresh: photo zones, entrance groups, arches. Never wilts, never sheds, lasts for years.',
    priceRu: 'от 30 000 ₽',
    priceEn: 'from ₽30,000',
    span: 'lg:col-span-3',
    icon: (
      <svg viewBox="0 0 28 28" className={iconCls} {...stroke} aria-hidden="true">
        <circle cx="14" cy="9" r="3.2" />
        <path d="M14 12.2V26" />
        <path d="M14 16c-3.2 0-5.5-1.8-6.5-4.5 3-.4 5.3 1 6.5 4.5Z" />
        <path d="M14 19.5c3.2 0 5.5-1.8 6.5-4.5-3-.4-5.3 1-6.5 4.5Z" />
        <path d="M10.8 7.2 9 4.8M17.2 7.2 19 4.8" />
      </svg>
    ),
  },
  {
    id: 'fresh',
    titleRu: 'Оформление живыми цветами',
    titleEn: 'Fresh floral styling',
    textRu:
      'Сезонная живая флористика под концепцию события: композиции на столы, цветочные стены, подвесные инсталляции.',
    textEn:
      'Seasonal fresh floristry tailored to your event: table compositions, flower walls, hanging installations.',
    priceRu: 'от 45 000 ₽',
    priceEn: 'from ₽45,000',
    span: 'lg:col-span-3',
    icon: (
      <svg viewBox="0 0 28 28" className={iconCls} {...stroke} aria-hidden="true">
        <path d="M14 4c2.6 2.2 4 4.6 4 7a4 4 0 0 1-8 0c0-2.4 1.4-4.8 4-7Z" />
        <path d="M14 15v11" />
        <path d="M14 20c-2.8.6-5-.4-6.4-2.6C10 17 12.4 17.6 14 20Z" />
        <path d="M14 22.5c2.8.6 5-.4 6.4-2.6-2.4-.4-4.8.2-6.4 2.6Z" />
      </svg>
    ),
  },
  {
    id: 'balloons',
    titleRu: 'Оформление воздушными шарами',
    titleEn: 'Balloon styling',
    textRu:
      'Гирлянды, арки и фотозоны из шаров в фирменной палитре. Держат форму до 5 дней — праздник не заканчивается в полночь.',
    textEn:
      'Garlands, arches and photo zones in your brand palette. Balloons hold shape up to 5 days — the party outlives midnight.',
    priceRu: 'от 25 000 ₽',
    priceEn: 'from ₽25,000',
    span: 'lg:col-span-2',
    icon: (
      <svg viewBox="0 0 28 28" className={iconCls} {...stroke} aria-hidden="true">
        <path d="M14 3c3.6 0 6 2.6 6 6 0 4-3.4 7-6 7s-6-3-6-7c0-3.4 2.4-6 6-6Z" />
        <path d="m13 16-1 2h4l-1-2" />
        <path d="M14 18c-1 2.5 1 3.5 0 6" />
      </svg>
    ),
  },
  {
    id: 'bouquet',
    titleRu: 'Срочный букет',
    titleEn: 'Urgent bouquet',
    textRu:
      'Авторский букет за 2–3 часа по Москве. Когда поздравить нужно сегодня, а не «когда-нибудь».',
    textEn:
      'A signature bouquet within 2–3 hours across Moscow. When the congratulations are due today, not "someday".',
    priceRu: 'от 15 000 ₽',
    priceEn: 'from ₽15,000',
    span: 'lg:col-span-2',
    icon: (
      <svg viewBox="0 0 28 28" className={iconCls} {...stroke} aria-hidden="true">
        <path d="M9 11h10l-1.8 13a2 2 0 0 1-2 1.7h-2.4a2 2 0 0 1-2-1.7L9 11Z" />
        <path d="M11.5 11c0-3.5 1.1-5.5 2.5-7 1.4 1.5 2.5 3.5 2.5 7" />
        <path d="M14 11V4" />
      </svg>
    ),
  },
  {
    id: 'turnkey',
    titleRu: 'Мероприятие под ключ за 24 часа',
    titleEn: 'Turnkey event in 24 hours',
    textRu:
      'Полный цикл: концепция, эскиз, производство, доставка, монтаж и демонтаж. Одна команда, один договор, ноль хлопот.',
    textEn:
      'Full cycle: concept, sketch, production, delivery, installation and teardown. One team, one contract, zero hassle.',
    priceRu: 'от 80 000 ₽',
    priceEn: 'from ₽80,000',
    span: 'lg:col-span-2',
    icon: (
      <svg viewBox="0 0 28 28" className={iconCls} {...stroke} aria-hidden="true">
        <circle cx="14" cy="14" r="10" />
        <path d="M14 8v6l4.2 2.4" />
      </svg>
    ),
  },
]

// ---------------------------------------------------------------------------
// Motion variants
// ---------------------------------------------------------------------------

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ServicesSection() {
  const { locale } = useTranslations()
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative overflow-hidden bg-brand-midnight py-20 sm:py-24 lg:py-28">
      {/* Wine glow accent, right side */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-12%] top-[-10%] h-[30rem] w-[30rem] rounded-full bg-brand-wine/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-gold-dark">
            {locale === 'en' ? 'Services' : 'Услуги'}
          </p>
          <h2 className="font-display text-display-lg font-semibold text-brand-parchment">
            {locale === 'en' ? (
              <>
                Everything for{' '}
                <span className="text-gold-gradient italic">the celebration</span>
              </>
            ) : (
              <>
                Всё для{' '}
                <span className="text-gold-gradient italic">праздника</span>
              </>
            )}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-brand-stone sm:text-base">
            {locale === 'en'
              ? 'Five signature services — from a single urgent bouquet to full-scale event production.'
              : 'Пять фирменных услуг — от срочного букета до полного оформления мероприятия.'}
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.ul
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5"
        >
          {SERVICES.map((service) => (
            <motion.li
              key={service.id}
              variants={item}
              className={`glass-card glow-hover group relative flex flex-col gap-4 rounded-card p-6 lg:p-7 ${service.span}`}
            >
              {/* Icon chip */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-gold/25 bg-brand-gold/[0.08] text-brand-gold transition-colors duration-base group-hover:border-brand-gold/45 group-hover:text-brand-gold-light">
                {service.icon}
              </div>

              <div className="flex-1">
                <h3 className="font-display text-xl font-semibold leading-snug text-brand-parchment">
                  {locale === 'en' ? service.titleEn : service.titleRu}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-stone">
                  {locale === 'en' ? service.textEn : service.textRu}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-brand-midnight-border/60 pt-4">
                <span className="text-sm font-semibold text-brand-gold">
                  {locale === 'en' ? service.priceEn : service.priceRu}
                </span>
                <a
                  href="#calculator"
                  className="flex items-center gap-1.5 text-xs font-medium text-brand-stone transition-colors duration-base hover:text-brand-gold"
                >
                  {locale === 'en' ? 'Estimate' : 'Рассчитать'}
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 transition-transform duration-base group-hover:translate-x-0.5" aria-hidden="true">
                    <path d="M4 10h12M11 5l5 5-5 5" />
                  </svg>
                </a>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}
