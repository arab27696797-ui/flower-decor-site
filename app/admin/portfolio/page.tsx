import { revalidatePath } from 'next/cache'

import { AdminDataTable } from '@/components/admin/admin-data-table'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'
import { AdminHelpCard } from '@/components/admin/admin-help-card'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminSectionCard } from '@/components/admin/admin-section-card'
import { requireAdminAuth } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

type PortfolioTableRow = {
  id: string
  category: string
  imageUrl: string
  captionRu: string
  sortOrder: number
  isActive: boolean
}

async function createPortfolioItemAction(formData: FormData) {
  'use server'

  await requireAdminAuth()

  const imageUrl = String(formData.get('imageUrl') ?? '').trim()
  const category = String(formData.get('category') ?? '').trim()
  const captionRu = String(formData.get('captionRu') ?? '').trim()
  const captionEn = String(formData.get('captionEn') ?? '').trim()
  const sortOrder = Number(formData.get('sortOrder') ?? 0)
  const isActive = formData.get('isActive') === 'true'

  if (!imageUrl || !category || !captionRu || Number.isNaN(sortOrder)) {
    return {
      ok: false as const,
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

  return {
    ok: true as const,
  }
}

async function updatePortfolioItemAction(formData: FormData) {
  'use server'

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
      ok: false as const,
      error: 'Не удалось обновить запись. Проверьте поля формы.',
    }
  }

  await prisma.portfolioItem.update({
    where: {
      id,
    },
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

  return {
    ok: true as const,
  }
}

export default async function AdminPortfolioPage() {
  await requireAdminAuth()

  const items = await prisma.portfolioItem.findMany({
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { id: 'asc' }],
  })

  const rows: PortfolioTableRow[] = items.map((item) => ({
    id: item.id,
    category: item.category,
    imageUrl: item.imageUrl,
    captionRu: item.captionRu,
    sortOrder: item.sortOrder,
    isActive: item.isActive,
  }))

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <AdminPageHeader
        eyebrow="Контент"
        title="Портфолио"
        description="Управляйте изображениями для сайта и презентационных материалов. Раздел приведён в соответствие с текущей схемой базы данных."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <div className="flex flex-col gap-6">
          <AdminSectionCard
            title="Добавить элемент портфолио"
            description="Новая запись сразу попадёт в административный список. На сайт выводятся только активные элементы."
          >
            <form action={createPortfolioItemAction} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="imageUrl" className="text-sm font-medium leading-6 text-brand-ink">
                  Ссылка на изображение
                </label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  required
                  placeholder="https://example.com/portfolio-image.jpg"
                  className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-4 py-3 text-sm text-brand-ink shadow-sm transition-colors duration-200 placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>

              <div>
                <label htmlFor="category" className="text-sm font-medium leading-6 text-brand-ink">
                  Категория
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  required
                  placeholder="wedding"
                  className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-4 py-3 text-sm text-brand-ink shadow-sm transition-colors duration-200 placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>

              <div>
                <label htmlFor="sortOrder" className="text-sm font-medium leading-6 text-brand-ink">
                  Порядок сортировки
                </label>
                <input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  min={0}
                  defaultValue={0}
                  required
                  className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-4 py-3 text-sm text-brand-ink shadow-sm transition-colors duration-200 placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="captionRu" className="text-sm font-medium leading-6 text-brand-ink">
                  Подпись RU
                </label>
                <input
                  id="captionRu"
                  name="captionRu"
                  type="text"
                  required
                  placeholder="Свадебное оформление"
                  className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-4 py-3 text-sm text-brand-ink shadow-sm transition-colors duration-200 placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="captionEn" className="text-sm font-medium leading-6 text-brand-ink">
                  Подпись EN
                </label>
                <input
                  id="captionEn"
                  name="captionEn"
                  type="text"
                  placeholder="Wedding decor"
                  className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-4 py-3 text-sm text-brand-ink shadow-sm transition-colors duration-200 placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="isActive" className="text-sm font-medium leading-6 text-brand-ink">
                  Статус
                </label>
                <select
                  id="isActive"
                  name="isActive"
                  defaultValue="true"
                  className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-4 py-3 text-sm text-brand-ink shadow-sm transition-colors duration-200 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                >
                  <option value="true">Активно</option>
                  <option value="false">Скрыто</option>
                </select>
              </div>

              <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center rounded-card bg-brand-forest px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-forest/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream"
                >
                  Добавить элемент
                </button>
                <p className="text-sm leading-6 text-brand-ink/65">
                  После сохранения страница обновится, и новая запись появится в таблице.
                </p>
              </div>
            </form>
          </AdminSectionCard>

          <AdminSectionCard
            title="Редактирование записей"
            description="Здесь можно обновить ссылку, категорию, подписи, порядок сортировки и видимость каждой записи."
          >
            {rows.length === 0 ? (
              <AdminEmptyState
                title="Портфолио пока пустое"
                description="Сначала добавьте хотя бы один элемент, чтобы появились формы редактирования."
                tone="soft"
              />
            ) : (
              <div className="flex flex-col gap-4">
                {rows.map((row) => (
                  <form
                    key={row.id}
                    action={updatePortfolioItemAction}
                    className="rounded-card border border-brand-ink/10 bg-white/80 p-4 shadow-sm"
                  >
                    <input type="hidden" name="id" value={row.id} />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label
                          htmlFor={`imageUrl-${row.id}`}
                          className="text-sm font-medium leading-6 text-brand-ink"
                        >
                          Ссылка на изображение
                        </label>
                        <input
                          id={`imageUrl-${row.id}`}
                          name="imageUrl"
                          type="url"
                          defaultValue={row.imageUrl}
                          required
                          className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-4 py-3 text-sm text-brand-ink shadow-sm transition-colors duration-200 placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`category-${row.id}`}
                          className="text-sm font-medium leading-6 text-brand-ink"
                        >
                          Категория
                        </label>
                        <input
                          id={`category-${row.id}`}
                          name="category"
                          type="text"
                          defaultValue={row.category}
                          required
                          className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-4 py-3 text-sm text-brand-ink shadow-sm transition-colors duration-200 placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`sortOrder-${row.id}`}
                          className="text-sm font-medium leading-6 text-brand-ink"
                        >
                          Порядок сортировки
                        </label>
                        <input
                          id={`sortOrder-${row.id}`}
                          name="sortOrder"
                          type="number"
                          min={0}
                          defaultValue={row.sortOrder}
                          required
                          className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-4 py-3 text-sm text-brand-ink shadow-sm transition-colors duration-200 placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label
                          htmlFor={`captionRu-${row.id}`}
                          className="text-sm font-medium leading-6 text-brand-ink"
                        >
                          Подпись RU
                        </label>
                        <input
                          id={`captionRu-${row.id}`}
                          name="captionRu"
                          type="text"
                          defaultValue={row.captionRu}
                          required
                          className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-4 py-3 text-sm text-brand-ink shadow-sm transition-colors duration-200 placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label
                          htmlFor={`captionEn-${row.id}`}
                          className="text-sm font-medium leading-6 text-brand-ink"
                        >
                          Подпись EN
                        </label>
                        <input
                          id={`captionEn-${row.id}`}
                          name="captionEn"
                          type="text"
                          defaultValue=""
                          className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-4 py-3 text-sm text-brand-ink shadow-sm transition-colors duration-200 placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label
                          htmlFor={`isActive-${row.id}`}
                          className="text-sm font-medium leading-6 text-brand-ink"
                        >
                          Статус
                        </label>
                        <select
                          id={`isActive-${row.id}`}
                          name="isActive"
                          defaultValue={row.isActive ? 'true' : 'false'}
                          className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-4 py-3 text-sm text-brand-ink shadow-sm transition-colors duration-200 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                        >
                          <option value="true">Активно</option>
                          <option value="false">Скрыто</option>
                        </select>
                      </div>

                      <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm leading-6 text-brand-ink/60">
                          ID: {row.id}
                        </div>
                        <button
                          type="submit"
                          className="inline-flex min-h-11 items-center justify-center rounded-card border border-brand-gold/40 bg-brand-gold/10 px-5 py-3 text-sm font-semibold text-brand-ink transition-colors duration-200 hover:bg-brand-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream"
                        >
                          Сохранить изменения
                        </button>
                      </div>
                    </div>
                  </form>
                ))}
              </div>
            )}
          </AdminSectionCard>

          <AdminSectionCard
            title="Текущая таблица"
            description="Таблица помогает быстро проверить итоговый порядок и публичный статус элементов портфолио."
          >
            <AdminDataTable
              caption="Portfolio items"
              rows={rows}
              rowKey={(row) => row.id}
              emptyState={
                <AdminEmptyState
                  title="Портфолио пока пустое"
                  description="Когда в базе появятся элементы, здесь отобразится таблица с категорией, ссылкой, подписью, порядком сортировки и статусом."
                  tone="soft"
                />
              }
              columns={[
                {
                  key: 'category',
                  header: 'Категория',
                  render: (row) => (
                    <div className="min-w-[160px]">
                      <p className="font-medium text-brand-ink">{row.category}</p>
                      <p className="mt-1 text-xs leading-5 text-brand-ink/60">{row.id}</p>
                    </div>
                  ),
                },
                {
                  key: 'imageUrl',
                  header: 'Изображение',
                  className: 'min-w-[260px]',
                  render: (row) => (
                    <a
                      href={row.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-sm font-medium text-brand-forest underline decoration-brand-gold/60 underline-offset-4 transition-colors duration-200 hover:text-brand-ink"
                    >
                      {row.imageUrl}
                    </a>
                  ),
                },
                {
                  key: 'captionRu',
                  header: 'Подпись',
                  className: 'min-w-[220px]',
                  render: (row) => <span>{row.captionRu}</span>,
                },
                {
                  key: 'sortOrder',
                  header: 'Порядок',
                  className: 'w-[120px]',
                  render: (row) => <span>{row.sortOrder}</span>,
                },
                {
                  key: 'status',
                  header: 'Статус',
                  className: 'w-[140px]',
                  render: (row) => (
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        row.isActive
                          ? 'bg-brand-forest/10 text-brand-forest'
                          : 'bg-brand-blush/40 text-brand-ink'
                      }`}
                    >
                      {row.isActive ? 'Активно' : 'Скрыто'}
                    </span>
                  ),
                },
              ]}
            />
          </AdminSectionCard>
        </div>

        <AdminHelpCard
          title="Как использовать раздел"
          description="Сначала добавьте базовые изображения по ключевым категориям, затем отредактируйте порядок сортировки и статус."
        >
          <div className="rounded-card border border-brand-ink/10 bg-white/70 px-4 py-3 text-sm leading-6 text-brand-ink/75">
            Следующим шагом сюда можно добавить удаление записей и превью изображений без перестройки страницы.
          </div>
        </AdminHelpCard>
      </div>
    </div>
  )
}
