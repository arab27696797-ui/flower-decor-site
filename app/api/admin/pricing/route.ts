// app/api/admin/pricing/route.ts
// PRIMA Decor — Admin API: calculator pricing configuration.
//
// GET  /api/admin/pricing  → returns current pricing config
// PATCH /api/admin/pricing  → updates pricing config (partial merge)
//
// PERSISTENCE NOTE:
// The accepted architecture does not yet establish a database (no Prisma schema,
// no Supabase client, no filesystem adapter has been accepted as source of truth).
// Therefore this route uses an in-process module-level mutable object as a
// temporary store. This is intentional and isolated here ONLY.
//
// Implications:
//   - Changes survive within a single server process lifetime.
//   - On server restart (Railway deploy, cold start) the config resets to defaults.
//   - This is acceptable for the first deployment: admin can re-enter overrides.
//   - When a database layer is added (e.g. Prisma + PostgreSQL), replace the
//     two functions `readPricing()` and `writePricing()` below — the API contract
//     (request shape, response shape, HTTP verbs) stays identical.
//
// SECURITY NOTE:
// This route is not yet protected by authentication middleware.
// Before production exposure, ensure middleware.ts guards /api/admin/* routes
// behind an admin session check. The route is architecturally ready for that —
// it will work correctly once middleware is in place.

import { NextRequest, NextResponse } from 'next/server'
import {
  DEFAULT_PRICING,
  type PricingConfig,
  type CategoryPricing,
} from '@/lib/calculator-config'

// ---------------------------------------------------------------------------
// In-process mutable store
// Initialised from DEFAULT_PRICING on first import.
// Replace readPricing() / writePricing() when a real database is added.
// ---------------------------------------------------------------------------

// Deep-clone defaults so mutations never corrupt the imported constant.
let runtimePricing: PricingConfig = structuredClone(DEFAULT_PRICING)

/**
 * Read the current pricing configuration.
 * Swap this implementation for a DB read when persistence is added.
 */
function readPricing(): PricingConfig {
  return runtimePricing
}

/**
 * Write a new pricing configuration.
 * Swap this implementation for a DB write when persistence is added.
 */
function writePricing(updated: PricingConfig): void {
  runtimePricing = updated
}

// ---------------------------------------------------------------------------
// Validation helpers
// We use manual structural validation instead of zod here to avoid importing
// a heavy schema for a small admin endpoint. The shape mirrors PricingConfig
// from lib/calculator-config.ts.
// ---------------------------------------------------------------------------

/** Returns true if value is a finite positive number. */
function isPositiveNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0
}

/**
 * Recursively validates that all leaf values in a pricing section object
 * are non-negative finite numbers. Returns an array of invalid field paths.
 */
function collectInvalidFields(
  obj: Record<string, unknown>,
  prefix = ''
): string[] {
  const invalid: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Nested object — recurse
      invalid.push(
        ...collectInvalidFields(value as Record<string, unknown>, path)
      )
    } else if (!isPositiveNumber(value)) {
      invalid.push(path)
    }
  }

  return invalid
}

/**
 * Validates a partial PricingConfig patch.
 * Only validates keys that are present in the patch (partial PATCH semantics).
 * Returns { valid: true } or { valid: false, errors: string[] }.
 */
function validatePricingPatch(
  patch: unknown
): { valid: true } | { valid: false; errors: string[] } {
  if (patch === null || typeof patch !== 'object' || Array.isArray(patch)) {
    return { valid: false, errors: ['Request body must be a JSON object.'] }
  }

  const record = patch as Record<string, unknown>

  // Allowed top-level keys — must match PricingConfig shape from calculator-config.ts
  const allowedKeys: Array<keyof PricingConfig> = [
    'floral',
    'balloons',
    'bouquet',
    'event',
    'markupMultiplier',
  ]

  const unknownKeys = Object.keys(record).filter(
    (k) => !allowedKeys.includes(k as keyof PricingConfig)
  )

  if (unknownKeys.length > 0) {
    return {
      valid: false,
      errors: [`Unknown fields: ${unknownKeys.join(', ')}`],
    }
  }

  const errors: string[] = []

  // Validate markupMultiplier if present
  if ('markupMultiplier' in record) {
    const m = record.markupMultiplier
    if (
      typeof m !== 'number' ||
      !Number.isFinite(m) ||
      m < 1 ||
      m > 5
    ) {
      errors.push(
        'markupMultiplier must be a number between 1.0 and 5.0 (e.g. 1.3 = 30% markup).'
      )
    }
  }

  // Validate each pricing category if present
  const categoryKeys: Array<keyof Omit<PricingConfig, 'markupMultiplier'>> = [
    'floral',
    'balloons',
    'bouquet',
    'event',
  ]

  for (const categoryKey of categoryKeys) {
    if (categoryKey in record) {
      const category = record[categoryKey]

      if (
        category === null ||
        typeof category !== 'object' ||
        Array.isArray(category)
      ) {
        errors.push(`${categoryKey} must be an object.`)
        continue
      }

      const invalid = collectInvalidFields(
        category as Record<string, unknown>,
        categoryKey
      )

      errors.push(...invalid.map((f) => `${f}: must be a non-negative number.`))
    }
  }

  return errors.length > 0 ? { valid: false, errors } : { valid: true }
}

// ---------------------------------------------------------------------------
// Deep merge utility
// Merges patch into base without replacing entire nested objects.
// This allows PATCH requests to update a single sub-field.
// ---------------------------------------------------------------------------

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  patch: Partial<T>
): T {
  const result: Record<string, unknown> = { ...base }

  for (const [key, value] of Object.entries(patch)) {
    const baseValue = result[key]

    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      baseValue !== null &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue)
    ) {
      // Both sides are plain objects — recurse
      result[key] = deepMerge(
        baseValue as Record<string, unknown>,
        value as Record<string, unknown>
      )
    } else {
      result[key] = value
    }
  }

  return result as T
}

// ---------------------------------------------------------------------------
// GET /api/admin/pricing
// Returns the full current pricing configuration as JSON.
// ---------------------------------------------------------------------------

export async function GET(): Promise<NextResponse> {
  try {
    const pricing = readPricing()

    return NextResponse.json(
      {
        success: true,
        data: pricing,
        meta: {
          note: 'Prices are stored in server memory. Deploy a database to persist changes across restarts.',
          markupMultiplierNote:
            'markupMultiplier of 1.3 = 30% markup applied to all calculator totals.',
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[admin/pricing] GET error:', error)

    return NextResponse.json(
      { success: false, error: 'Failed to read pricing configuration.' },
      { status: 500 }
    )
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/admin/pricing
// Accepts a partial PricingConfig — deep-merges into current config.
// Only provided fields are updated; unprovided fields remain unchanged.
//
// Example body (update only floral base prices):
// {
//   "floral": {
//     "baseByScale": { "small": 15000, "medium": 30000 }
//   }
// }
//
// Example body (update markup only):
// { "markupMultiplier": 1.35 }
// ---------------------------------------------------------------------------

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse body
    let body: unknown

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Request body must be valid JSON.' },
        { status: 400 }
      )
    }

    // Validate patch shape
    const validation = validatePricingPatch(body)

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

    // Apply deep merge
    const current = readPricing()
    const patch = body as Partial<PricingConfig>
    const updated = deepMerge(current, patch)

    writePricing(updated)

    return NextResponse.json(
      {
        success: true,
        data: updated,
        message: 'Pricing configuration updated successfully.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[admin/pricing] PATCH error:', error)

    return NextResponse.json(
      { success: false, error: 'Failed to update pricing configuration.' },
      { status: 500 }
    )
  }
}
