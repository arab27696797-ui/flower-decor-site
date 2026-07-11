export type PricingInput = {
  marketPrice: number
  flowerTypeCoef: number
  markupPercent: number
}

export function calculateFinalPrice({
  marketPrice,
  flowerTypeCoef,
  markupPercent,
}: PricingInput): number {
  const rawPrice = marketPrice * flowerTypeCoef * (1 + markupPercent / 100)
  return Math.round(rawPrice / 100) * 100
}
