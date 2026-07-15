import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') ?? searchParams.get('eventType')

  const items = await prisma.portfolioItem.findMany({
    where: {
      isActive: true,
      ...(category ? { category } : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  })

  return NextResponse.json({
    ok: true,
    data: items,
  })
}
