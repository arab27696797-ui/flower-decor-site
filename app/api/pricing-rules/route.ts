import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const calcType = searchParams.get('calcType')
  const category = searchParams.get('category')

  const rules = await prisma.pricingRule.findMany({
    where: {
      isActive: true,
      ...(calcType ? { calcType } : {}),
      ...(category ? { category } : {}),
    },
    orderBy: [
      { category: 'asc' },
      { marketLo: 'asc' },
      { label: 'asc' },
    ],
  })

  return NextResponse.json({
    ok: true,
    data: rules,
  })
}
