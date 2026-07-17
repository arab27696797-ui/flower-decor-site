'use client'

// components/site/calculator/calculator-category-event.tsx
// Thin wrapper — renders the generic config-driven category card
// for the event category. Kept as a separate module so existing
// imports (app/page.tsx) remain stable.

import { CalculatorCategoryCard } from '@/components/site/calculator/calculator-category-card'

interface CalculatorCategoryEventProps {
  onCalculated?: () => void
}

export function CalculatorCategoryEvent({ onCalculated }: CalculatorCategoryEventProps) {
  return <CalculatorCategoryCard categoryId="event" index={3} onCalculated={onCalculated} />
}

export default CalculatorCategoryEvent
