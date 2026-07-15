// components/site/hero-section.tsx
// PRIMA Decor — Premium hero section.
//
// ARCHITECTURE NOTES:
// - 'use client' is required: uses useTranslations (context) and IntersectionObserver animation.
// - Text is sourced exclusively from the i18n translation layer (lib/i18n.ts + lib/translations/).
// - No inline hardcoded Russian or English strings.
// - formatPrice / roundToHundreds imported from app/lib/utils.ts (confirmed in repo).
// - Temporary hero image is sourced from a public CDN URL (Unsplash) — easy to replace
//   by swapping the constant HERO_IMAGE_URL. The <img> has descriptive alt text for SEO.
// - The pricing preview card uses the same 30% markup constant from lib/calculator-config.ts.
// - Scroll-reveal animation uses CSS classes toggled via IntersectionObserver (no GSAP dependency).
//   Respects prefers-reduced-motion via CSS (defined in globals.css animate-fadein keyframe).
// - Trust badges are hardcoded visual elements (no DB dependency) — suitable for static copy.
// - Semantic structure: <section> > <h1> hierarchy, no heading levels skipped.

'use client'

import { useEffect, useRef } from 'react'

import { MARKUP_MULTIPLIER } from '@/lib/calculator-config'
import { useTranslations } from '@/lib/i18n'
import { formatPrice, roundToHundreds } from '@/app/lib/utils'

// ---------------------------------------------------------------------------
// Temporary hero image — replace with final asset when available.
// Source: Unsplash (free-to-use). Dimensions: 1600×1067.
// Replace HERO_IMAGE_URL with a local /public path or a Next.js <Image> src
// once final photography is delivered.
// ---------------------------------------------------------------------------
const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80&auto=format&fit=crop'

// Base budget used in the pricing preview card (matches urgent bouquet floor).
const PREVIEW_BASE_PRICE = 15_000

