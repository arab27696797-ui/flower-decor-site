import { prisma } from '@/lib/prisma'

export async function getActivePortfolioImages(eventType?: string) {
  return prisma.portfolioImage.findMany({
    where: {
      isActive: true,
      ...(eventType ? { eventType } : {}),
    },
    orderBy: [
      { sortOrder: 'asc' },
      { id: 'asc' },
    ],
  })
}

export async function getActiveSubscriptionTiers() {
  return prisma.subscriptionTier.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      costPerVisit: 'asc',
    },
  })
}

export async function getActivePricingRules(filters?: {
  calcType?: string
  category?: string
}) {
  return prisma.pricingRule.findMany({
    where: {
      isActive: true,
      ...(filters?.calcType ? { calcType: filters.calcType } : {}),
      ...(filters?.category ? { category: filters.category } : {}),
    },
    orderBy: [
      { category: 'asc' },
      { marketLo: 'asc' },
      { label: 'asc' },
    ],
  })
}

export async function getRecentLeads(limit = 50) {
  return prisma.lead.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })
}
