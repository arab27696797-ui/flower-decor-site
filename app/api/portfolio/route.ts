import { NextResponse } from 'next/server'

import { isAdminAuthenticated } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import {
  createPortfolioImageSchema,
  updatePortfolioImageSchema,
} from '@/lib/zod'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const eventType = searchParams.get('eventType')

  const items = await prisma.portfolioImage.findMany({
    where: {
      isActive: true,
      ...(eventType ? { eventType } : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  })

  return NextResponse.json({
    ok: true,
    data: items,
  })
}

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated()

  if (!authenticated) {
    return NextResponse.json(
      {
        ok: false,
        error: 'UNAUTHORIZED',
      },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()

    const parsed = createPortfolioImageSchema.safeParse({
      ...body,
      sortOrder:
        typeof body?.sortOrder === 'string' ? Number(body.sortOrder) : body?.sortOrder,
      isActive:
        typeof body?.isActive === 'string'
          ? body.isActive === 'true'
          : body?.isActive,
    })

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'VALIDATION_ERROR',
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      )
    }

    const image = await prisma.portfolioImage.create({
      data: {
        url: parsed.data.url,
        eventType: parsed.data.eventType,
        sortOrder: parsed.data.sortOrder,
        isActive: parsed.data.isActive,
      },
    })

    return NextResponse.json({
      ok: true,
      data: image,
    })
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  const authenticated = await isAdminAuthenticated()

  if (!authenticated) {
    return NextResponse.json(
      {
        ok: false,
        error: 'UNAUTHORIZED',
      },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()

    const parsed = updatePortfolioImageSchema.safeParse({
      ...body,
      sortOrder:
        typeof body?.sortOrder === 'string' ? Number(body.sortOrder) : body?.sortOrder,
      isActive:
        typeof body?.isActive === 'string'
          ? body.isActive === 'true'
          : body?.isActive,
    })

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'VALIDATION_ERROR',
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      )
    }

    const image = await prisma.portfolioImage.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        url: parsed.data.url,
        eventType: parsed.data.eventType,
        sortOrder: parsed.data.sortOrder,
        isActive: parsed.data.isActive,
      },
    })

    return NextResponse.json({
      ok: true,
      data: image,
    })
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    )
  }
}
