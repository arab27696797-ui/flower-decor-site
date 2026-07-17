'use client'

// components/site/calculator/calculator-category-balloons.tsx
// Thin wrapper — renders the generic config-driven category card
// for the balloons category. Kept as a separate module so existing
// imports (app/page.tsx) remain stable.

import { CalculatorCategoryCard } from '@/components/site/calculator/calculator-category-card'

interface CalculatorCategoryBalloonsProps {
  onCalculated?: () => void
}

export function CalculatorCategoryBalloons({ onCalculated }: CalculatorCategoryBalloonsProps) {
  return <CalculatorCategoryCard categoryId="balloons" index={1} onCalculated={onCalculated} />
}

export default CalculatorCategoryBalloons
