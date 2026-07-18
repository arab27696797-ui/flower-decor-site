// app/api/leads/route.ts
// Next.js App Router POST handler — lead capture endpoint (v3, resilient).
// Uses shared createLeadV2Schema from lib/zod.ts — no inline schemas.
//
// DELIVERY CONTRACT (v3):
//   A lead is considered DELIVERED when at least one staff channel succeeds:
//     1. Primary   — persisted to Postgres via Prisma (admin panel history).
//     2. Fallback  — Telegram notification to the staff chat.
//   Both channels are attempted independently and in parallel. The request
//   only fails (HTTP 500) when BOTH channels fail — previously a single
//   database outage made every form submission fail even though the team
//   could have received the lead in Telegram.
//
// RESPONSES:
//   200 { ok: true, data: { id },        delivery: 'database' | 'database+telegram' }
//   200 { ok: true, data: { id: null },  delivery: 'telegram', degraded: true }
//   400 { ok: false, error: 'INVALID_JSON' | 'VALIDATION_ERROR', issues? }
//   500 { ok: false, error: 'DELIVERY_FAILED' }  — both channels failed
//
// ENV VARS (Railway):
//   DATABASE_URL         — required for the primary channel.
//   TELEGRAM_BOT_TOKEN   — required for the fallback channel.
//   TELEGRAM_CHAT_ID     — required for the fallback channel.
//   TELEGRAM_MESSAGE_THREAD_ID — optional forum topic id.

import { NextResponse } from 'next/server'

import { prisma }                          from '@/lib/prisma'
import { sendLeadToTelegram }              from '@/lib/telegram'
import { createLeadV2Schema, type CreateLeadV2Input } from '@/lib/zod'

// Prisma requires the Node.js runtime — make it explicit so this route can
// never be accidentally bundled for the Edge runtime.
export const runtime = 'nodejs'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Persist the lead to Postgres. Resolves with the new lead id. */
async function persistLead(data: CreateLeadV2Input): Promise<string> {
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
  return lead.id
}

/**
 * Notify the staff chat in Telegram.
 * Resolves true on success, false on API/network failure.
 * Throws TelegramConfigError when env vars are missing (infra misconfig).
 */
async function notifyTelegram(data: CreateLeadV2Input): Promise<boolean> {
  const result = await sendLeadToTelegram({
    name:     data.name,
    phone:    data.phone,
    location: data.location,
    comment:  data.comment ?? '',
    cart:     data.estimateCart ?? null,
  })
  if (!result.success) {
    console.error('[leads/route] Telegram API rejected the message:', result.error)
  }
  return result.success
}

/** Logs which delivery-channel env vars are present (never their values). */
function logEnvHints(): void {
  console.error('[leads/route] env presence:', {
    DATABASE_URL:         Boolean(process.env.DATABASE_URL),
    TELEGRAM_BOT_TOKEN:   Boolean(process.env.TELEGRAM_BOT_TOKEN),
    TELEGRAM_CHAT_ID:     Boolean(process.env.TELEGRAM_CHAT_ID),
  })
}

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

  // ---- 3. Deliver via both channels, independently -------------------------
  const [dbResult, tgResult] = await Promise.allSettled([
    persistLead(data),
    notifyTelegram(data),
  ])

  const dbOk = dbResult.status === 'fulfilled'
  const tgOk = tgResult.status === 'fulfilled' && tgResult.value === true

  if (dbResult.status === 'rejected') {
    console.error('[leads/route] DB write failed:', dbResult.reason)
  }
  if (tgResult.status === 'rejected') {
    // TelegramConfigError lands here when TELEGRAM_* env vars are missing.
    console.error('[leads/route] Telegram notification failed:', tgResult.reason)
  }

  // ---- 4. Respond ----------------------------------------------------------

  // Best case: lead persisted (Telegram may or may not have succeeded).
  if (dbOk) {
    if (!tgOk) {
      console.error('[leads/route] lead saved to DB but Telegram delivery failed — check TELEGRAM_* env vars')
    }
    return NextResponse.json({
      ok:       true,
      data:     { id: dbResult.value },
      delivery: tgOk ? 'database+telegram' : 'database',
    })
  }

  // Degraded but acceptable: DB is down, yet the team got the lead in Telegram.
  if (tgOk) {
    console.error('[leads/route] lead delivered via Telegram only — DB write failed, check DATABASE_URL / migrations')
    logEnvHints()
    return NextResponse.json({
      ok:       true,
      data:     { id: null },
      delivery: 'telegram',
      degraded: true,
    })
  }

  // Worst case: both channels failed — the client must show an error state.
  console.error('[leads/route] DELIVERY FAILED on both channels')
  logEnvHints()
  return NextResponse.json(
    { ok: false, error: 'DELIVERY_FAILED' },
    { status: 500 },
  )
}

// Reject all other HTTP methods explicitly
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { ok: false, error: 'METHOD_NOT_ALLOWED' },
    { status: 405 },
  )
}
