'use client'

// components/site/advantages-section.tsx
// PRIMA Decor — Trust / Advantages section.
// Communicates key differentiators: speed, full-service, reliability, geography.
// No fabricated metrics — content is promise-based and factual.
// Uses useTranslations for all visible text.

import React from 'react'
import { useTranslations } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Advantage card definitions
// ---------------------------------------------------------------------------

interface AdvantageDef {
  id:            string
  titleRu:       string
  titleEn:       string
  bodyRu:        string
  bodyEn:        string
  icon:          React.ReactNode
}

// Inline SVG icons — monochrome, currentColor, no external dependency
function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7 v5 l3.5 3.5" />
    </svg>
  )
}

function IconTurnkey() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
      <path d="M9 11 l3 3 L22 4" />
      <path d="M21 12 v7 a2 2 0 0 1-2 2 H5 a2 2 0 0 1-2-2 V5 a2 2 0 0 1 2-2 h11" />
    </svg>
  )
}

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
      <path d="M12 21 C12 21 5 14 5 9 a7 7 0 0 1 14 0 c0 5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
      <path d="M12 3 L4 7 v6 c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9 V7 L12 3Z" />
      <path d="M9 12 l2 2 4-4" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
      <path d="M12 2 l3.09 6.26 L22 9.27 l-5 4.87 1.18 6.88 L12 17.77 5.82 21.02 7 14.14 2 9.27 l6.91-1.01 L12 2Z" />
    </svg>
  )
}

function IconWrench() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
      <path d="M14.7 6.3 a1 1 0 0 0 0 1.4 l1.6 1.6 a1 1 0 0 0 1.4 0 l3.77-3.77 a6 6 0 0 1-7.94 7.94 l-6.91 6.91 a2.12 2.12 0 0 1-3-3 l6.91-6.91 a6 6 0 0 1 7.94-7.94 l-3.76 3.76Z" />
    </svg>
  )
}

const ADVANTAGES: AdvantageDef[] = [
  {
    id:      'speed',
    titleRu: 'Готовы за 24 часа',
    titleEn: 'Ready in 24 Hours',
    bodyRu:  'Начинаем работу через 24 часа после подтверждения. Срочные заказы — в день обращения. Вы не ждёте неделями.',
    bodyEn:  'Work starts within 24 hours of confirmation. Urgent orders handled the same day. No week-long waits.',
    icon:    <IconClock />,
  },
  {
    id:      'turnkey',
    titleRu: 'Всё под ключ',
    titleEn: 'Fully Turnkey',
    bodyRu:  'Идея, подбор декора, материалы, доставка, монтаж и демонтаж — все заботы берём на себя. Вам ничего не нужно организовывать.',
    bodyEn:  'Concept, décor selection, materials, delivery, installation and removal — we handle everything. Nothing left for you to organise.',
    icon:    <IconTurnkey />,
  },
  {
    id:      'geography',
    titleRu: 'Москва и вся МО',
    titleEn: 'Moscow & Moscow Region',
    bodyRu:  'Работаем по всей Москве и Московской области. Выезд к объекту, доставка и монтаж в любой точке региона.',
    bodyEn:  'We operate across Moscow and the Moscow region. On-site visits, delivery, and installation anywhere in the area.',
    icon:    <IconPin />,
  },
  {
    id:      'reliability',
    titleRu: 'Надёжный монтаж',
    titleEn: 'Reliable Installation',
    bodyRu:  'Аккуратный монтаж без повреждений помещения. Полный демонтаж и вывоз после мероприятия — площадка остаётся чистой.',
    bodyEn:  'Careful installation with no damage to the venue. Full dismantling and removal after the event — the space is left clean.',
    icon:    <IconShield />,
  },
  {
    id:      'premium',
    titleRu: 'Premium-материалы',
    titleEn: 'Premium Materials',
    bodyRu:  'Отбираем только качественный декор: premium-искусственные цветы, свежие поставки, профессиональное флористическое оборудование.',
    bodyEn:  'We use only quality décor: premium artificial flowers, fresh deliveries, and professional floristry equipment.',
    icon:    <IconStar />,
  },
  {
    id:      'personal',
    titleRu: 'Личный подход',
    titleEn: 'Personal Approach',
    bodyRu:  'Каждый проект — индивидуально. Учитываем ваши пожелания, стиль события и особенности пространства.',
    bodyEn:  'Every project is individual. We consider your wishes, the event style, and the specifics of the space.',
    icon:    <IconWrench />,
  },
]

// ---------------------------------------------------------------------------
// Promise strip items
// ---------------------------------------------------------------------------

