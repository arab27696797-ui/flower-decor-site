import { prisma } from '@/lib/prisma'

export async function getActivePortfolioItems(category?: string) {
  return prisma.portfolioItem.findMany({
    where: {
      isActive: true,
      ...(category ? { category } : {}),
    },
    orderBy: [
      { sortOrder: 'asc' },
      { id: 'asc' },
    ],
  })
}

export type SubscriptionTierRow = {
  id: string
  tierId: string
  visitsPerMonth: number
  costPerVisit: number
  markupPercent: number
  zoneDescription: string
}

export async function getActiveSubscriptionTiers(): Promise<SubscriptionTierRow[]> {
  return []
}

export async function getRecentLeads(limit = 50) {
  return prisma.lead.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })
}
