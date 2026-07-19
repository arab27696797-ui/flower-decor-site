'use client'

// components/site/hero-section.tsx
// Si-Si — flagship hero, light festive "Bloom" design.
// Signature elements: drifting aurora gradients (gold + blush), film grain,
// floral line-art with confetti, mouse-parallax floating imagery, staggered
// headline reveal, sheen CTA, services marquee.
// All animation is opacity/transform only; honors prefers-reduced-motion.

import { useCallback } from 'react'
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useTranslations } from '@/lib/i18n'
import { FestiveDecor } from '@/components/site/festive-decor'

const HERO_MAIN =
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80&auto=format&fit=crop'
const HERO_SECONDARY =
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&q=80&auto=format&fit=crop'

const MARQUEE_RU = [
  'Свадьбы', 'Корпоративы', 'Входные группы', 'Фотозоны',
  'Срочные букеты', 'Воздушные шары', 'Дни рождения', 'Гала-вечера',
]
const MARQUEE_EN = [
  'Weddings', 'Corporate', 'Entrance zones', 'Photo zones',
  'Urgent bouquets', 'Balloons', 'Birthdays', 'Gala evenings',
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}

const lineReveal = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: 'easeOut' as const },
  },
}

export function HeroSection() {
  const { locale } = useTranslations()
  const reduceMotion = useReducedMotion()

  // Mouse parallax for the floating image cluster
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 55, damping: 18, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 55, damping: 18, mass: 0.6 })
  const mainX = useTransform(sx, [-0.5, 0.5], [12, -12])
  const mainY = useTransform(sy, [-0.5, 0.5], [8, -8])
  const secX = useTransform(sx, [-0.5, 0.5], [-20, 20])
  const secY = useTransform(sy, [-0.5, 0.5], [-14, 14])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduceMotion) return
      const rect = e.currentTarget.getBoundingClientRect()
      mx.set((e.clientX - rect.left) / rect.width - 0.5)
      my.set((e.clientY - rect.top) / rect.height - 0.5)
    },
    [mx, my, reduceMotion],
  )

  const marqueeItems = locale === 'en' ? MARQUEE_EN : MARQUEE_RU
  const marqueeRow = [...marqueeItems, ...marqueeItems]

  return (
    <section
      id="hero"
      aria-label={locale === 'en' ? 'Hero' : 'Главный экран'}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-brand-onyx text-brand-parchment"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Aurora background + grain                                         */}
      {/* Soft pastel "celebration rainbow": gold + blush base extended    */}
      {/* with lavender, powder blue and mint glows — premium, low-alpha,  */}
      {/* transform-only animation, no layout cost.                        */}
      {/* ---------------------------------------------------------------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-10%] h-[34rem] w-[34rem] rounded-full bg-brand-gold/15 blur-3xl animate-aurora" />
        <div className="absolute bottom-[-20%] left-[-12%] h-[38rem] w-[38rem] rounded-full bg-brand-wine/60 blur-3xl animate-aurora-alt" />
        <div className="absolute left-1/3 top-1/4 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl animate-aurora" />
        {/* Celebration rainbow accents — additive pastel glows */}
        <div className="absolute right-[6%] top-[38%] h-80 w-80 rounded-full bg-brand-lilac/30 blur-3xl animate-aurora-alt" />
        <div className="absolute left-[4%] top-[6%] h-72 w-72 rounded-full bg-brand-sky/25 blur-3xl animate-aurora" />
        <div className="absolute bottom-[10%] right-[26%] h-64 w-64 rounded-full bg-brand-mint/25 blur-3xl animate-aurora" />
        <div className="absolute left-[38%] top-[62%] h-56 w-56 rounded-full bg-brand-peach/25 blur-3xl animate-aurora-alt" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-onyx/40 via-transparent to-brand-onyx" />
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Festive floral line-art + confetti (decorative, layout-safe)  */}
      {/* ------------------------------------------------------------ */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {/* Top-left sprig — stem with leaves and a blossom */}
        <g stroke="#AE8A3E" strokeOpacity="0.38" strokeWidth="1.6" strokeLinecap="round">
          <path d="M-24 264 C 84 214, 150 138, 176 14" />
          <path d="M52 206 q 30 -2 44 -26 q -32 -2 -44 26 Z" />
          <path d="M96 162 q 28 -8 38 -34 q -30 4 -38 34 Z" />
          <path d="M132 108 q 26 -10 32 -36 q -28 6 -32 36 Z" />
          <path d="M34 226 q -4 30 12 46 q 6 -30 -12 -46 Z" />
        </g>
        <g fill="#E7AAB9" fillOpacity="0.75">
          <circle cx="182" cy="12" r="7" />
          <circle cx="170" cy="2" r="5.5" />
          <circle cx="194" cy="2" r="5.5" />
        </g>
        <circle cx="182" cy="6" r="3" fill="#AE8A3E" fillOpacity="0.8" />

        {/* Bottom-right sprig — mirrored */}
        <g stroke="#AE8A3E" strokeOpacity="0.38" strokeWidth="1.6" strokeLinecap="round">
          <path d="M1464 640 C 1356 692, 1292 766, 1266 890" />
          <path d="M1388 696 q -30 2 -44 26 q 32 2 44 -26 Z" />
          <path d="M1344 740 q -28 8 -38 34 q 30 -4 38 -34 Z" />
          <path d="M1308 794 q -26 10 -32 36 q 28 -6 32 -36 Z" />
          <path d="M1406 676 q 4 -30 -12 -46 q -6 30 12 46 Z" />
        </g>
        <g fill="#E7AAB9" fillOpacity="0.75">
          <circle cx="1260" cy="890" r="7" />
          <circle cx="1248" cy="900" r="5.5" />
          <circle cx="1272" cy="900" r="5.5" />
        </g>
        <circle cx="1260" cy="896" r="3" fill="#AE8A3E" fillOpacity="0.8" />

        {/* Scattered confetti — dots and tiny diamonds */}
        <g fill="#AE8A3E" fillOpacity="0.4">
          <circle cx="240" cy="120" r="3.5" />
          <circle cx="1204" cy="148" r="3" />
          <circle cx="1120" cy="700" r="3.5" />
          <path d="M320 640 l6 10 -6 10 -6 -10 Z" />
          <path d="M1180 320 l5 8 -5 8 -5 -8 Z" />
        </g>
        <g fill="#E7AAB9" fillOpacity="0.55">
          <circle cx="360" cy="300" r="4" />
          <circle cx="1090" cy="220" r="4" />
          <circle cx="420" cy="720" r="3" />
          <path d="M1140 520 l6 10 -6 10 -6 -10 Z" />
        </g>
        <g fill="#2D5016" fillOpacity="0.28">
          <circle cx="200" cy="480" r="3" />
          <circle cx="1250" cy="470" r="3" />
          <path d="M280 380 l5 8 -5 8 -5 -8 Z" />
        </g>
        {/* Celebration confetti — pastel rainbow sparks (decorative) */}
        <g fill="#B9A8E4" fillOpacity="0.5">
          <circle cx="540" cy="150" r="3.5" />
          <path d="M980 590 l5 8 -5 8 -5 -8 Z" />
        </g>
        <g fill="#AACBEA" fillOpacity="0.5">
          <circle cx="700" cy="760" r="3.5" />
          <path d="M460 200 l5 8 -5 8 -5 -8 Z" />
        </g>
        <g fill="#F3C9A4" fillOpacity="0.55">
          <circle cx="880" cy="180" r="3.5" />
          <path d="M620 560 l5 8 -5 8 -5 -8 Z" />
        </g>
        <g fill="#B2D9C0" fillOpacity="0.5">
          <circle cx="1020" cy="420" r="3.5" />
          <path d="M240 560 l5 8 -5 8 -5 -8 Z" />
        </g>
      </svg>

      {/* Floating flowers and balloons — the festive signature layer */}
      <FestiveDecor variant="hero" />

      <div aria-hidden="true" className="grain-overlay absolute inset-0" />

      {/* ---------------------------------------------------------------- */}
      {/* Main grid                                                         */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-24 pt-28 sm:px-6 md:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] md:pb-16 md:pt-32 lg:px-8">

        {/* Left — copy */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex max-w-3xl flex-col gap-7"
        >
          <motion.p
            variants={lineReveal}
            className="inline-flex min-h-11 w-fit items-center gap-2.5 rounded-full border border-brand-gold/30 bg-brand-gold/[0.07] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-gold-dark"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse-dot" />
            {locale === 'en'
              ? 'Premium event decor · Moscow'
              : 'Премиальный декор мероприятий · Москва'}
          </motion.p>

          <motion.h1
            variants={lineReveal}
            className="max-w-[13ch] font-display text-display-xl font-semibold leading-[1.03] tracking-[-0.02em]"
          >
            {locale === 'en' ? (
              <>
                Decor that turns
                <br />
                <span className="text-gold-gradient italic">an evening</span>
                <br />
                into a memory
              </>
            ) : (
              <>
                Декор, после
                <br />
                <span className="text-gold-gradient italic">которого</span>
                <br />
                помнят вечер
              </>
            )}
          </motion.h1>

          <motion.p
            variants={lineReveal}
            className="max-w-[54ch] text-base leading-7 text-brand-stone sm:text-lg sm:leading-8"
          >
            {locale === 'en'
              ? 'Fresh floristry, balloons and textile installations — composed into one visual story of your event. Concept, materials, delivery, installation and teardown: we start within 24 hours.'
              : 'Живая флористика, шары и текстильные инсталляции — собранные в единую историю вашего события. Идея, материалы, доставка, монтаж и демонтаж: стартуем за 24 часа.'}
          </motion.p>

          <motion.div variants={lineReveal} className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
            <a
              href="#calculator"
              className="
                btn-gold-sheen sheen-always
                inline-flex min-h-12 items-center justify-center gap-2
                rounded-card px-7 py-3.5
                text-sm font-semibold text-brand-onyx
                shadow-gold-glow
                transition-transform duration-200 ease-out-expo
                hover:-translate-y-0.5
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-gold focus-visible:ring-offset-2
                focus-visible:ring-offset-brand-onyx
              "
            >
              {locale === 'en' ? 'Get an estimate' : 'Получить расчёт'}
              <span aria-hidden="true">→</span>
            </a>

            <a
              href="#contact"
              className="
                inline-flex min-h-12 items-center justify-center gap-2
                rounded-card border border-brand-parchment/15
                bg-brand-parchment/[0.04] px-7 py-3.5
                text-sm font-semibold text-brand-parchment
                backdrop-blur-sm
                transition-all duration-200 ease-out-expo
                hover:-translate-y-0.5 hover:border-brand-gold/40 hover:bg-brand-parchment/10
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-gold focus-visible:ring-offset-2
                focus-visible:ring-offset-brand-onyx
              "
            >
              {locale === 'en' ? 'Leave a request' : 'Оставить заявку'}
            </a>
          </motion.div>

          <motion.div
            variants={lineReveal}
            className="flex flex-col gap-2 pt-1 text-sm text-brand-stone sm:flex-row sm:flex-wrap sm:gap-x-6"
          >
            {[
              locale === 'en' ? 'Start within 24 hours' : 'Выезд в течение 24 часов',
              locale === 'en' ? 'Fresh flowers only' : 'Только свежие цветы',
              locale === 'en' ? 'Moscow & region' : 'Москва и область',
            ].map((text) => (
              <span key={text} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-brand-gold" />
                {text}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — floating image cluster with mouse parallax */}
        <div className="relative hidden md:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' as const, delay: 0.25 }}
            style={reduceMotion ? undefined : { x: mainX, y: mainY }}
            className="relative ml-auto w-[78%]"
          >
            <div className="overflow-hidden rounded-[28px] border border-brand-parchment/10 shadow-dark-card animate-float-slow">
              <img
                src={HERO_MAIN}
                alt={
                  locale === 'en'
                    ? 'Floral wedding arch by Si-Si'
                    : 'Цветочная свадебная арка от Si-Si'
                }
                width={760}
                height={950}
                loading="eager"
                decoding="async"
                className="aspect-[4/5] w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-onyx/60 via-transparent to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' as const, delay: 0.5 }}
            style={reduceMotion ? undefined : { x: secX, y: secY }}
            className="absolute -left-4 bottom-10 w-[46%]"
          >
            <div className="overflow-hidden rounded-[20px] border border-brand-gold/20 shadow-gold-glow animate-float">
              <img
                src={HERO_SECONDARY}
                alt={
                  locale === 'en'
                    ? 'Decorated banquet table'
                    : 'Оформленный банкетный стол'
                }
                width={480}
                height={360}
                loading="eager"
                decoding="async"
                className="aspect-[4/3] w-full object-cover object-center"
              />
            </div>
            <div className="glass-card mt-3 rounded-2xl p-3.5">
              <p className="text-xs leading-5 text-brand-stone">
                {locale === 'en'
                  ? 'Si-Si — decor with character: evening light, floristry, photo zones.'
                  : 'Si-Si — декор с характером: вечерний свет, флористика, фотозоны.'}
              </p>
            </div>
          </motion.div>

          <div
            aria-hidden="true"
            className="absolute -right-6 -top-6 h-24 w-24 rounded-full border border-brand-gold/25"
          />
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Services marquee                                                  */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative border-y border-brand-parchment/[0.07] bg-brand-onyx-soft/60 py-4 backdrop-blur-sm">
        <div className="overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap pr-8">
            {[0, 1].map((dup) => (
              <div key={dup} aria-hidden={dup === 1} className="flex items-center gap-8">
                {marqueeRow.map((item, i) => (
                  <span
                    key={`${dup}-${i}`}
                    className="flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.26em] text-brand-stone"
                  >
                    {item}
                    <span aria-hidden="true" className="text-brand-gold">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
