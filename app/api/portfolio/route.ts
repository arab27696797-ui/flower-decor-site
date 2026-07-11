import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const eventType = searchParams.get('eventType')

  const items = await prisma.portfolioImage.findMany({
    where: {
      isActive: true,
      ...(eventType ? { eventType } : {}),
    },
    orderBy: [
      { sortOrder: 'asc' },
      { id: 'asc' },
    ],
  })

  return NextResponse.json({
    ok: true,
    data: items,
  })
}
