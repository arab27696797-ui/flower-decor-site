// app/api/admin/telegram-test/route.ts
// GET /api/admin/telegram-test — Telegram integration self-diagnostic.
//
// Protected by the existing Edge middleware (admin_session cookie) like every
// other /api/admin/* route — log into /admin first, then open this URL.
//
// Purpose: pinpoint WHY lead notifications do not reach the staff chat
// without digging through Railway logs. The response says:
//   1. envPresence  — which TELEGRAM_* env vars are set (booleans ONLY,
//                     never values, safe to expose to an authenticated admin);
//   2. result       — outcome of a real test message via verifyTelegramConfig():
//                     { success: true }                        — message sent, check the chat;
//                     { success: false, error: 'TELEGRAM_BOT_TOKEN is not set' } — missing env;
//                     { success: false, error: 'Telegram API error 401: Unauthorized' } — bad token;
//                     { success: false, error: '...400: chat not found' }  — wrong chat_id /
//                     bot not started / bot removed from the group;
//                     { success: false, error: 'fetch failed' }            — network from
//                     the Railway container to api.telegram.org.
//
// No secrets are ever returned — only presence flags and Telegram's own
// error descriptions (which never contain the token).

import { NextResponse } from 'next/server'

import { verifyTelegramConfig } from '@/lib/telegram'

// Prisma-free but env-dependent — force Node runtime + no caching.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse> {
  const envPresence = {
    TELEGRAM_BOT_TOKEN:        Boolean(process.env.TELEGRAM_BOT_TOKEN),
    TELEGRAM_CHAT_ID:          Boolean(process.env.TELEGRAM_CHAT_ID),
    TELEGRAM_MESSAGE_THREAD_ID: Boolean(process.env.TELEGRAM_MESSAGE_THREAD_ID),
  }

  try {
    const result = await verifyTelegramConfig()
    return NextResponse.json(
      { ok: result.success, envPresence, result },
      { status: result.success ? 200 : 502 },
    )
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        envPresence,
        result: {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        },
      },
      { status: 502 },
    )
  }
}
