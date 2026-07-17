'use client'

// components/site/services-section.tsx
// Si-Si — Services section, "Noir Bloom" design.
// Bento-grid of glass cards with gold icon chips, tag pills and hover glow.
// Motion: staggered reveal on scroll (opacity/transform only).

import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Service definitions — static config, copy resolved via locale at render time
// ---------------------------------------------------------------------------

interface ServiceDef {
  id:          string
  labelRu:     string
  labelEn:     string
  descriptionRu: string
  descriptionEn: string
  tagsRu:      string[]
  tagsEn:      string[]
  icon:        'flower' | 'balloon' | 'bouquet' | 'sparkle' | 'arch' | 'camera'
  // Bento placement: 'wide' spans two columns on desktop
  size:        'wide' | 'regular'
}

const SERVICES: ServiceDef[] = [
  {
    id: 'floral',
    labelRu: 'Флористическое оформление',
    labelEn: 'Floral decoration',
    descriptionRu:
      'Искусственные и живые цветы любой сложности — от камерных композиций до тотального оформления зала. Каталог из 1 200+ позиций всегда в наличии.',
    descriptionEn:
      'Artificial and fresh florals of any complexity — from intimate compositions to full venue styling. A catalogue of 1,200+ items always in stock.',
    tagsRu: ['Искусственные цветы', 'Живые цветы', 'Тотальный декор'],
    tagsEn: ['Artificial flowers', 'Fresh flowers', 'Full styling'],
    icon: 'flower',
    size: 'wide',
  },
  {
    id: 'balloons',
    labelRu: 'Воздушные шары',
    labelEn: 'Balloons',
    descriptionRu:
      'Гирлянды, арки и фотозоны из шаров премиум-класса. Не выцветают и держат форму до 5 дней.',
    descriptionEn:
      'Premium balloon garlands, arches and photo zones. Colourfast, holding shape for up to 5 days.',
    tagsRu: ['Гирлянды', 'Арки', 'Фотозоны'],
    tagsEn: ['Garlands', 'Arches', 'Photo zones'],
    icon: 'balloon',
    size: 'regular',
  },
  {
    id: 'bouquet',
    labelRu: 'Срочный букет',
    labelEn: 'Express bouquet',
    descriptionRu:
      'Авторский букет за 2 часа по Москве. От 15 000 ₽ — привозим точно к моменту.',
    descriptionEn:
      'A signature bouquet in 2 hours across Moscow. From 15,000 ₽ — delivered right on the moment.',
    tagsRu: ['За 2 часа', 'От 15 000 ₽'],
    tagsEn: ['In 2 hours', 'From 15,000 ₽'],
    icon: 'bouquet',
    size: 'regular',
  },
  {
    id: 'event',
    labelRu: 'Мероприятия под ключ',
    labelEn: 'Full-service events',
    descriptionRu:
      'Свадьбы, корпоративы и гала-вечера: идея, 3D-эскиз, декор, доставка, монтаж и демонтаж. Один договор — ноль хлопот.',
    descriptionEn:
      'Weddings, corporate and gala evenings: concept, 3D sketch, decor, delivery, setup and teardown. One contract — zero hassle.',
    tagsRu: ['Свадьбы', 'Корпоративы', '24 часа'],
    tagsEn: ['Weddings', 'Corporate', '24 hours'],
    icon: 'sparkle',
    size: 'wide',
  },
  {
    id: 'entrance',
    labelRu: 'Входные группы',
    labelEn: 'Entrance groups',
    descriptionRu:
      'Оформление входов и фасадов, которые останавливают поток. Первое впечатление начинается с порога.',
    descriptionEn:
      'Entrance and facade styling that stops foot traffic. The first impression starts at the doorstep.',
    tagsRu: ['Фасады', 'Порталы'],
    tagsEn: ['Facades', 'Portals'],
    icon: 'arch',
    size: 'regular',
  },
  {
    id: 'photozone',
    labelRu: 'Фотозоны',
    labelEn: 'Photo zones',
    descriptionRu:
      'Инстаграмные точки притяжения: цветочные стены, неон, каскады ткани. Гости сами делают вам рекламу.',
    descriptionEn:
      'Instagram-worthy attractions: flower walls, neon, cascading fabrics. Guests advertise you themselves.',
    tagsRu: ['Цветочные стены', 'Неон'],
    tagsEn: ['Flower walls', 'Neon'],
    icon: 'camera',
    size: 'regular',
  },
]

// ---------------------------------------------------------------------------
// Icons — inline SVG, stroke-based, inherit currentColor (gold)
// ---------------------------------------------------------------------------

