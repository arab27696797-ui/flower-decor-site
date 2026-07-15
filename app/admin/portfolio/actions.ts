'use server'

import { revalidatePath } from 'next/cache'

import { requireAdminAuth } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export type PortfolioActionResult =
  | { ok: false; error: string }
  | { ok: true; error?: undefined }

export async function createPortfolioItemAction(
  formData: FormData,
): Promise<PortfolioActionResult> {
  await requireAdminAuth()

  const imageUrl = String(formData.get('imageUrl') ?? '').trim()
  const category = String(formData.get('category') ?? '').trim()
  const captionRu = String(formData.get('captionRu') ?? '').trim()
  const captionEn = String(formData.get('captionEn') ?? '').trim()
  const sortOrder = Number(formData.get('sortOrder') ?? 0)
  const isActive = formData.get('isActive') === 'true'

  if (!imageUrl || !category || !captionRu || Number.isNaN(sortOrder)) {
    return {
      ok: false,
      error: 'Проверьте ссылку, категорию, подпись и порядок сортировки.',
    }
  }

  await prisma.portfolioItem.create({
    data: {
      imageUrl,
      videoUrl: null,
      category,
      captionRu,
      captionEn: captionEn || captionRu,
      sortOrder,
      isActive,
    },
  })

  revalidatePath('/admin/portfolio')
  revalidatePath('/')

  return { ok: true }
}

export async function updatePortfolioItemAction(
  formData: FormData,
): Promise<PortfolioActionResult> {
  await requireAdminAuth()

  const id = String(formData.get('id') ?? '').trim()
  const imageUrl = String(formData.get('imageUrl') ?? '').trim()
  const category = String(formData.get('category') ?? '').trim()
  const captionRu = String(formData.get('captionRu') ?? '').trim()
  const captionEn = String(formData.get('captionEn') ?? '').trim()
  const sortOrder = Number(formData.get('sortOrder') ?? 0)
  const isActive = formData.get('isActive') === 'true'

  if (!id || !imageUrl || !category || !captionRu || Number.isNaN(sortOrder)) {
    return {
      ok: false,
      error: 'Не удалось обновить запись. Проверьте поля формы.',
    }
  }

  await prisma.portfolioItem.update({
    where: { id },
    data: {
      imageUrl,
      category,
      captionRu,
      captionEn: captionEn || captionRu,
      sortOrder,
      isActive,
    },
  })

  revalidatePath('/admin/portfolio')
  revalidatePath('/')

  return { ok: true }
}