interface PromiseDef {
  ru: string
  en: string
}

const PROMISES: PromiseDef[] = [
  { ru: 'Старт работ через 24 ч после оплаты',   en: 'Work starts within 24 h of payment'       },
  { ru: 'Прозрачная смета без скрытых доплат',    en: 'Transparent quote — no hidden charges'    },
  { ru: 'Демонтаж и вывоз включены в стоимость',  en: 'Dismantling and removal included in price' },
  { ru: 'Работаем 7 дней в неделю',               en: 'We work 7 days a week'                    },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface AdvantageCardProps {
  adv:    AdvantageDef
  locale: 'ru' | 'en'
}

function AdvantageCard({ adv, locale }: AdvantageCardProps) {
  const title = locale === 'en' ? adv.titleEn : adv.titleRu
  const body  = locale === 'en' ? adv.bodyEn  : adv.bodyRu

  return (
    <article
      aria-label={title}
      className="
        flex flex-col gap-3
        rounded-xl border border-brand-ink/8
        bg-white p-5
        shadow-sm hover:shadow-md
        transition-shadow duration-300
      "
    >
      {/* Icon in accent circle */}
      <div
        aria-hidden="true"
        className="
          flex h-10 w-10 items-center justify-center
          rounded-full bg-brand-forest/8 text-brand-forest
        "
      >
        {adv.icon}
      </div>

      <h3 className="font-display text-base font-semibold text-brand-ink leading-snug">
        {title}
      </h3>

      <p className="text-sm text-brand-ink/65 leading-relaxed flex-1">
        {body}
      </p>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

export function AdvantagesSection() {
  const { locale } = useTranslations()

  const sectionTitle = locale === 'en'
    ? 'Why PRIMA Decor'
    : 'Почему PRIMA Decor'

  const sectionSubtitle = locale === 'en'
    ? 'We combine speed, quality, and complete operational responsibility — so your event runs flawlessly.'
    : 'Совмещаем скорость, качество и полную операционную ответственность — чтобы ваше мероприятие прошло безупречно.'

  const promiseTitle = locale === 'en'
    ? 'Our guarantees'
    : 'Наши гарантии'

  const ctaLabel = locale === 'en'
    ? 'Calculate cost and timeline →'
    : 'Рассчитать стоимость и сроки →'

  const ctaSecondary = locale === 'en'
    ? 'Or leave a request'
    : 'Или оставить заявку'

  return (
    <section
      id="advantages"
      aria-labelledby="advantages-heading"
      className="bg-brand-cream"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">

        {/* ---- Section header ------------------------------------------ */}
        <div className="max-w-2xl mb-10 md:mb-14">
          <h2
            id="advantages-heading"
            className="font-display text-display-lg text-brand-ink leading-tight"
          >
            {sectionTitle}
          </h2>
          <p className="mt-3 text-base text-brand-ink/65 leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        {/* ---- Advantage cards ----------------------------------------- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((adv) => (
            <AdvantageCard key={adv.id} adv={adv} locale={locale} />
          ))}
        </div>

        {/* ---- Promise strip ------------------------------------------- */}
        <div className="mt-10 rounded-xl bg-brand-forest text-white overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
              {promiseTitle}
            </p>
          </div>
          <ul
            role="list"
            className="
              grid grid-cols-1 divide-y divide-white/10
              sm:grid-cols-2 sm:divide-y-0 sm:divide-x
            "
          >
            {PROMISES.map((p, i) => {
              const text = locale === 'en' ? p.en : p.ru
              return (
                <li
                  key={i}
                  className="
                    flex items-start gap-3 px-5 py-4
                    text-sm text-white/85 leading-snug
                  "
                >
                  {/* checkmark */}
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold"
                  >
                    <path
                      d="M3 8 l3 3 7-7"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{text}</span>
                </li>
              )
            })}
          </ul>
        </div>

        {/* ---- Section CTA --------------------------------------------- */}
        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <a
            href="#calculator"
            className="
              inline-flex items-center gap-2 rounded-lg
              bg-brand-forest px-5 py-3
              text-sm font-semibold text-white
              hover:bg-brand-forest/90 active:bg-brand-forest/80
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-brand-gold focus-visible:ring-offset-2
            "
          >
            {ctaLabel}
          </a>

          <a
            href="#lead-form"
            className="
              text-sm font-medium text-brand-forest/70
              hover:text-brand-forest underline underline-offset-4
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-brand-gold rounded
            "
          >
            {ctaSecondary}
          </a>
        </div>

      </div>
    </section>
  )
}

export default AdvantagesSection
