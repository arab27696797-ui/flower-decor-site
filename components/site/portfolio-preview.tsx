'use client'

// components/site/portfolio-preview.tsx
// Public homepage portfolio section — dark premium theme.
//
// DATA FLOW:
//   GET /api/portfolio → returns active PortfolioItem rows from PostgreSQL
//   (see prisma/schema.prisma → model PortfolioItem). The API responds with
//   the raw Prisma rows: { id, imageUrl, videoUrl, captionRu, captionEn,
//   category, sortOrder, isActive, createdAt, updatedAt }.
//
// NOTES:
//   - The item type is declared locally on purpose: types/index.ts still
//     contains the legacy PortfolioImage shape used by older admin code and
//     must not be changed.
//   - Animation pattern matches HeroSection / LeadForm: framer-motion,
//     whileInView reveal, useReducedMotion support, opacity/transform only.

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Local type — mirrors the Prisma PortfolioItem row returned by /api/portfolio
// ---------------------------------------------------------------------------

interface PublicPortfolioItem {
  id: string
  imageUrl: string
  videoUrl: string | null
  captionRu: string | null
  captionEn: string | null
  category: string
  sortOrder: number
  isActive: boolean
}

interface PortfolioResponse {
  ok: boolean
  data?: PublicPortfolioItem[]
}

// ---------------------------------------------------------------------------
// Category display labels — matches PortfolioItem.category values in the DB
// ---------------------------------------------------------------------------

const CATEGORY_LABELS: Record<string, { ru: string; en: string }> = {
  floral:    { ru: 'Флористика',        en: 'Floral design' },
  balloons:  { ru: 'Воздушные шары',    en: 'Balloons' },
  wedding:   { ru: 'Свадьба',           en: 'Wedding' },
  corporate: { ru: 'Корпоратив',        en: 'Corporate' },
  entrance:  { ru: 'Входная группа',    en: 'Entrance zone' },
  bouquet:   { ru: 'Букет',             en: 'Bouquet' },
}

function getCategoryLabel(category: string, locale: 'ru' | 'en'): string {
  const entry = CATEGORY_LABELS[category]
  if (entry) return locale === 'en' ? entry.en : entry.ru
  return category
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PortfolioPreview() {
  const { locale } = useTranslations()
  const reduceMotion = useReducedMotion()

  const [items, setItems] = useState<PublicPortfolioItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((json: PortfolioResponse) => {
        if (cancelled) return
        if (json.ok && Array.isArray(json.data)) {
          setItems(json.data)
        }
      })
      .catch(() => {
        // Network/API failure — fall through to the empty state silently.
        // The section must never break the homepage render.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const sectionAnimation = reduceMotion
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        transition: { duration: 0.45, ease: 'easeOut' as const },
      }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: 'easeOut' as const },
      }

  const cardHover = reduceMotion
    ? {}
    : {
        whileHover: { y: -4 },
        transition: { duration: 0.2, ease: 'easeOut' as const },
      }

  return (
    <section className="bg-brand-midnight-soft px-4 py-16 text-brand-parchment sm:px-6 md:py-20 lg:py-24">
      <motion.div
        initial={sectionAnimation.initial}
        whileInView={sectionAnimation.whileInView}
        viewport={{ once: true, amount: 0.2 }}
        transition={sectionAnimation.transition}
        className="mx-auto max-w-7xl"
      >
        {/* ------------------------------------------------------------ */}
        {/* Section header                                                */}
        {/* ------------------------------------------------------------ */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            {locale === 'en' ? 'Portfolio' : 'Портфолио'}
          </p>
          <h2 className="mt-3 font-display text-display-md text-brand-parchment">
            {locale === 'en'
              ? 'Recent work by event type'
              : 'Примеры оформлений по типам событий'}
          </h2>
          <p className="mt-3 text-sm leading-7 text-brand-stone sm:text-base">
            {locale === 'en'
              ? 'Floral styling, balloons, and full event decor — weddings, birthdays, kids parties, and corporate events across Moscow.'
              : 'Флористика, шары и декор под ключ — свадьбы, дни рождения, детские праздники и корпоративы в Москве и области.'}
          </p>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Loading skeleton — dark, no layout shift (fixed aspect boxes) */}
        {/* ------------------------------------------------------------ */}
        {isLoading && (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                aria-hidden="true"
                className="aspect-[4/3] animate-pulse rounded-card border border-brand-parchment/10 bg-brand-midnight-card"
              />
            ))}
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* Empty state — shown until the admin uploads portfolio items   */}
        {/* ------------------------------------------------------------ */}
        {!isLoading && items.length === 0 && (
          <div className="mt-10 rounded-card border border-brand-parchment/10 bg-brand-midnight-card p-6 shadow-dark-card sm:p-8">
            <p className="max-w-[52ch] text-sm leading-7 text-brand-stone">
              {locale === 'en'
                ? 'The first completed projects will appear here soon. Until then, send a request — we will share a private selection of works for your venue type.'
                : 'Первые выполненные проекты скоро появятся здесь. А пока — отправьте заявку: пришлём частную подборку работ под ваш тип площадки.'}
            </p>
            <a
              href="#contact"
              className="
                mt-5 inline-flex min-h-11 items-center justify-center gap-2
                rounded-card border border-brand-gold/70 bg-brand-gold
                px-6 py-3 text-sm font-semibold text-brand-midnight
                transition-[background-color,box-shadow,transform] duration-200
                hover:bg-brand-gold-light hover:shadow-dark-hover
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-gold focus-visible:ring-offset-2
                focus-visible:ring-offset-brand-midnight-soft
              "
            >
              {locale === 'en' ? 'Request a private selection' : 'Запросить подборку работ'}
            </a>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* Portfolio grid                                                */}
        {/* ------------------------------------------------------------ */}
        {!isLoading && items.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <motion.article
                key={item.id}
                {...cardHover}
                className="group overflow-hidden rounded-card border border-brand-parchment/10 bg-brand-midnight-card shadow-dark-card transition-shadow duration-200 hover:shadow-dark-hover"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={
                      (locale === 'en' ? item.captionEn : item.captionRu) ??
                      getCategoryLabel(item.category, locale)
                    }
                    width={600}
                    height={450}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight/70 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full border border-brand-gold/30 bg-brand-midnight/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold backdrop-blur-sm">
                    {getCategoryLabel(item.category, locale)}
                  </span>
                </div>

                {(item.captionRu ?? item.captionEn) && (
                  <p className="p-4 text-sm font-medium leading-6 text-brand-parchment">
                    {(locale === 'en' ? item.captionEn : item.captionRu) ??
                      item.captionRu ??
                      item.captionEn}
                  </p>
                )}
              </motion.article>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  )
}

export default PortfolioPreview
