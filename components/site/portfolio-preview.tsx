'use client'

// components/site/portfolio-preview.tsx
// Si-Si — Portfolio preview, "Noir Bloom" design.
// Two infinite photo marquees drifting in opposite directions.
// Data: /api/portfolio (Prisma-backed). When the DB is empty or unreachable,
// a curated set of thematic fallback images keeps the section alive.

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Fallback imagery — used until real works are added via the admin panel
// ---------------------------------------------------------------------------

interface FallbackImage {
  src: string
  altRu: string
  altEn: string
}

const FALLBACK_IMAGES: FallbackImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80&auto=format&fit=crop',
    altRu: 'Свадебная церемония с цветочной аркой',
    altEn: 'Wedding ceremony with a floral arch',
  },
  {
    src: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80&auto=format&fit=crop',
    altRu: 'Банкетный зал с цветочным оформлением столов',
    altEn: 'Banquet hall with floral table styling',
  },
  {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80&auto=format&fit=crop',
    altRu: 'Свадебный букет невесты',
    altEn: 'Bridal bouquet',
  },
  {
    src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80&auto=format&fit=crop',
    altRu: 'Вечернее мероприятие со свечами и цветами',
    altEn: 'Evening event with candles and flowers',
  },
  {
    src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80&auto=format&fit=crop',
    altRu: 'Нежная цветочная композиция крупным планом',
    altEn: 'Delicate floral composition close-up',
  },
  {
    src: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80&auto=format&fit=crop',
    altRu: 'Праздничное оформление с золотыми акцентами',
    altEn: 'Festive styling with gold accents',
  },
  {
    src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&q=80&auto=format&fit=crop',
    altRu: 'Полевые цветы в декоре',
    altEn: 'Wildflowers in decor',
  },
  {
    src: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&q=80&auto=format&fit=crop',
    altRu: 'Фотозона с воздушными шарами',
    altEn: 'Photo zone with balloons',
  },
]

// ---------------------------------------------------------------------------
// Normalized card shape — one type for both DB items and fallbacks
// ---------------------------------------------------------------------------

interface MarqueeCard {
  key: string
  src: string
  altRu: string
  altEn: string
}

interface PortfolioApiItem {
  id: string
  imageUrl: string
  captionRu: string | null
  captionEn: string | null
}

function normalizeDbItem(item: PortfolioApiItem): MarqueeCard {
  return {
    key: item.id,
    src: item.imageUrl,
    altRu: item.captionRu ?? 'Работа Si-Si',
    altEn: item.captionEn ?? 'Si-Si work',
  }
}

function normalizeFallback(item: FallbackImage, index: number): MarqueeCard {
  return {
    key: `fallback-${index}`,
    src: item.src,
    altRu: item.altRu,
    altEn: item.altEn,
  }
}

// ---------------------------------------------------------------------------
// Marquee row — content rendered twice, CSS animation translates -50%
// ---------------------------------------------------------------------------

interface MarqueeRowProps {
  cards: MarqueeCard[]
  reverse?: boolean
  altFor: (card: MarqueeCard) => string
}

function MarqueeRow({ cards, reverse = false, altFor }: MarqueeRowProps) {
  // Duplicate the row so the -50% translate loops seamlessly
  const row = [...cards, ...cards]

  return (
    <div className="group relative overflow-hidden">
      <div
        className={[
          'flex w-max gap-4 pr-4 lg:gap-5 lg:pr-5',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee-slow',
          'group-hover:[animation-play-state:paused]',
        ].join(' ')}
      >
        {row.map((card, i) => (
          <figure
            key={`${card.key}-${i}`}
            className="relative h-52 w-72 shrink-0 overflow-hidden rounded-card border border-brand-midnight-border sm:h-60 sm:w-80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.src}
              alt={altFor(card)}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-slow hover:scale-105"
            />
            {/* Bottom vignette for caption legibility */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-brand-onyx/85 to-transparent"
            />
            <figcaption className="absolute bottom-3 left-4 right-4 truncate text-xs font-medium text-brand-parchment/90">
              {altFor(card)}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PortfolioPreview() {
  const { locale } = useTranslations()
  const [cards, setCards] = useState<MarqueeCard[]>(
    FALLBACK_IMAGES.map(normalizeFallback),
  )

  // Try the DB-backed portfolio; silently keep fallbacks on any failure
  useEffect(() => {
    let cancelled = false

    fetch('/api/portfolio')
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { ok?: boolean; data?: PortfolioApiItem[] } | null) => {
        if (cancelled || !json?.ok || !Array.isArray(json.data)) return
        if (json.data.length === 0) return
        setCards(json.data.map(normalizeDbItem))
      })
      .catch(() => {
        /* fallbacks already shown */
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Split into two rows; with few items both rows just reuse the same set
  const midpoint = Math.ceil(cards.length / 2)
  const rowA = cards.slice(0, midpoint)
  const rowB = cards.slice(midpoint).length > 0 ? cards.slice(midpoint) : cards

  return (
    <div className="relative overflow-hidden bg-brand-onyx py-20 sm:py-24 lg:py-28">
      {/* Wine glow, left side */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-12%] top-1/3 h-[26rem] w-[26rem] rounded-full bg-brand-wine/50 blur-3xl"
      />

      <div className="relative">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto mb-14 max-w-2xl px-4 text-center sm:px-6"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-gold">
            {locale === 'en' ? 'Portfolio' : 'Портфолио'}
          </p>
          <h2 className="font-display text-display-lg font-semibold text-brand-parchment">
            {locale === 'en' ? (
              <>
                Evenings we{' '}
                <span className="text-gold-gradient italic">made unforgettable</span>
              </>
            ) : (
              <>
                Вечера, которые мы{' '}
                <span className="text-gold-gradient italic">сделали незабываемыми</span>
              </>
            )}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-brand-stone sm:text-base">
            {locale === 'en'
              ? 'Weddings, corporate galas, entrance groups and photo zones — a living reel of our recent work.'
              : 'Свадьбы, корпоративы, входные группы и фотозоны — живая лента наших последних работ.'}
          </p>
        </motion.div>

        {/* Dual marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="flex flex-col gap-4 lg:gap-5"
        >
          <MarqueeRow
            cards={rowA}
            altFor={(c) => (locale === 'en' ? c.altEn : c.altRu)}
          />
          <MarqueeRow
            cards={rowB}
            reverse
            altFor={(c) => (locale === 'en' ? c.altEn : c.altRu)}
          />
        </motion.div>

        {/* Edge fade masks */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-brand-onyx to-transparent sm:w-28"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-brand-onyx to-transparent sm:w-28"
        />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="mt-12 text-center"
        >
          <a
            href="#contact"
            className="inline-flex min-h-11 items-center gap-2 rounded-btn border border-brand-gold/40 bg-brand-gold/[0.06] px-7 py-3 text-sm font-semibold text-brand-gold transition-all duration-base hover:border-brand-gold hover:bg-brand-gold/15"
          >
            {locale === 'en' ? 'Want the same? Tell us about your event' : 'Хотите так же? Расскажите о событии'}
          </a>
        </motion.div>
      </div>
    </div>
  )
}
