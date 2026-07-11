import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { createLeadSchema } from '@/lib/zod'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createLeadSchema.safeParse(body)

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

    const lead = await prisma.lead.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        eventType: parsed.data.eventType,
        desiredDate: parsed.data.desiredDate,
        comment: parsed.data.comment ?? null,
        cartItems: parsed.data.cartItems,
        utmSource: parsed.data.utmSource ?? null,
        utmMedium: parsed.data.utmMedium ?? null,
        utmCampaign: parsed.data.utmCampaign ?? null,
        utmTerm: parsed.data.utmTerm ?? null,
        utmContent: parsed.data.utmContent ?? null,
        referrerPage: parsed.data.referrerPage ?? null,
        deviceType: parsed.data.deviceType,
      },
    })

    return NextResponse.json({
      ok: true,
      data: {
        id: lead.id,
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
