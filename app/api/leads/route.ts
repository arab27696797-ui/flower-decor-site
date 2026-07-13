// app/api/leads/route.ts
// Next.js App Router POST route — lead capture endpoint.
// Accepts the new EstimateCart payload shape from components/site/lead-form.tsx.
// Validates with an inline zod schema (compatible with the new payload).
// Writes to DB via prisma using the established repository pattern from lib/prisma.
// Sends to Telegram via lib/telegram.ts sendLeadToTelegram after a successful DB write.
// If the DB write fails, Telegram is NOT called — preserves data integrity order.
// If Telegram fails, we still return ok:true — the lead is already persisted.

import { NextResponse } from 'next/server'
import { z }            from 'zod'

import { prisma }               from '@/lib/prisma'
import { sendLeadToTelegram }   from '@/lib/telegram'

// ---------------------------------------------------------------------------
// Inline schema for the new EstimateCart-based payload
// Replaces the old createLeadSchema for this route only.
// lib/zod.ts will be updated separately to keep it aligned.
// ---------------------------------------------------------------------------

// Mirrors CategorySelection from lib/calculator-config.ts — validated loosely
// so the route is resilient to future config changes.
const selectionSchema = z.object({
  fieldId:         z.string(),
  labelRu:         z.string(),
  labelEn:         z.string(),
  selectedValue:   z.union([z.string(), z.boolean(), z.number()]),
  selectedLabelRu: z.string(),
  selectedLabelEn: z.string(),
})

// Mirrors CartItem from lib/calculator-config.ts
const cartItemSchema = z.object({
  id:                   z.string().min(1),
  categoryId:           z.string().min(1),
  categoryLabelRu:      z.string(),
  categoryLabelEn:      z.string(),
  selections:           z.array(selectionSchema),
  basePrice:            z.number().nonnegative(),
  subtotalWithMarkup:   z.number().nonnegative(),
})

// Mirrors EstimateCart from lib/calculator-config.ts
const estimateCartSchema = z.object({
  items:              z.array(cartItemSchema),
  totalBeforeMarkup:  z.number().nonnegative(),
  totalWithMarkup:    z.number().nonnegative(),
})

// Full lead request schema — matches LeadRequestPayload in components/site/lead-form.tsx
const leadRequestSchema = z.object({
  name:         z.string().min(2).max(100),
  phone:        z.string().min(5).max(30),
  location:     z.string().min(3).max(300),
  comment:      z.string().max(2000).optional().nullable(),
  estimateCart: estimateCartSchema.nullable(),
  deviceType:   z.string().min(2).max(50).optional().default('unknown'),
})

type LeadRequest = z.infer<typeof leadRequestSchema>

// ---------------------------------------------------------------------------
// POST handler
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

  // ---- 2. Validate ---------------------------------------------------------
  const parsed = leadRequestSchema.safeParse(rawBody)
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

  const data: LeadRequest = parsed.data

  // ---- 3. Persist to DB (Prisma) -------------------------------------------
  // cartItems is stored as JSON (Prisma Json field) — same pattern as original route.
  // estimateCart replaces the old cartItems array.
  let leadId: string
  try {
    const lead = await prisma.lead.create({
      data: {
        name:         data.name,
        phone:        data.phone,
        // location maps to the nearest existing Prisma field.
        // If the Prisma schema has no `location` field yet, it falls back
        // to eventType which already exists — the schema migration is tracked
        // separately as the next step.
        eventType:    data.location,
        desiredDate:  null,
        comment:      data.comment ?? null,
        // Store the full cart as JSON — existing cartItems field is a Json column.
        cartItems:    data.estimateCart
                        ? (data.estimateCart as unknown as Parameters<typeof prisma.lead.create>[0]['data']['cartItems'])
                        : [],
        deviceType:   data.deviceType,
      },
    })
    leadId = lead.id
  } catch (dbError) {
    // Log for server-side observability; do not expose internals to client.
    console.error('[leads/route] DB write failed:', dbError)
    return NextResponse.json(
      { ok: false, error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 },
    )
  }

  // ---- 4. Send to Telegram (non-blocking failure) --------------------------
  try {
    await sendLeadToTelegram({
      leadId,
      name:         data.name,
      phone:        data.phone,
      location:     data.location,
      comment:      data.comment ?? '',
      estimateCart: data.estimateCart,
    })
  } catch (tgError) {
    // Telegram failure must not break the lead capture —
    // lead is already persisted. Log and continue.
    console.error('[leads/route] Telegram notification failed:', tgError)
  }

  // ---- 5. Success ----------------------------------------------------------
  return NextResponse.json({ ok: true, data: { id: leadId } })
}

// Reject all other HTTP methods explicitly
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ ok: false, error: 'METHOD_NOT_ALLOWED' }, { status: 405 })
}
