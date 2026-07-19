'use client'

// components/site/advantages-section.tsx
// Si-Si — Advantages / why-us section, "Noir Bloom" design.
// Animated count-up stat band (easeOutExpo via rAF) + four numbered
// glass advantage cards with staggered reveal.

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useTranslations } from '@/lib/i18n'
import { FestiveDecor } from '@/components/site/festive-decor'

// ---------------------------------------------------------------------------
// CountUp — animates an integer from 0 to `target` once, when scrolled into
// view. Uses requestAnimationFrame with an easeOutExpo curve.
// ---------------------------------------------------------------------------

interface CountUpProps {
  target: number
  durationMs?: number
}

function CountUp({ target, durationMs = 1400 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduceMotion = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setValue(target)
      return
    }

    let raf = 0
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const p = Math.min(elapsed / durationMs, 1)
      // easeOutExpo — fast start, long smooth settle
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
      setValue(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, durationMs, reduceMotion])

  return <span ref={ref}>{value.toLocaleString('ru-RU')}</span>
}

// ---------------------------------------------------------------------------
// Stats band config
// ---------------------------------------------------------------------------

interface StatDef {
  id: 'hours' | 'projects' | 'years' | 'days'
  value: number
  suffixRu: string
  suffixEn: string
  labelRu: string
  labelEn: string
}

const STATS: StatDef[] = [
  {
    id: 'hours',
    value: 24,
    suffixRu: ' ч',
    suffixEn: ' h',
    labelRu: 'от заявки до монтажа',
    labelEn: 'from brief to installation',
  },
  {
    id: 'projects',
    value: 300,
    suffixRu: '+',
    suffixEn: '+',
    labelRu: 'оформленных мероприятий',
    labelEn: 'events decorated',
  },
  {
    id: 'years',
    value: 4,
    suffixRu: '',
    suffixEn: '',
    labelRu: 'года создаём декор в Москве',
    labelEn: 'years crafting decor in Moscow',
  },
  {
    id: 'days',
    value: 7,
    suffixRu: '',
    suffixEn: '',
    labelRu: 'дней в неделю на связи',
    labelEn: 'days a week on call',
  },
]

// ---------------------------------------------------------------------------
// Advantage cards config
// ---------------------------------------------------------------------------

interface AdvantageDef {
  id: string
  titleRu: string
  titleEn: string
  textRu: string
  textEn: string
}

const ADVANTAGES: AdvantageDef[] = [
  {
    id: 'turnkey',
    titleRu: 'Всё под ключ',
    titleEn: 'Fully turnkey',
    textRu:
      'Эскиз, производство, доставка, монтаж и демонтаж — одна команда и один договор. Вам не придётся координировать подрядчиков.',
    textEn:
      'Sketch, production, delivery, setup and teardown — one team, one contract. You never have to coordinate contractors.',
  },
  {
    id: 'stock',
    titleRu: 'Собственный склад',
    titleEn: 'In-house warehouse',
    textRu:
      '1 200+ позиций декора в наличии: цветы, конструкции, ткани, свет. Поэтому берёмся даже за срочные проекты — за 24 часа.',
    textEn:
      '1,200+ decor items in stock: florals, structures, fabrics, lighting. That is why we take rush projects — even 24-hour ones.',
  },
  {
    id: 'fixed',
    titleRu: 'Фиксированная смета',
    titleEn: 'Fixed estimate',
    textRu:
      'Цена из калькулятора фиксируется в договоре после брифа. Никаких «допов» в день мероприятия — смета не растёт.',
    textEn:
      'The calculator price is locked into the contract after the brief. No surprise add-ons on event day — the estimate never grows.',
  },
  {
    id: 'durability',
    titleRu: 'Декор, который живёт',
    titleEn: 'Decor that lasts',
    textRu:
      'Премиальные материалы держат вид весь вечер и дольше: шары — до 5 дней, флористика не вянет и не осыпается к финалу.',
    textEn:
      'Premium materials look flawless all evening and beyond: balloons last up to 5 days, florals never wilt or shed by the finale.',
  },
]

// ---------------------------------------------------------------------------
// Motion variants
// ---------------------------------------------------------------------------

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
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

export function AdvantagesSection() {
  const { locale } = useTranslations()
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative overflow-hidden bg-brand-onyx-soft py-20 sm:py-24 lg:py-28">
      {/* Gold glow behind stats band */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 h-72 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-brand-gold/[0.07] blur-3xl"
      />

      {/* Floating flowers and balloons */}
      <FestiveDecor />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats band */}
        <motion.dl
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 gap-x-6 gap-y-10 border-y border-brand-midnight-border py-12 lg:grid-cols-4"
        >
          {STATS.map((stat) => (
            <motion.div key={stat.id} variants={item} className="text-center">
              <dd className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                <span className="text-gold-gradient">
                  <CountUp target={stat.value} />
                  {locale === 'en' ? stat.suffixEn : stat.suffixRu}
                </span>
              </dd>
              <dt className="mt-3 text-xs uppercase tracking-[0.18em] text-brand-stone sm:text-sm sm:normal-case sm:tracking-normal">
                {locale === 'en' ? stat.labelEn : stat.labelRu}
              </dt>
            </motion.div>
          ))}
        </motion.dl>

        {/* Heading */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto mb-12 mt-16 max-w-2xl text-center"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-gold-dark">
            {locale === 'en' ? 'Why Si-Si' : 'Почему Si-Si'}
          </p>
          <h2 className="font-display text-display-lg font-semibold text-brand-parchment">
            {locale === 'en' ? (
              <>
                Calm for you —{' '}
                <span className="text-gold-gradient italic">flawless for guests</span>
              </>
            ) : (
              <>
                Спокойствие для вас —{' '}
                <span className="text-gold-gradient italic">восторг для гостей</span>
              </>
            )}
          </h2>
        </motion.div>

        {/* Advantage cards */}
        <motion.ol
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5"
        >
          {ADVANTAGES.map((adv, index) => (
            <motion.li
              key={adv.id}
              variants={item}
              className="glass-card glow-hover group relative overflow-hidden rounded-card p-6 lg:p-8"
            >
              {/* Oversized ghost number */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[6.5rem] font-semibold leading-none text-brand-parchment/[0.05] transition-colors duration-slow group-hover:text-brand-gold/10"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="relative flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold-dark">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-2xl font-semibold text-brand-parchment">
                  {locale === 'en' ? adv.titleEn : adv.titleRu}
                </h3>
                <p className="text-sm leading-relaxed text-brand-stone">
                  {locale === 'en' ? adv.textEn : adv.textRu}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </div>
  )
}
