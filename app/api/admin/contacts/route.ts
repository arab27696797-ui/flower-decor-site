// app/api/admin/contacts/route.ts
// Si-Si — Admin API: Public Contact Information.
//
// METHODS SUPPORTED:
//   GET   — returns the current in-memory contact configuration.
//   POST  — replaces the entire contact configuration (full update).
//           The admin UI (app/admin/contacts/page.tsx) already sends POST,
//           so this method is the primary one.
//   PATCH — accepts a partial update (deep-merge), mirroring the pricing
//           route pattern for consistency. Available for future tooling.
//
// PERSISTENCE:
//   All data is stored in a module-level variable (in-process memory).
//   Changes survive only within the current server process lifetime.
//   On server restart or redeploy, values reset to DEFAULT_CONTACTS.
//   This is the same honest temporary pattern as app/api/admin/pricing/route.ts.
//   To upgrade to real persistence: replace `store` with a DB read/write
//   using Prisma, Supabase, or any KV store — the public API contract stays identical.
//
// VALIDATION:
//   Performed with plain TypeScript (no external library).
//   Zod is available in the project but not yet imported here to keep
//   this route self-contained and symmetrical with the pricing route pattern.

import { NextRequest, NextResponse } from 'next/server'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ContactsConfig = {
  phoneDisplay: string      // Human-readable display: "+7 (495) 792-18-98"
  phoneTel: string          // tel: href value: "+74957921898"
  telegramHandle: string    // without @: "SI_SI_Dekor"
  whatsappNumber: string    // wa.me/ path, digits only: "79037921898"
  email: string             // optional, may be empty string
  instagramHandle: string   // without @, optional
}

// ---------------------------------------------------------------------------
// Default contact configuration — real business contacts
// ---------------------------------------------------------------------------

const DEFAULT_CONTACTS: ContactsConfig = {
  phoneDisplay: '+7 (495) 792-18-98',
  phoneTel: '+74957921898',
  telegramHandle: 'SI_SI_Dekor',
  whatsappNumber: '79037921898',
  email: 'sisidekor860@mail.ru',
  instagramHandle: 'si_si_dekor',
}

// ---------------------------------------------------------------------------
// In-memory store
// Module-level singleton. Persists across requests within a single process.
// Resets to DEFAULT_CONTACTS on every cold start / redeploy.
// ---------------------------------------------------------------------------

let store: ContactsConfig = { ...DEFAULT_CONTACTS }

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

type ValidationResult =
  | { valid: true }
  | { valid: false; errors: string[] }

function validateContactsConfig(data: unknown): ValidationResult {
  const errors: string[] = []

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return { valid: false, errors: ['Request body must be a JSON object.'] }
  }

  const d = data as Record<string, unknown>

  // phoneDisplay — required string
  if (typeof d.phoneDisplay !== 'string' || !d.phoneDisplay.trim()) {
    errors.push('phoneDisplay: required non-empty string.')
  }

  // phoneTel — required, must match +<digits> pattern
  if (typeof d.phoneTel !== 'string' || !d.phoneTel.trim()) {
    errors.push('phoneTel: required non-empty string.')
  } else if (!/^\+\d{10,15}$/.test(d.phoneTel.trim())) {
    errors.push('phoneTel: must be in format +79991234567 (+ followed by 10–15 digits).')
  }

  // telegramHandle — required, no spaces, no @
  if (typeof d.telegramHandle !== 'string' || !d.telegramHandle.trim()) {
    errors.push('telegramHandle: required non-empty string.')
  } else if (/\s/.test(d.telegramHandle)) {
    errors.push('telegramHandle: must not contain whitespace.')
  } else if (d.telegramHandle.startsWith('@')) {
    errors.push('telegramHandle: must not include the @ prefix.')
  }

  // whatsappNumber — required, digits only, 10–15 chars
  if (typeof d.whatsappNumber !== 'string' || !d.whatsappNumber.trim()) {
    errors.push('whatsappNumber: required non-empty string.')
  } else if (!/^\d{10,15}$/.test(d.whatsappNumber.trim())) {
    errors.push('whatsappNumber: must contain only digits (no + or spaces), e.g. 79991234567.')
  }

  // email — optional; if present, must look like an email
  if (d.email !== undefined && d.email !== '') {
    if (typeof d.email !== 'string') {
      errors.push('email: must be a string.')
    } else if (d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) {
      errors.push('email: must be a valid email address or an empty string.')
    }
  }

  // instagramHandle — optional; if present, no spaces, no @
  if (d.instagramHandle !== undefined && d.instagramHandle !== '') {
    if (typeof d.instagramHandle !== 'string') {
      errors.push('instagramHandle: must be a string.')
    } else if (/\s/.test(d.instagramHandle as string)) {
      errors.push('instagramHandle: must not contain whitespace.')
    } else if ((d.instagramHandle as string).startsWith('@')) {
      errors.push('instagramHandle: must not include the @ prefix.')
    }
  }

  return errors.length > 0 ? { valid: false, errors } : { valid: true }
}

