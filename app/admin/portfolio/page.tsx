import { revalidatePath } from 'next/cache'

import { AdminDataTable } from '@/components/admin/admin-data-table'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'
import { AdminHelpCard } from '@/components/admin/admin-help-card'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminSectionCard } from '@/components/admin/admin-section-card'
import { requireAdminAuth } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import {
  createPortfolioImageSchema,
  updatePortfolioImageSchema,
} from '@/lib/zod'

type PortfolioTableRow = {
  id: string
  eventType: string
  url: string
  sortOrder: number
  isActive: boolean
}

async function createPortfolioImageAction(formData: FormData) {
  'use server'

  await requireAdminAuth()

  const parsed = createPortfolioImageSchema.safeParse({
    url: formData.get('url'),
    eventType: formData.get('eventType'),
    sortOrder: Number(formData.get('sortOrder')),
    isActive: formData.get('isActive') === 'true',
  })

  if (!parsed.success) {
    return {
      ok: false as const,
      error: 'Проверьте ссылку, тип события и порядок сортировки.',
    }
  }

  await prisma.portfolioImage.create({
    data: {
      url: parsed.data.url,
      eventType: parsed.data.eventType,
      sortOrder: parsed.data.sortOrder,
      isActive: parsed.data.isActive,
    },
  })

  revalidatePath('/admin/portfolio')
  revalidatePath('/')

  return {
    ok: true as const,
  }
}

async function updatePortfolioImageAction(formData: FormData) {
  'use server'

  await requireAdminAuth()

  const parsed = updatePortfolioImageSchema.safeParse({
    id: formData.get('id'),
    url: formData.get('url'),
    eventType: formData.get('eventType'),
    sortOrder: Number(formData.get('sortOrder')),
    isActive: formData.get('isActive') === 'true',
  })

  if (!parsed.success) {
    return {
      ok: false as const,
      error: 'Не удалось обновить запись. Проверьте поля формы.',
    }
  }

  await prisma.portfolioImage.update({
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

  revalidatePath('/admin/portfolio')
  revalidatePath('/')

  return {
    ok: true as const,
  }
}

export default async function AdminPortfolioPage() {
  await requireAdminAuth()

  const images = await prisma.portfolioImage.findMany({
    orderBy: [{ eventType: 'asc' }, { sortOrder: 'asc' }, { id: 'asc' }],
  })

  const rows: PortfolioTableRow[] = images.map((image) => ({
    id: image.id,
    eventType: image.eventType,
    url: image.url,
    sortOrder: image.sortOrder,
    isActive: image.isActive,
  }))

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <AdminPageHeader
        eyebrow="Контент"
        title="Портфолио"
        description="Управляйте изображениями для сайта и презентационных материалов. В этом разделе уже можно добавлять и редактировать записи без смены общей архитектуры."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <div className="flex flex-col gap-6">
          <AdminSectionCard
            title="Добавить изображение"
            description="Новая запись сразу попадёт в административный список. Публичный API по-прежнему отдаёт только активные изображения."
          >
            <form action={createPortfolioImageAction} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="url" className="text-sm font-medium leading-6 text-brand-ink">
                  Ссылка на изображение
                </label>
                <input
                  id="url"
                  name="url"
                  type="url"
                  required
                  placeholder="https://example.com/portfolio-image.jpg"
                  className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-4 py-3 text-sm text-brand-ink shadow-sm transition-colors duration-200 placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>

              <div>
                <label htmlFor="eventType" className="text-sm font-medium leading-6 text-brand-ink">
                  Тип события
                </label>
                <input
                  id="eventType"
                  name="eventType"
                  type="text"
                  required
                  placeholder="Свадьба"
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
                  Добавить изображение
                </button>
                <p className="text-sm leading-6 text-brand-ink/65">
                  После сохранения страница обновится, и новая запись появится в таблице.
                </p>
              </div>
            </form>
          </AdminSectionCard>

          <AdminSectionCard
            title="Редактирование записей"
            description="Здесь можно обновить ссылку, тип события, порядок сортировки и видимость каждой записи."
          >
            {rows.length === 0 ? (
              <AdminEmptyState
                title="Портфолио пока пустое"
                description="Сначала добавьте хотя бы одно изображение, чтобы появились формы редактирования."
                tone="soft"
              />
            ) : (
              <div className="flex flex-col gap-4">
                {rows.map((row) => (
                  <form
                    key={row.id}
                    action={updatePortfolioImageAction}
                    className="rounded-card border border-brand-ink/10 bg-white/80 p-4 shadow-sm"
                  >
                    <input type="hidden" name="id" value={row.id} />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label
                          htmlFor={`url-${row.id}`}
                          className="text-sm font-medium leading-6 text-brand-ink"
                        >
                          Ссылка на изображение
                        </label>
                        <input
                          id={`url-${row.id}`}
                          name="url"
                          type="url"
                          defaultValue={row.url}
                          required
                          className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-4 py-3 text-sm text-brand-ink shadow-sm transition-colors duration-200 placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`eventType-${row.id}`}
                          className="text-sm font-medium leading-6 text-brand-ink"
                        >
                          Тип события
                        </label>
                        <input
                          id={`eventType-${row.id}`}
                          name="eventType"
                          type="text"
                          defaultValue={row.eventType}
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
            description="Таблица помогает быстро проверить итоговый порядок и публичный статус изображений."
          >
            <AdminDataTable
              caption="Portfolio images"
              rows={rows}
              rowKey={(row) => row.id}
              emptyState={
                <AdminEmptyState
                  title="Портфолио пока пустое"
                  description="Когда в базе появятся изображения, здесь отобразится таблица с типом события, ссылкой, порядком сортировки и статусом активности."
                  tone="soft"
                />
              }
              columns={[
                {
                  key: 'eventType',
                  header: 'Тип события',
                  render: (row) => (
                    <div className="min-w-[160px]">
                      <p className="font-medium text-brand-ink">{row.eventType}</p>
                      <p className="mt-1 text-xs leading-5 text-brand-ink/60">{row.id}</p>
                    </div>
                  ),
                },
                {
                  key: 'url',
                  header: 'Изображение',
                  className: 'min-w-[260px]',
                  render: (row) => (
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-sm font-medium text-brand-forest underline decoration-brand-gold/60 underline-offset-4 transition-colors duration-200 hover:text-brand-ink"
                    >
                      {row.url}
                    </a>
                  ),
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
          description="Сначала добавь базовые изображения по ключевым типам событий, затем отредактируй порядок сортировки и статус. Этого уже достаточно для рабочего MVP-контента."
        >
          <div className="rounded-card border border-brand-ink/10 bg-white/70 px-4 py-3 text-sm leading-6 text-brand-ink/75">
            Следующим шагом сюда можно добавить удаление записей и превью изображений без перестройки страницы.
          </div>
        </AdminHelpCard>
      </div>
    </div>
  )
}
