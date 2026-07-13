'use client'

import { formatPrice, roundToHundreds } from '../../lib/utils'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-blush/40">
      <div className="mx-auto flex min-h-[320px] max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 md:flex-row md:items-center md:py-16">
        <div className="relative z-10 flex-1 space-y-6 animate-[fadein_700ms_ease-out]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-forest/70">
            Премиальное оформление событий в Москве
          </p>
          <h1 className="text-display-xl font-semibold leading-tight text-brand-ink">
            Цветы и декор <br /> для событий, которые
            хочется фотографировать
          </h1>
          <p className="max-w-xl text-sm leading-6 text-brand-ink/80 md:text-base">
            Живые цветы, воздушные шары и текстиль — собранные в цельную
            визуальную историю под ваш бюджет. Калькулятор и форма заявки
            ниже помогут понять ориентировочную стоимость и оставить запрос.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#calculator"
              className="inline-flex items-center justify-center rounded-card bg-brand-forest px-5 py-2.5 text-sm font-medium text-white shadow-card transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blush/40"
            >
              Рассчитать декор
            </a>
            <a
              href="#lead-form"
              className="inline-flex items-center justify-center rounded-card border border-brand-ink/15 bg-white/80 px-5 py-2.5 text-sm font-medium text-brand-ink shadow-card transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blush/40"
            >
              Оставить заявку
            </a>
          </div>
        </div>

        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-0 translate-x-4 -translate-y-6 scale-110 rounded-[28px] bg-brand-gold/25 blur-3xl" />
          <div className="relative z-10 rounded-card border border-brand-ink/10 bg-white/90 p-5 shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-card-hover">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-forest/70">
              Ориентировочная стоимость
            </p>
            <p className="mt-3 text-sm leading-6 text-brand-ink/80">
              При бюджете <span className="font-semibold">{formatPrice(15000)}</span>{' '}
              на живые цветы и стандартной наценке{' '}
              <span className="font-semibold">30%</span> итоговая стоимость
              оформления будет примерно{' '}
              <span className="font-semibold">
                {formatPrice(roundToHundreds(15000 * 1 * 1.3))}
              </span>
              .
            </p>
            <p className="mt-3 text-xs text-brand-ink/65">
              Калькулятор ниже позволит адаптировать цифры под ваш бюджет и
              тип оформления.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
