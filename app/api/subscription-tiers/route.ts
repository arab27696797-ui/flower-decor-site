import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function GET() {
  const tiers = await prisma.subscriptionTier.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      costPerVisit: 'asc',
    },
  })

  return NextResponse.json({
    ok: true,
    data: tiers,
  })
}
