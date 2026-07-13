'use client'

import { useState } from 'react'
import { HeroSection } from '../components/site/hero-section'
import { PortfolioPreview } from '../components/site/portfolio-preview'
import { DecorCalculator, type DecorType } from '../components/site/decor-calculator'
import { LeadForm } from '../components/site/lead-form'

type CalculatorResult = {
  budget: number
  decorType: DecorType
  markup: number
  price: number
}

export default function HomePage() {
  const [calculatorResult, setCalculatorResult] = useState<CalculatorResult | null>(
    null,
  )

  return (
    <main className="min-h-screen bg-brand-cream text-brand-ink">
      <HeroSection />
      <PortfolioPreview />
      <DecorCalculator onResultChange={setCalculatorResult} />
      <LeadForm calculatorResult={calculatorResult} />

      <footer className="border-t border-brand-ink/10 bg-brand-cream/90">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="text-sm text-brand-ink/80">
            Контакты: телефон / мессенджер: +7 ——— (подставьте ваш рабочий номер).
          </p>
        </div>
      </footer>
    </main>
  )
}
