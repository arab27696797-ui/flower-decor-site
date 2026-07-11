import { NextResponse } from 'next/server'
import { z } from 'zod'

import { calculateFinalPrice } from '@/lib/pricing'

const pricingRequestSchema = z.object({
  marketPrice: z.number().nonnegative(),
  flowerTypeCoef: z.number().positive(),
  markupPercent: z.number().min(0),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = pricingRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'VALIDATION_ERROR',
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      )
    }

    const finalPrice = calculateFinalPrice(parsed.data)

    return NextResponse.json({
      ok: true,
      data: {
        finalPrice,
      },
    })
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    )
  }
}
