export type CartItem = {
  id: string
  productId: string
  label: string
  calcType: string
  category: string
  quantity: number
  unitPrice: number
  isArtificial: boolean
  meta?: Record<string, unknown>
}

export type Lead = {
  id: string
  name: string
  phone: string
  eventType: string
  desiredDate: Date
  comment?: string | null
  cartItems: unknown
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  utmTerm?: string | null
  utmContent?: string | null
  referrerPage?: string | null
  deviceType: string
  status: string
  paymentStatus: string
  paidAmount?: number | null
  createdAt: Date
}

export type PricingRule = {
  id: string
  calcType: string
  category: string
  label: string
  marketLo: number
  marketHi: number
  markupPercent: number
  artificialCoef: number
  isActive: boolean
  updatedAt: Date
  updatedBy?: string | null
}

export type SubscriptionTier = {
  id: string
  tierId: string
  visitsPerMonth: number
  costPerVisit: number
  markupPercent: number
  zoneDescription: string
  isActive: boolean
}

export type PricingHistory = {
  id: string
  ruleId: string
  oldValue: unknown
  newValue: unknown
  changedBy?: string | null
  changedAt: Date
}

export type PortfolioImage = {
  id: string
  url: string
  eventType: string
  sortOrder: number
  isActive: boolean
}