// ---------------------------------------------------------------------------
// Trust badge data — purely presentational, no translation needed for icons.
// ---------------------------------------------------------------------------
interface TrustBadge {
  icon: string
  labelKey: keyof ReturnType<typeof useTranslations>['t']['hero']['trust']
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HeroSection() {
  const { t } = useTranslations()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cardRef    = useRef<HTMLDivElement>(null)

  // Scroll-reveal: add .is-visible class when element enters viewport.
  // CSS handles the actual animation (globals.css .reveal-on-scroll).
  // prefers-reduced-motion is handled in globals.css — no JS check needed.
  useEffect(() => {
    const elements = [contentRef.current, cardRef.current].filter(Boolean) as Element[]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const previewTotal = roundToHundreds(PREVIEW_BASE_PRICE * MARKUP_MULTIPLIER)

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label={t.hero.ariaLabel}
      className="relative overflow-hidden bg-brand-cream"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Ambient background layer — soft floral gradient + blur orbs         */}
      {/* Purely decorative, aria-hidden                                      */}
      {/* ------------------------------------------------------------------ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        {/* Large warm gold bloom — top right */}
        <div className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-brand-gold/20 blur-[120px]" />
        {/* Soft blush pool — bottom left */}
        <div className="absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-brand-blush/35 blur-[100px]" />
        {/* Forest green accent — centre-right edge */}
        <div className="absolute right-1/3 top-1/2 h-[280px] w-[280px] -translate-y-1/2 rounded-full bg-brand-forest/8 blur-[80px]" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Hero image — full-bleed background on larger screens                */}
      {/* ------------------------------------------------------------------ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
      >
        <img
          src={HERO_IMAGE_URL}
          alt=""
          role="presentation"
          width={1600}
          height={1067}
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover object-center opacity-[0.13]"
        />
        {/* Gradient mask so text stays readable over the faint photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-cream via-brand-cream/95 to-brand-cream/60" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main content grid                                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative mx-auto grid min-h-[88vh] max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:gap-20 lg:px-8">

        {/* ---- Left column: headline + CTAs ---- */}
        <div
          ref={contentRef}
          className="reveal-on-scroll flex flex-col gap-6"
        >
          {/* Eyebrow label */}
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-forest">
            {/* Decorative floral SVG mark */}
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <circle cx="6" cy="6" r="2" fill="currentColor" />
              <path d="M6 0v3M6 9v3M0 6h3M9 6h3M1.76 1.76l2.12 2.12M8.12 8.12l2.12 2.12M1.76 10.24l2.12-2.12M8.12 3.88l2.12-2.12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {t.hero.eyebrow}
          </p>

          {/* H1 — exactly one per page, defined here */}
          <h1 className="text-display-xl font-semibold leading-[1.08] tracking-tight text-brand-ink">
            {t.hero.heading.line1}
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">{t.hero.heading.line2}</span>
              {/* Underline accent — brand-gold */}
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-[3px] w-full origin-left scale-x-100 rounded-full bg-brand-gold/60"
              />
            </span>
            <br />
            <span className="text-brand-forest">{t.hero.heading.line3}</span>
          </h1>

          {/* Supporting paragraph */}
          <p className="max-w-[52ch] text-base leading-relaxed text-brand-ink/75">
            {t.hero.subheading}
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#calculator"
              className="
                inline-flex items-center justify-center gap-2
                rounded-card bg-brand-forest px-6 py-3
                text-sm font-semibold text-white
                shadow-card
                transition-all duration-200
                hover:-translate-y-0.5 hover:bg-brand-forest/90 hover:shadow-card-hover
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-gold/70 focus-visible:ring-offset-2
              "
            >
              {/* Calculator icon */}
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="10" x2="10" y2="10" />
                <line x1="14" y1="10" x2="16" y2="10" />
                <line x1="8" y1="14" x2="10" y2="14" />
                <line x1="14" y1="14" x2="16" y2="14" />
                <line x1="8" y1="18" x2="10" y2="18" />
                <line x1="14" y1="18" x2="16" y2="18" />
              </svg>
              {t.hero.ctaPrimary}
            </a>

            <a
              href="#lead-form"
              className="
                inline-flex items-center justify-center gap-2
                rounded-card border border-brand-ink/15
                bg-white/80 px-6 py-3
                text-sm font-semibold text-brand-ink
                shadow-card backdrop-blur-sm
                transition-all duration-200
                hover:-translate-y-0.5 hover:border-brand-forest/30 hover:bg-white hover:shadow-card-hover
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-gold/70 focus-visible:ring-offset-2
              "
            >
              {t.hero.ctaSecondary}
            </a>
          </div>

          {/* Trust badges row */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
            {[
              { icon: '⚡', text: t.hero.trust.speed },
              { icon: '🌸', text: t.hero.trust.quality },
              { icon: '📍', text: t.hero.trust.location },
            ].map(({ icon, text }) => (
              <span
                key={text}
                className="flex items-center gap-1.5 text-xs text-brand-ink/65"
              >
                <span aria-hidden="true" className="text-sm">{icon}</span>
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* ---- Right column: pricing preview card + accent image ---- */}
        <div
          ref={cardRef}
          className="reveal-on-scroll reveal-on-scroll--delayed relative flex flex-col gap-5"
        >
          {/* Decorative accent image — visible on larger screens */}
          <div className="relative hidden overflow-hidden rounded-[20px] shadow-card-hover md:block">
            <img
              src={HERO_IMAGE_URL}
              alt={t.hero.imageAlt}
              width={760}
              height={507}
              loading="eager"
              decoding="async"
              className="aspect-[4/3] w-full object-cover object-center"
            />
            {/* Subtle overlay gradient for legibility of overlaid text */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/40 via-transparent to-transparent" />

            {/* Floating badge on photo */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
              <div className="rounded-xl bg-white/90 px-3 py-2 shadow-card backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-forest/80">
                  {t.hero.photoLabel}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing preview card */}
          <div className="relative overflow-hidden rounded-card border border-brand-ink/10 bg-white/90 p-5 shadow-card backdrop-blur-sm transition-shadow duration-300 hover:shadow-card-hover">
            {/* Gold accent bar */}
            <div aria-hidden="true" className="absolute left-0 top-0 h-full w-1 rounded-l-card bg-gradient-to-b from-brand-gold via-brand-gold/70 to-brand-gold/30" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-forest/70">
              {t.hero.card.eyebrow}
            </p>

            <p className="mt-3 text-sm leading-6 text-brand-ink/80">
              {t.hero.card.body.before}
              {' '}
              <span className="font-semibold text-brand-ink">
                {formatPrice(PREVIEW_BASE_PRICE)}
              </span>
              {' '}
              {t.hero.card.body.middle}
              {' '}
              <span className="font-semibold text-brand-ink">30%</span>
              {' '}
              {t.hero.card.body.after}
              {' '}
              <span className="font-semibold text-brand-forest">
                {formatPrice(previewTotal)}
              </span>
              .
            </p>

            <p className="mt-3 flex items-start gap-1.5 text-xs text-brand-ink/60">
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {t.hero.card.disclaimer}
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Scroll cue — subtle animated chevron                               */}
      {/* ------------------------------------------------------------------ */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce md:flex"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-ink/25">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  )
}
