'use client'

// components/site/calculator/calculator-category-bouquet.tsx
// Thin wrapper — renders the generic config-driven category card
// for the bouquet category. Kept as a separate module so existing
// imports (app/page.tsx) remain stable.

import { CalculatorCategoryCard } from '@/components/site/calculator/calculator-category-card'

interface CalculatorCategoryBouquetProps {
  onCalculated?: () => void
}

export function CalculatorCategoryBouquet({ onCalculated }: CalculatorCategoryBouquetProps) {
  return <CalculatorCategoryCard categoryId="bouquet" index={2} onCalculated={onCalculated} />
}

export default CalculatorCategoryBouquet