function ServiceIcon({ icon }: { icon: ServiceDef['icon'] }) {
  const common = 'h-6 w-6'
  switch (icon) {
    case 'flower':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <circle cx="12" cy="8" r="2.4" />
          <path d="M12 5.6c0-1.8 1.2-3 3-3.6M12 5.6C12 3.8 10.8 2.6 9 2" opacity="0.001" />
          <path d="M12 5.6v0" opacity="0.001" />
          <path d="M9.9 7.1C8.4 5.6 6.2 5.4 4.7 6.6c-1 1.6-.2 3.8 1.4 4.9" />
          <path d="M14.1 7.1c1.5-1.5 3.7-1.7 5.2-.5 1 1.6.2 3.8-1.4 4.9" />
          <path d="M9.6 9.7c-1.9.7-2.9 2.7-2.2 4.5 1.4 1.1 3.6.8 4.9-.5" />
          <path d="M14.4 9.7c1.9.7 2.9 2.7 2.2 4.5-1.4 1.1-3.6.8-4.9-.5" />
          <path d="M12 10.4V21" />
          <path d="M12 16c-2.2 0-4-1.4-4.5-3.4" />
          <path d="M12 18.5c2.2 0 4-1.4 4.5-3.4" />
        </svg>
      )
    case 'balloon':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <path d="M12 2.5c3.2 0 5.5 2.4 5.5 5.6 0 3.6-3.1 6.6-5.5 6.6s-5.5-3-5.5-6.6c0-3.2 2.3-5.6 5.5-5.6Z" />
          <path d="M12 14.7l-.9 1.6h1.8l-.9-1.6Z" fill="currentColor" stroke="none" />
          <path d="M12 16.3c0 2-1.4 2.6-1.4 4.2" />
        </svg>
      )
    case 'bouquet':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <path d="M8.5 2.8c1.8.4 2.8 1.8 3 3.5" />
          <path d="M15.5 2.8c-1.8.4-2.8 1.8-3 3.5" />
          <path d="M12 6.3c.2-1.7 1.5-3 3.2-3.3" opacity="0.001" />
          <circle cx="7.6" cy="5.6" r="1.7" />
          <circle cx="16.4" cy="5.6" r="1.7" />
          <circle cx="12" cy="4.4" r="1.7" />
          <path d="M6.5 9.5 12 21l5.5-11.5" />
          <path d="M6.5 9.5h11" />
        </svg>
      )
    case 'sparkle':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <path d="M12 3v0c.6 4.5 2.7 6.6 7.2 7.2-4.5.6-6.6 2.7-7.2 7.2-.6-4.5-2.7-6.6-7.2-7.2 4.5-.6 6.6-2.7 7.2-7.2Z" />
          <path d="M19 15.5c.2 1.6 1 2.4 2.5 2.6-1.5.2-2.3 1-2.5 2.6-.2-1.6-1-2.4-2.5-2.6 1.5-.2 2.3-1 2.5-2.6Z" />
        </svg>
      )
    case 'arch':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <path d="M4 21V10a8 8 0 0 1 16 0v11" />
          <path d="M8.5 21v-9a3.5 3.5 0 0 1 7 0v9" />
          <path d="M2.5 21h19" />
        </svg>
      )
    case 'camera':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2L9 4.8A1.2 1.2 0 0 1 10.1 4h3.8A1.2 1.2 0 0 1 15 4.8L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-9Z" />
          <circle cx="12" cy="13" r="3.4" />
        </svg>
      )
  }
}

// ---------------------------------------------------------------------------
// Motion variants
// ---------------------------------------------------------------------------

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const card = {
  hidden: { opacity: 0, y: 28 },
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
    <div className="relative overflow-hidden bg-brand-onyx py-20 sm:py-24 lg:py-28">
      {/* Soft wine glow, top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-15%] h-[28rem] w-[28rem] rounded-full bg-brand-wine/50 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-gold">
            {locale === 'en' ? 'What we do' : 'Что мы делаем'}
          </p>
          <h2 className="font-display text-display-lg font-semibold text-brand-parchment">
            {locale === 'en' ? (
              <>
                Services built around{' '}
                <span className="text-gold-gradient italic">your moment</span>
              </>
            ) : (
              <>
                Услуги, собранные вокруг{' '}
                <span className="text-gold-gradient italic">вашего момента</span>
              </>
            )}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-brand-stone sm:text-base">
            {locale === 'en'
              ? 'From a single bouquet to full-scale venue transformation — every format is produced in-house and installed by our own crew.'
              : 'От одного букета до тотальной трансформации зала — каждый формат производится в нашей мастерской и монтируется своей командой.'}
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
        >
          {SERVICES.map((service) => (
            <motion.article
              key={service.id}
              variants={card}
              className={[
                'glass-card glow-hover group relative flex flex-col gap-4 rounded-card p-6 transition-shadow duration-slow lg:p-7',
                service.size === 'wide' ? 'sm:col-span-2' : '',
              ].join(' ')}
            >
              {/* Icon chip */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-gold/25 bg-brand-gold/[0.08] text-brand-gold transition-colors duration-slow group-hover:border-brand-gold/50 group-hover:text-brand-gold-light">
                <ServiceIcon icon={service.icon} />
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <h3 className="font-display text-xl font-semibold text-brand-parchment lg:text-2xl">
                  {locale === 'en' ? service.labelEn : service.labelRu}
                </h3>
                <p className="text-sm leading-relaxed text-brand-stone">
                  {locale === 'en' ? service.descriptionEn : service.descriptionRu}
                </p>
              </div>

              {/* Tags */}
              <ul className="mt-auto flex flex-wrap gap-2 pt-1" aria-label={locale === 'en' ? 'Formats' : 'Форматы'}>
                {(locale === 'en' ? service.tagsEn : service.tagsRu).map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-brand-midnight-border bg-brand-midnight-soft/60 px-3 py-1 text-[11px] font-medium tracking-wide text-brand-stone"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              {/* Gold corner accent on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-5 top-5 h-1.5 w-1.5 rounded-full bg-brand-gold/0 transition-colors duration-slow group-hover:bg-brand-gold"
              />
            </motion.article>
          ))}
        </motion.div>

        {/* Section CTA */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="mt-12 text-center"
        >
          <a
            href="#calculator"
            className="btn-gold-sheen animate-sheen inline-flex min-h-11 items-center gap-2 rounded-btn px-7 py-3 text-sm font-semibold text-brand-ink shadow-gold-glow transition-transform duration-base hover:-translate-y-0.5"
          >
            {locale === 'en' ? 'Estimate my decor' : 'Рассчитать мой декор'}
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <path d="M4 10h12M11 5l5 5-5 5" />
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  )
}
