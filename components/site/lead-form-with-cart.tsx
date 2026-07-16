'use client'

// components/site/lead-form-with-cart.tsx
// Client bridge between the calculator Zustand cart and <LeadForm>.
//
// WHY THIS FILE EXISTS:
//   app/page.tsx is a Server Component — it cannot read the client-side
//   Zustand store and cannot pass function props to Client Components.
//   This wrapper subscribes to the calculator cart and passes a live
//   EstimateCart snapshot into <LeadForm>, so the estimate assembled in
//   the calculator section arrives pre-attached to the lead payload
//   (EstimateMiniSummary + POST /api/leads body + Telegram message).

import { useCalculatorCart } from '@/components/site/calculator/calculator-cart'
import { LeadForm } from '@/components/site/lead-form'

export function LeadFormWithCart() {
  const items = useCalculatorCart((s) => s.items)
  const getEstimateCart = useCalculatorCart((s) => s.getEstimateCart)

  // null = no estimate attached — <LeadForm> renders its contact-only state.
  const estimateCart = items.length > 0 ? getEstimateCart() : null

  return <LeadForm estimateCart={estimateCart} />
}

export default LeadFormWithCart
