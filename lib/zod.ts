import { z } from 'zod'

export const cartItemSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  label: z.string().min(1),
  calcType: z.string().min(1),
  category: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().int().nonnegative(),
  isArtificial: z.boolean(),
  meta: z.record(z.unknown()).optional(),
})

export const createLeadSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(5).max(30),
  eventType: z.string().min(2).max(100),
  desiredDate: z.coerce.date(),
  comment: z.string().max(2000).optional().nullable(),
  cartItems: z.array(cartItemSchema).min(1),
  utmSource: z.string().max(255).optional().nullable(),
  utmMedium: z.string().max(255).optional().nullable(),
  utmCampaign: z.string().max(255).optional().nullable(),
  utmTerm: z.string().max(255).optional().nullable(),
  utmContent: z.string().max(255).optional().nullable(),
  referrerPage: z.string().max(2048).optional().nullable(),
  deviceType: z.string().min(2).max(50),
})

export const createPortfolioImageSchema = z.object({
  url: z.string().url().max(2048),
  eventType: z.string().min(2).max(100),
  sortOrder: z.number().int().min(0),
  isActive: z.boolean().default(true),
})

export const updatePortfolioImageSchema = z.object({
  id: z.string().min(1),
  url: z.string().url().max(2048),
  eventType: z.string().min(2).max(100),
  sortOrder: z.number().int().min(0),
  isActive: z.boolean(),
})

export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type CreatePortfolioImageInput = z.infer<typeof createPortfolioImageSchema>
export type UpdatePortfolioImageInput = z.infer<typeof updatePortfolioImageSchema>
