// app/api/leads/route.ts
// Next.js App Router POST handler — lead capture endpoint (v2, cleaned up).
// Uses shared createLeadV2Schema from lib/zod.ts — no inline schemas.
// Flow: parse → validate → DB write (Prisma) → Telegram notification → respond.
// Telegram failure is non-fatal: lead is already persisted, ok:true is still returned.

import { NextResponse } from 'next/server'

import { prisma }                          from '@/lib/prisma'
import { sendLeadToTelegram }              from '@/lib/telegram'
import { createLeadV2Schema, type CreateLeadV2Input } from '@/lib/zod'

// ---------------------------------------------------------------------------
// POST /api/leads
// ---------------------------------------------------------------------------

export async function POST(request: Request): Promise<NextResponse> {

  // ---- 1. Parse body -------------------------------------------------------
  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'INVALID_JSON' },
      { status: 400 },
    )
  }

  // ---- 2. Validate with shared schema -------------------------------------
  const parsed = createLeadV2Schema.safeParse(rawBody)

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok:     false,
        error:  'VALIDATION_ERROR',
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    )
  }

  const data: CreateLeadV2Input = parsed.data

  // ---- 3. Persist to DB (Prisma) -------------------------------------------
  let leadId: string

  try {
    const lead = await prisma.lead.create({
      data: {
        name:          data.name,
        phone:         data.phone,
        eventLocation: data.location,
        eventType:     null,
        desiredDate:   null,
        comment:       data.comment ?? null,
        cartItems:     data.estimateCart
                       ? (data.estimateCart as unknown as Parameters<
                           typeof prisma.lead.create
                         >[0]['data']['cartItems'])
                       : [],
        totalEstimate: data.estimateCart?.totalWithMarkup ?? 0,
        deviceType:    data.deviceType,
      },
    })

    leadId = lead.id
  } catch (dbError) {
    console.error('[leads/route] DB write failed:', dbError)
    return NextResponse.json(
      { ok: false, error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 },
    )
  }

  // ---- 4. Telegram notification (non-fatal) --------------------------------
  try {
    await sendLeadToTelegram({
      name:     data.name,
      phone:    data.phone,
      location: data.location,
      comment:  data.comment ?? '',
      cart:     data.estimateCart ?? null,
    })
  } catch (tgError) {
    // Lead is already persisted — Telegram failure must not break the response.
    console.error('[leads/route] Telegram notification failed:', tgError)
  }

  // ---- 5. Success ----------------------------------------------------------
  return NextResponse.json({ ok: true, data: { id: leadId } })
}

// Reject all other HTTP methods explicitly
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { ok: false, error: 'METHOD_NOT_ALLOWED' },
    { status: 405 },
  )
}
