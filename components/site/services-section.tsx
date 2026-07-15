'use client'

// components/site/services-section.tsx
// Si-Si — Services section.
// Presents all 5 core service offerings with semantic HTML and responsive layout.
// Uses useTranslations for all visible text.
// Includes section-level CTA pointing to the calculator.

import React from 'react'
import { useTranslations } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Service definitions — static config, copy resolved via locale at render time
// ---------------------------------------------------------------------------

interface ServiceDef {
  id:            string
  labelRu:       string
  labelEn:       string
  descriptionRu: string
  descriptionEn: string
  detailRu:      string   // short supporting microcopy / key fact
  detailEn:      string
  icon:          React.ReactNode
  accentClass:   string   // Tailwind background tint for the icon container
  badge?:        { ru: string; en: string }
}

// Inline SVG icons — no external dependency, monochrome, uses currentColor
function IconFlowerArtificial() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
      <circle cx="12" cy="12" r="2.5" />
      <ellipse cx="12" cy="5.5" rx="2" ry="3.5" />
      <ellipse cx="12" cy="18.5" rx="2" ry="3.5" />
      <ellipse cx="5.5" cy="12" rx="3.5" ry="2" />
      <ellipse cx="18.5" cy="12" rx="3.5" ry="2" />
      <ellipse cx="7.3" cy="7.3" rx="2" ry="3.5" transform="rotate(45 7.3 7.3)" />
      <ellipse cx="16.7" cy="7.3" rx="2" ry="3.5" transform="rotate(-45 16.7 7.3)" />
      <ellipse cx="7.3" cy="16.7" rx="2" ry="3.5" transform="rotate(-45 7.3 16.7)" />
      <ellipse cx="16.7" cy="16.7" rx="2" ry="3.5" transform="rotate(45 16.7 16.7)" />
    </svg>
  )
}

function IconFlowerFresh() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
      <path d="M12 22 V10" />
      <path d="M12 10 C12 10 7 9 6 5 C9 4 12 7 12 10Z" />
      <path d="M12 10 C12 10 17 9 18 5 C15 4 12 7 12 10Z" />
      <path d="M12 14 C12 14 8 13 6 16 C8 18 12 16 12 14Z" />
      <path d="M12 14 C12 14 16 13 18 16 C16 18 12 16 12 14Z" />
      <circle cx="12" cy="10" r="1.5" fill="currentColor" stroke="none" opacity="0.4" />
    </svg>
  )
}

function IconBalloon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
      <ellipse cx="12" cy="9" rx="5" ry="6.5" />
      <path d="M12 15.5 L11 19 M12 15.5 L13 19" />
      <path d="M10 19 Q12 21 14 19" />
      <circle cx="7" cy="7" r="3.5" />
      <circle cx="17" cy="7" r="3.5" />
      <path d="M7 10.5 L6.5 14" />
      <path d="M17 10.5 L17.5 14" />
    </svg>
  )
}

function IconBouquet() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
      <path d="M12 20 L9 14 L15 14 Z" />
      <circle cx="12" cy="7" r="2" />
      <circle cx="7.5" cy="9.5" r="1.8" />
      <circle cx="16.5" cy="9.5" r="1.8" />
      <circle cx="9" cy="5.5" r="1.5" />
      <circle cx="15" cy="5.5" r="1.5" />
      <path d="M9 14 C9 14 7 11 7.5 9.5" strokeDasharray="none" />
      <path d="M15 14 C15 14 17 11 16.5 9.5" />
    </svg>
  )
}

function IconEvent() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M3 12 H21" />
      <path d="M8 8 V5 M16 8 V5" />
      <path d="M8 16 L10 18 L16 13" />
    </svg>
  )
}

const SERVICES: ServiceDef[] = [
  {
    id:            'artificial-flowers',
    labelRu:       'Искусственные цветы',
    labelEn:       'Artificial Flowers',
    descriptionRu: 'Долговечные флористические композиции из premium-материалов. Идеальны для входных групп, шоу-румов и постоянных экспозиций.',
    descriptionEn: 'Long-lasting floral arrangements from premium materials. Perfect for entrance zones, showrooms, and permanent displays.',
    detailRu:      'Не вянут · Круглогодично · Без замены',
    detailEn:      'Never wilt · Year-round · No replacement',
    icon:          <IconFlowerArtificial />,
    accentClass:   'bg-brand-blush/30 text-brand-forest',
  },
  {
    id:            'fresh-flowers',
    labelRu:       'Живые цветы',
    labelEn:       'Fresh Flowers',
    descriptionRu: 'Живые цветочные оформления для торжественных событий. Доставка свежих цветов, составление композиций и монтаж на месте.',
    descriptionEn: 'Fresh floral designs for ceremonial events. Same-day delivery, on-site arrangement, and installation.',
    detailRu:      'Сезонные и экзотические сорта · Монтаж на месте',
    detailEn:      'Seasonal & exotic varieties · On-site installation',
    icon:          <IconFlowerFresh />,
    accentClass:   'bg-green-50 text-brand-forest',
  },
  {
    id:            'balloons',
    labelRu:       'Воздушные шары',
    labelEn:       'Balloon Decoration',
    descriptionRu: 'Арки, гирлянды, колонны и инсталляции из воздушных шаров для корпоративов, свадеб и детских праздников.',
    descriptionEn: 'Arches, garlands, columns, and balloon installations for corporate events, weddings, and children\'s parties.',
    detailRu:      'Любой масштаб · Тематические цвета · Фотозоны',
    detailEn:      'Any scale · Themed colours · Photo zones',
    icon:          <IconBalloon />,
    accentClass:    'bg-sky-50 text-sky-700',
  },
  {
    id:            'urgent-bouquet',
    labelRu:       'Срочный букет от 15 000 ₽',
    labelEn:       'Urgent Bouquet from ₽15,000',
    descriptionRu: 'Авторские букеты и цветочные подарки с курьерской доставкой. Принимаем заказ и привозим в день обращения.',
    descriptionEn: 'Bespoke bouquets and floral gifts with courier delivery. Ordered and delivered on the same day.',
    detailRu:      'В день обращения · Курьер по Москве и МО',
    detailEn:      'Same-day delivery · Courier across Moscow & MO',
    icon:          <IconBouquet />,
    accentClass:   'bg-brand-gold/15 text-amber-700',
    badge:         { ru: 'Срочно', en: 'Urgent' },
  },
  {
    id:            'event-decoration',
    labelRu:       'Оформление мероприятий за 24 часа',
    labelEn:       'Event Decoration in 24 Hours',
    descriptionRu: 'Свадьбы, корпоративы, входные группы, гала-вечера. Полный цикл: идея, декор, материалы, доставка, монтаж и демонтаж.',
    descriptionEn: 'Weddings, corporate events, entrance zones, gala evenings. Full cycle: concept, décor, materials, delivery, installation and removal.',
    detailRu:      'Под ключ · Москва и МО · Начало работ через 24 ч после оплаты',
    detailEn:      'Turnkey · Moscow & MO · Work starts within 24 h of payment',
    icon:          <IconEvent />,
    accentClass:   'bg-brand-forest/8 text-brand-forest',
    badge:         { ru: '24 часа', en: '24 hours' },
  },
]

