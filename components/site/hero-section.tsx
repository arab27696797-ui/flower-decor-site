'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from '@/lib/i18n'

const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80&auto=format&fit=crop'

export function HeroSection() {
  const { t } = useTranslations()
  const reduceMotion = useReducedMotion()

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

  const hoverLift = reduceMotion
    ? {}
    : {
        whileHover: { y: -4 },
        transition: { duration: 0.2, ease: 'easeOut' as const },
      }

  return (
    <section
      id="hero"
      aria-label={t.hero.ariaLabel}
      className="relative overflow-hidden bg-brand-midnight text-brand-parchment"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,169,110,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(87,28,36,0.34),transparent_36%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-midnight via-brand-midnight/90 to-brand-wine/95" />
      </div>

      <div aria-hidden="true" className="absolute inset-0 hidden md:block">
        <img
          src={HERO_IMAGE_URL}
          alt=""
          role="presentation"
          width={1600}
          height={1067}
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover object-center opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,20,20,0.96)_0%,rgba(20,20,20,0.88)_46%,rgba(20,20,20,0.56)_100%)]" />
      </div>

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 md:min-h-[92svh] md:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] md:gap-12 md:py-24 lg:px-8 lg:py-28">
        <motion.div
          initial={sectionAnimation.initial}
          whileInView={sectionAnimation.whileInView}
          viewport={{ once: true, amount: 0.2 }}
          transition={sectionAnimation.transition}
          className="flex max-w-3xl flex-col gap-6"
        >
          <p className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-brand-gold/35 bg-brand-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
            <span className="h-2 w-2 rounded-full bg-brand-gold" />
            {t.hero.eyebrow}
          </p>

          <h1 className="max-w-[12ch] font-display text-display-xl font-semibold leading-[1.02] tracking-[-0.02em] text-brand-parchment">
            {t.hero.heading.line1}
            <br />
            <span className="text-brand-gold">{t.hero.heading.line2}</span>
            <br />
            <span className="text-brand-parchment">{t.hero.heading.line3}</span>
          </h1>

          <p className="max-w-[58ch] text-base leading-7 text-brand-stone sm:text-lg sm:leading-8">
            {t.hero.subheading}
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
            <motion.a
              href="#calculator"
              {...hoverLift}
              className="
                inline-flex min-h-11 items-center justify-center gap-2
                rounded-card border border-brand-gold/70
                bg-brand-gold px-6 py-3
                text-sm font-semibold text-brand-midnight
                shadow-dark-card
                transition-[background-color,box-shadow,transform] duration-200
                hover:bg-brand-gold-light hover:shadow-dark-hover
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-gold focus-visible:ring-offset-2
                focus-visible:ring-offset-brand-midnight
              "
            >
              {t.hero.ctaPrimary}
            </motion.a>

            <motion.a
              href="#contact"
              {...hoverLift}
              className="
                inline-flex min-h-11 items-center justify-center gap-2
                rounded-card border border-brand-parchment/15
                bg-brand-parchment/5 px-6 py-3
                text-sm font-semibold text-brand-parchment
                shadow-dark-card backdrop-blur-sm
                transition-[background-color,border-color,box-shadow,transform] duration-200
                hover:border-brand-gold/40 hover:bg-brand-parchment/10 hover:shadow-dark-hover
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-gold focus-visible:ring-offset-2
                focus-visible:ring-offset-brand-midnight
              "
            >
              {t.hero.ctaSecondary}
            </motion.a>
          </div>

          <div className="flex flex-col gap-2 pt-2 text-sm text-brand-stone sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            {[
              { icon: '⚡', text: t.hero.trust.speed },
              { icon: '🌸', text: t.hero.trust.quality },
              { icon: '📍', text: t.hero.trust.location },
            ].map(({ icon, text }) => (
              <span key={text} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-base">
                  {icon}
                </span>
                <span>{text}</span>
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={sectionAnimation.initial}
          whileInView={sectionAnimation.whileInView}
          viewport={{ once: true, amount: 0.2 }}
          transition={
            reduceMotion
              ? { duration: 0.45, ease: 'easeOut' as const, delay: 0.05 }
              : { duration: 0.8, ease: 'easeOut' as const, delay: 0.1 }
          }
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[28px] border border-brand-parchment/10 bg-brand-midnight-card shadow-dark-card">
            <img
              src={HERO_IMAGE_URL}
              alt={t.hero.imageAlt}
              width={760}
              height={920}
              loading="eager"
              decoding="async"
              className="aspect-[4/5] w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,20,20,0.1)_0%,rgba(20,20,20,0.34)_45%,rgba(20,20,20,0.74)_100%)]" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 sm:p-6">
              <div className="w-fit rounded-full border border-brand-gold/30 bg-brand-midnight/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold backdrop-blur-sm">
                {t.hero.photoLabel}
              </div>

              <div className="max-w-[30ch] rounded-2xl border border-brand-parchment/10 bg-brand-midnight/55 p-4 backdrop-blur-md">
                <p className="text-sm leading-6 text-brand-parchment">
                  Si-Si — декор с характером: вечерний свет, флористика, фотозоны и сцены, которые держат внимание с первого взгляда.
                </p>
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute -bottom-5 -left-5 hidden h-28 w-28 rounded-full border border-brand-gold/20 bg-brand-gold/10 blur-2xl md:block"
          />
        </motion.div>
      </div>
    </section>
  )
}
