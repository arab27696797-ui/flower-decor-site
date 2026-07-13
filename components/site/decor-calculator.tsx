'use client'

import { useState } from 'react'
import { useScrollReveal } from '../../hooks/use-scroll-reveal'
import { formatPrice, roundToHundreds } from '../../lib/utils'

export type DecorType = 'live' | 'artificial'

type DecorCalculatorProps = {
  onResultChange?: (result: {
    budget: number
    decorType: DecorType
    markup: number
    price: number
  }) => void
}

export function DecorCalculator({ onResultChange }: DecorCalculatorProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()
  const [budget, setBudget] = useState(15000)
  const [decorType, setDecorType] = useState<DecorType>('live')
  const [markup, setMarkup] = useState(30)
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null)

  function handleCalculate() {
    const flowerTypeCoef = decorType === 'live' ? 1 : 0.6
    const raw = budget * flowerTypeCoef * (1 + markup / 100)
    const price = roundToHundreds(raw)

    setCalculatedPrice(price)
    onResultChange?.({ budget, decorType, markup, price })
  }

  return (
    <section
      id="calculator"
      className="mx-auto max-w-6xl bg-brand-cream px-4 py-10 sm:px-6 md:py-14"
    >
      <div
        ref={ref}
        className={`space-y-3 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="text-display-md font-semibold text-brand-ink">
          Калькулятор декора
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-brand-ink/80 md:text-base">
          Введите ориентировочный бюджет, выберите тип оформления и наценку —
          калькулятор покажет примерную конечную стоимость.
        </p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <form
          className="space-y-4 rounded-card border border-brand-ink/10 bg-white/95 p-5 shadow-card transition-shadow duration-200 hover:shadow-card-hover"
          onSubmit={(e) => {
            e.preventDefault()
            handleCalculate()
          }}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-ink">
              Бюджет на материалы, ₽
            </label>
            <input
              type="number"
              min={0}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value) || 0)}
              className="w-full rounded-card border border-brand-ink/20 bg-white px-3 py-2.5 text-sm text-brand-ink shadow-sm transition-colors duration-200 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-ink">
              Тип оформления
            </label>
            <select
              value={decorType}
              onChange={(e) => setDecorType(e.target.value as DecorType)}
              className="w-full rounded-card border border-brand-ink/20 bg-white px-3 py-2.5 text-sm text-brand-ink shadow-sm transition-colors duration-200 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            >
              <option value="live">Живые цветы</option>
              <option value="artificial">Композиции с искусственными цветами</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-ink">
              Наценка, %
            </label>
            <input
              type="number"
              min={0}
              max={200}
              value={markup}
              onChange={(e) => setMarkup(Number(e.target.value) || 0)}
              className="w-full rounded-card border border-brand-ink/20 bg-white px-3 py-2.5 text-sm text-brand-ink shadow-sm transition-colors duration-200 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-card bg-brand-forest px-5 py-2.5 text-sm font-medium text-white shadow-card transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Посчитать стоимость
          </button>
        </form>

        <div className="space-y-3 rounded-card border border-brand-ink/10 bg-white/95 p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-forest/70">
            Ориентировочный результат
          </p>
          <p className="text-sm leading-6 text-brand-ink/80 md:text-base">
            Итоговая стоимость оформления при текущих параметрах:
          </p>
          <p className="mt-2 text-display-md font-semibold text-brand-ink">
            {calculatedPrice ? formatPrice(calculatedPrice) : '—'}
          </p>
          <p className="mt-2 text-xs leading-5 text-brand-ink/70">
            Это ориентировочная цифра без учёта сложных технических элементов
            и нестандартных площадок.
          </p>
        </div>
      </div>
    </section>
  )
}
