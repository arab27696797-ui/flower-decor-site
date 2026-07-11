import type {
  Lead,
  PortfolioImage,
  PricingRule,
  SubscriptionTier,
} from '@/types'

export type ApiSuccessResponse<T> = {
  ok: true
  data: T
}

export type ApiErrorResponse = {
  ok: false
  error: string
  issues?: unknown
}

export type LeadsResponse = ApiSuccessResponse<Lead[]>
export type PortfolioResponse = ApiSuccessResponse<PortfolioImage[]>
export type PricingRulesResponse = ApiSuccessResponse<PricingRule[]>
export type SubscriptionTiersResponse = ApiSuccessResponse<SubscriptionTier[]>