// ---------------------------------------------------------------------------
// Helper: extract a ContactsConfig from a raw object (safe)
// Only picks known keys; ignores any extra fields from the request body.
// ---------------------------------------------------------------------------

function extractConfig(raw: Record<string, unknown>): ContactsConfig {
  return {
    phoneDisplay:    String(raw.phoneDisplay    ?? '').trim(),
    phoneTel:        String(raw.phoneTel        ?? '').trim(),
    telegramHandle:  String(raw.telegramHandle  ?? '').trim(),
    whatsappNumber:  String(raw.whatsappNumber  ?? '').trim(),
    email:           String(raw.email           ?? '').trim(),
    instagramHandle: String(raw.instagramHandle ?? '').trim(),
  }
}

// ---------------------------------------------------------------------------
// GET /api/admin/contacts
// Returns the current contact configuration.
// ---------------------------------------------------------------------------

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: true,
      data: store,
      _persistence: 'in-memory — resets on server restart',
    },
    { status: 200 }
  )
}

// ---------------------------------------------------------------------------
// POST /api/admin/contacts
// Full replacement of the contact configuration.
// This matches the method used by app/admin/contacts/page.tsx.
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON in request body.' },
      { status: 400 }
    )
  }

  const validation = validateContactsConfig(body)

  if (!validation.valid) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed.',
        details: validation.errors,
      },
      { status: 422 }
    )
  }

  // Replace the entire store with the validated, sanitised data.
  store = extractConfig(body as Record<string, unknown>)

  return NextResponse.json(
    {
      success: true,
      message: 'Contact configuration updated successfully.',
      data: store,
      _persistence: 'in-memory — resets on server restart',
    },
    { status: 200 }
  )
}

// ---------------------------------------------------------------------------
// PATCH /api/admin/contacts
// Partial update — merges the provided fields into the current store.
// Mirrors the pattern from app/api/admin/pricing/route.ts for consistency.
// Available for future tools or integrations; the current admin UI uses POST.
// ---------------------------------------------------------------------------

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Request body must be a JSON object.' },
      { status: 400 }
    )
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { success: false, error: 'Request body must be a JSON object.' },
      { status: 400 }
    )
  }

  // Merge partial update into the current store, then validate the result.
  const merged: Record<string, unknown> = {
    ...store,
    ...(body as Record<string, unknown>),
  }

  const validation = validateContactsConfig(merged)

  if (!validation.valid) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed after merge.',
        details: validation.errors,
      },
      { status: 422 }
    )
  }

  store = extractConfig(merged)

  return NextResponse.json(
    {
      success: true,
      message: 'Contact configuration partially updated.',
      data: store,
      _persistence: 'in-memory — resets on server restart',
    },
    { status: 200 }
  )
}