// ---------------------------------------------------------------------------
// Service card sub-component
// ---------------------------------------------------------------------------

interface ServiceCardProps {
  service: ServiceDef
  locale:  'ru' | 'en'
}

function ServiceCard({ service, locale }: ServiceCardProps) {
  const label       = locale === 'en' ? service.labelEn       : service.labelRu
  const description = locale === 'en' ? service.descriptionEn : service.descriptionRu
  const detail      = locale === 'en' ? service.detailEn      : service.detailRu
  const badge       = service.badge
    ? (locale === 'en' ? service.badge.en : service.badge.ru)
    : null

  return (
    <article
      aria-label={label}
      className="
        group relative flex flex-col gap-4
        rounded-xl border border-brand-ink/8
        bg-white p-5
        shadow-sm hover:shadow-md
        transition-shadow duration-300
      "
    >
      {/* Badge — urgent / 24h */}
      {badge && (
        <span
          aria-label={badge}
          className="
            absolute top-4 right-4
            rounded-full bg-brand-gold/20 border border-brand-gold/40
            px-2.5 py-0.5 text-xs font-semibold text-amber-700
            tracking-wide
          "
        >
          {badge}
        </span>
      )}

      {/* Icon container */}
      <div
        className={`
          flex h-11 w-11 items-center justify-center rounded-lg
          ${service.accentClass}
          transition-transform duration-300 group-hover:scale-105
        `}
        aria-hidden="true"
      >
        {service.icon}
      </div>

      {/* Heading */}
      <h3 className="font-display text-base font-semibold text-brand-forest leading-snug pr-8">
        {label}
      </h3>

      {/* Description */}
      <p className="text-sm text-brand-ink/70 leading-relaxed flex-1">
        {description}
      </p>

      {/* Detail microcopy */}
      <p className="text-xs text-brand-ink/45 leading-relaxed border-t border-brand-ink/6 pt-3">
        {detail}
      </p>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

export function ServicesSection() {
  const { locale } = useTranslations()

  const sectionTitle = locale === 'en'
    ? 'Our Services'
    : 'Наши услуги'

  const sectionSubtitle = locale === 'en'
    ? 'Full-service floral and event decoration across Moscow and the Moscow region. We handle everything — concept to removal.'
    : 'Флористический декор и оформление мероприятий в Москве и МО. Всё под ключ — от идеи до демонтажа.'

  const ctaLabel = locale === 'en'
    ? 'Calculate cost and timeline →'
    : 'Рассчитать стоимость и сроки →'

  const urgentNote = locale === 'en'
    ? '⚡ Urgent projects accepted same day. Call us or fill in the form.'
    : '⚡ Срочные проекты принимаем в день обращения. Позвоните или оставьте заявку.'

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24"
    >
      {/* ---- Section header -------------------------------------------- */}
      <div className="max-w-2xl mb-10 md:mb-14">
        <h2
          id="services-heading"
          className="font-display text-display-lg text-brand-ink leading-tight"
        >
          {sectionTitle}
        </h2>
        <p className="mt-3 text-base text-brand-ink/65 leading-relaxed">
          {sectionSubtitle}
        </p>
      </div>

      {/* ---- Service cards grid ---------------------------------------- */}
      {/* 5 cards: 1 col → 2 col → 3 col with last row auto-centred */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            locale={locale}
          />
        ))}
      </div>

      {/* ---- Urgent note ------------------------------------------------ */}
      <div className="mt-8 rounded-xl bg-brand-gold/8 border border-brand-gold/25 px-5 py-4">
        <p className="text-sm text-brand-ink/75 leading-relaxed">
          {urgentNote}
        </p>
      </div>

      {/* ---- Section CTA ----------------------------------------------- */}
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
          {locale === 'en' ? 'Or submit a request' : 'Или оставить заявку'}
        </a>
      </div>
    </section>
  )
}

export default ServicesSection
