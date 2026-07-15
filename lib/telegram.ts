// lib/telegram.ts
// Utility for formatting and sending lead notifications to Telegram Bot API.
// Always formats messages in Russian — intended for internal staff use.
// Framework-agnostic: safe to call from app/api/leads/route.ts or any server context.

import type { CartItem, EstimateCart } from './calculator-config'

// ---------------------------------------------------------------------------
// Environment variable access
// ---------------------------------------------------------------------------

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new TelegramConfigError('TELEGRAM_BOT_TOKEN is not set')
  return token
}

function getChatId(): string {
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!chatId) throw new TelegramConfigError('TELEGRAM_CHAT_ID is not set')
  return chatId
}

// ---------------------------------------------------------------------------
// Custom error class
// ---------------------------------------------------------------------------

export class TelegramConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TelegramConfigError'
  }
}

export class TelegramSendError extends Error {
  readonly statusCode?: number
  constructor(message: string, statusCode?: number) {
    super(message)
    this.name = 'TelegramSendError'
    this.statusCode = statusCode
  }
}

// ---------------------------------------------------------------------------
// Lead payload type — input contract for this utility
// ---------------------------------------------------------------------------

export interface LeadPayload {
  name: string
  phone: string
  location: string
  comment?: string
  /** Full estimate cart from the calculator — may be null if user skipped it */
  cart: EstimateCart | null
}

// ---------------------------------------------------------------------------
// Structured send result — returned to the API route caller
// ---------------------------------------------------------------------------

export type TelegramSendResult =
  | { success: true }
  | { success: false; error: string; code?: number }

// ---------------------------------------------------------------------------
// Category label map — Russian display names for staff messages
// ---------------------------------------------------------------------------

const CATEGORY_LABELS_RU: Record<string, string> = {
  floral:   'Цветочное оформление',
  balloons: 'Воздушные шары',
  bouquet:  'Срочный букет',
  event:    'Оформление мероприятия',
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

/** Escape Telegram MarkdownV2 reserved characters */
function escapeMd(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&')
}

/** Format a number as Russian currency string: 15 000 ₽ */
function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ru-RU')} ₽`
}

/** Format a single CartItem into readable staff lines */
function formatCartItem(item: CartItem, index: number): string {
  const categoryLabel = CATEGORY_LABELS_RU[item.categoryId] ?? item.categoryLabelRu
  const lines: string[] = [
    `*${index + 1}\\. ${escapeMd(categoryLabel)}*`,
  ]

  for (const sel of item.selections) {
    const value = String(sel.selectedLabelRu)
    lines.push(`  • ${escapeMd(sel.labelRu)}: ${escapeMd(value)}`)
  }

  lines.push(
    `  💰 Подытог: *${escapeMd(formatCurrency(item.subtotalWithMarkup))}*`,
  )

  return lines.join('\n')
}

/** Format the full EstimateCart block */
function formatCart(cart: EstimateCart): string {
  if (cart.items.length === 0) {
    return '_Калькулятор не заполнен_'
  }

  const itemLines = cart.items
    .map((item, i) => formatCartItem(item, i))
    .join('\n\n')

  const totalLine = [
    '',
    `📊 *Итого по смете: ${escapeMd(formatCurrency(cart.totalWithMarkup))}*`,
    `\\(до наценки: ${escapeMd(formatCurrency(cart.totalBeforeMarkup))}\\)`,
  ].join('\n')

  return itemLines + totalLine
}

// ---------------------------------------------------------------------------
// Full message formatter — produces the complete staff-facing Telegram message
// ---------------------------------------------------------------------------

export function formatLeadMessage(payload: LeadPayload): string {
  const now = new Date().toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const lines: string[] = [
    '🌸 *НОВАЯ ЗАЯВКА*',
    `_${escapeMd(now)} МСК_`,
    '',
    '👤 *Клиент*',
    `  Имя: ${escapeMd(payload.name)}`,
    `  Телефон: ${escapeMd(payload.phone)}`,
    `  Место: ${escapeMd(payload.location)}`,
  ]

  if (payload.comment && payload.comment.trim().length > 0) {
    lines.push('')
    lines.push('💬 *Пожелания*')
    lines.push(escapeMd(payload.comment.trim()))
  }

  lines.push('')
  lines.push('🧮 *Смета из калькулятора*')

  if (payload.cart && payload.cart.items.length > 0) {
    lines.push(formatCart(payload.cart))
  } else {
    lines.push('_Смета не заполнена — только контактные данные_')
  }

  lines.push('')
  lines.push('─────────────────────')
  lines.push('_Ответьте клиенту в течение 30 минут_')

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Core send function — sends a pre-formatted message string to Telegram
// ---------------------------------------------------------------------------

async function sendRawMessage(
  botToken: string,
  chatId: string,
  text: string,
): Promise<TelegramSendResult> {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`

  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true,
      }),
    })
  } catch (networkError) {
    const message =
      networkError instanceof Error
        ? networkError.message
        : 'Network error while contacting Telegram API'
    return { success: false, error: message }
  }

  if (!response.ok) {
    let detail = ''
    try {
      const body = await response.json() as { description?: string }
      detail = body.description ?? ''
    } catch {
      // ignore JSON parse failure
    }
    return {
      success: false,
      error: `Telegram API error ${response.status}${detail ? `: ${detail}` : ''}`,
      code: response.status,
    }
  }

  return { success: true }
}

// ---------------------------------------------------------------------------
// Main public function — format + send in one call
// ---------------------------------------------------------------------------

/**
 * Format a lead payload into a Russian staff message and send it to Telegram.
 *
 * Returns a structured TelegramSendResult so the caller (app/api/leads/route.ts)
 * can decide how to handle failure without crashing.
 *
 * Throws TelegramConfigError only if env vars are missing — this is an
 * infrastructure problem that should surface loudly, not be swallowed.
 */
export async function sendLeadToTelegram(
  payload: LeadPayload,
): Promise<TelegramSendResult> {
  const botToken = getBotToken()  // throws TelegramConfigError if missing
  const chatId   = getChatId()    // throws TelegramConfigError if missing

  const message = formatLeadMessage(payload)
  return sendRawMessage(botToken, chatId, message)
}

// ---------------------------------------------------------------------------
// Lightweight health-check — verifies bot credentials are valid
// (useful for admin panel "test notification" feature later)
// ---------------------------------------------------------------------------

export async function verifyTelegramConfig(): Promise<TelegramSendResult> {
  let botToken: string
  let chatId: string

  try {
    botToken = getBotToken()
    chatId   = getChatId()
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Missing Telegram config',
    }
  }

  return sendRawMessage(
    botToken,
    chatId,
    '✅ Telegram-интеграция настроена корректно\\. Тестовое сообщение\\.',
  )
}
