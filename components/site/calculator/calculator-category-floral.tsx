'use client'

// components/site/calculator/calculator-category-floral.tsx
// Thin wrapper — renders the generic config-driven category card
// for the floral category. Kept as a separate module so existing
// imports (app/page.tsx) remain stable.

import { CalculatorCategoryCard } from '@/components/site/calculator/calculator-category-card'

interface CalculatorCategoryFloralProps {
  onCalculated?: () => void
}

export function CalculatorCategoryFloral({ onCalculated }: CalculatorCategoryFloralProps) {
  return <CalculatorCategoryCard categoryId="floral" index={0} onCalculated={onCalculated} />
}

export default CalculatorCategoryFloral
