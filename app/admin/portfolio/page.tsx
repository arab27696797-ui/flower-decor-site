import { AdminDataTable } from '@/components/admin/admin-data-table'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminSectionCard } from '@/components/admin/admin-section-card'
import { requireAdminAuth } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

type PortfolioTableRow = {
  id: string
  eventType: string
  url: string
  sortOrder: number
  isActive: boolean
}

export default async function AdminPortfolioPage() {
  await requireAdminAuth()

  const images = await prisma.portfolioImage.findMany({
    orderBy: [
      { eventType: 'asc' },
      { sortOrder: 'asc' },
      { id: 'asc' },
    ],
  })

  const rows: PortfolioTableRow[] = images.map((image) => ({
    id: image.id,
    eventType: image.eventType,
    url: image.url,
    sortOrder: image.sortOrder,
    isActive: image.isActive,
  }))

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        eyebrow="Контент"
        title="Портфолио"
        description="Управляйте изображениями для сайта и презентационных материалов. Сейчас раздел подключён в безопасном read-only режиме поверх текущего data flow."
      />

      <AdminSectionCard
        title="Список изображений"
        description="Изображения отсортированы по типу события, затем по sort order. Это помогает быстро проверить актуальность выдачи перед следующим этапом CRUD."
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
  )
}
