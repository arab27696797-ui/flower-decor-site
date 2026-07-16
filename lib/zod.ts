// lib/zod.ts
// Shared zod validation schemas for PRIMA Decor.
// v2 schemas added for the new EstimateCart-based lead payload.
// All original schemas are preserved for backward compatibility
// with any existing API routes and admin endpoints that still reference them.

import { z } from 'zod'

// ---------------------------------------------------------------------------
// ORIGINAL SCHEMAS — preserved as-is for backward compatibility
// ---------------------------------------------------------------------------

/** @deprecated Use cartItemV2Schema + estimateCartSchema instead. */
export const cartItemSchema = z.object({
  id:           z.string().min(1),
  productId:    z.string().min(1),
  label:        z.string().min(1),
  calcType:     z.string().min(1),
  category:     z.string().min(1),
  quantity:     z.number().int().positive(),
  unitPrice:    z.number().int().nonnegative(),
  isArtificial: z.boolean(),
  meta:         z.record(z.unknown()).optional(),
})

/**
 * @deprecated Use createLeadV2Schema instead.
 * Kept for any existing admin/reporting code that may still use the old shape.
 */
export const createLeadSchema = z.object({
  name:         z.string().min(2).max(100),
  phone:        z.string().min(5).max(30),
  eventType:    z.string().min(2).max(100),
  desiredDate:  z.coerce.date(),
  comment:      z.string().max(2000).optional().nullable(),
  cartItems:    z.array(cartItemSchema).min(1),
  utmSource:    z.string().max(255).optional().nullable(),
  utmMedium:    z.string().max(255).optional().nullable(),
  utmCampaign:  z.string().max(255).optional().nullable(),
  utmTerm:      z.string().max(255).optional().nullable(),
  utmContent:   z.string().max(255).optional().nullable(),
  referrerPage: z.string().max(2048).optional().nullable(),
  deviceType:   z.string().min(2).max(50),
})

export const createPortfolioImageSchema = z.object({
  url:       z.string().url().max(2048),
  eventType: z.string().min(2).max(100),
  sortOrder: z.number().int().min(0),
  isActive:  z.boolean().default(true),
})

export const updatePortfolioImageSchema = z.object({
  id:        z.string().min(1),
  url:       z.string().url().max(2048),
  eventType: z.string().min(2).max(100),
  sortOrder: z.number().int().min(0),
  isActive:  z.boolean(),
})

// ---------------------------------------------------------------------------
// V2 SCHEMAS — EstimateCart-based lead payload
// Aligned with:
//   - lib/calculator-config.ts  (CategorySelection, CartItem, EstimateCart)
//   - components/site/lead-form.tsx  (LeadRequestPayload)
//   - app/api/leads/route.ts
// ---------------------------------------------------------------------------

/**
 * Mirrors CategorySelection from lib/calculator-config.ts.
 * selectedValue is polymorphic — string for select fields, boolean for toggles.
 * Validated loosely so the schema remains stable when calculator config
 * adds new field types in the future.
 */
export const categorySelectionSchema = z.object({
  fieldId:         z.string().min(1),
  labelRu:         z.string(),
  labelEn:         z.string(),
  selectedValue:   z.union([z.string(), z.boolean(), z.number()]),
  selectedLabelRu: z.string(),
  selectedLabelEn: z.string(),
})

/**
 * Mirrors CartItem from lib/calculator-config.ts.
 * id is the deterministic category key, e.g. "category-floral".
 */
export const cartItemV2Schema = z.object({
  id:                 z.string().min(1),
  categoryId:         z.string().min(1),
  categoryLabelRu:    z.string(),
  // Optional in lib/calculator-config.ts CartItem — buildCartItem() in
  // calculator-cart.ts does not set it, so the key may be absent at runtime.
  // Strict z.string() here caused VALIDATION_ERROR (400) for every lead
  // submitted with a calculator estimate attached.
  categoryLabelEn:    z.string().optional().default(''),
  selections:         z.array(categorySelectionSchema),
  // Optional in CartItem — the store keeps subtotalBeforeMarkup instead.
  basePrice:          z.number().nonnegative().optional().default(0),
  subtotalWithMarkup: z.number().nonnegative(),
})

/**
 * Mirrors EstimateCart from lib/calculator-config.ts.
 * items may be empty — this is valid when submitted as a contact-only request.
 */
export const estimateCartSchema = z.object({
  items:             z.array(cartItemV2Schema),
  totalBeforeMarkup: z.number().nonnegative(),
  totalWithMarkup:   z.number().nonnegative(),
  markupCoefficient: z.number().positive().default(1.3),
})

/**
 * Primary lead submission schema for the new multi-accumulative calculator flow.
 * Replaces createLeadSchema for all new route handlers.
 *
 * Key differences from createLeadSchema:
 *  - location replaces eventType (business requirement: where is the decoration needed)
 *  - estimateCart replaces cartItems (full structured cart vs. flat legacy array)
 *  - desiredDate is removed (client collects this in the comment / manually)
 *  - UTM fields moved to optional for cleaner client payload; can be re-added
 *    server-side from request headers/cookies in the route handler
 */
export const createLeadV2Schema = z.object({
  name:         z.string().min(2, 'name_too_short').max(100, 'name_too_long'),
  phone:        z.string().min(5, 'phone_too_short').max(30, 'phone_too_long'),
  location:     z.string().min(3, 'location_too_short').max(300, 'location_too_long'),
  comment:      z.string().max(2000, 'comment_too_long').optional().nullable(),
  estimateCart: estimateCartSchema.nullable(),
  deviceType:   z.string().min(2).max(50).optional().default('unknown'),
})

// ---------------------------------------------------------------------------
// Inferred TypeScript types — export everything for reuse in route handlers
// ---------------------------------------------------------------------------

/** @deprecated */
export type CartItemInput = z.infer<typeof cartItemSchema>

/** @deprecated */
export type CreateLeadInput = z.infer<typeof createLeadSchema>

export type CategorySelectionInput = z.infer<typeof categorySelectionSchema>
export type CartItemV2Input        = z.infer<typeof cartItemV2Schema>
export type EstimateCartInput      = z.infer<typeof estimateCartSchema>
export type CreateLeadV2Input      = z.infer<typeof createLeadV2Schema>

export type CreatePortfolioImageInput = z.infer<typeof createPortfolioImageSchema>
export type UpdatePortfolioImageInput = z.infer<typeof updatePortfolioImageSchema>
