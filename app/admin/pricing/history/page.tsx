import { AdminDataTable } from '@/components/admin/admin-data-table'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'
import { AdminHelpCard } from '@/components/admin/admin-help-card'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminSectionCard } from '@/components/admin/admin-section-card'
import { AdminStatsCard } from '@/components/admin/admin-stats-card'
import { requireAdminAuth } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export default async function AdminPricingHistoryPage() {
  await requireAdminAuth()

  const history = await prisma.pricingHistory.findMany({
    orderBy: {
      changedAt: 'desc',
    },
    take: 100,
  })

  const changedByUsers = new Set(history.map((item) => item.changedBy ?? 'unknown')).size
  const todayChanges = history.filter((item) => {
    const today = new Date()
    const changedAt = new Date(item.changedAt)

    return (
      today.getFullYear() === changedAt.getFullYear() &&
      today.getMonth() === changedAt.getMonth() &&
      today.getDate() === changedAt.getDate()
    )
  }).length

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <AdminPageHeader
        eyebrow="История цен"
        title="Журнал изменений"
        description="Этот раздел помогает понять, кто и когда менял правила. Это полезно, когда цифры в калькуляторе начали отличаться от ожидаемых."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminStatsCard
          label="Записей в журнале"
          value={history.length}
          hint="Все сохранённые изменения по правилам расчёта."
          tone="accent"
        />
        <AdminStatsCard
          label="Изменений сегодня"
          value={todayChanges}
          hint="Показывает, была ли активность в текущий день."
        />
        <AdminStatsCard
          label="Кто менял"
          value={changedByUsers}
          hint="Количество уникальных авторов изменений."
          tone="soft"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <AdminSectionCard
          title="Последние изменения"
          description="Пока здесь только журнал просмотра. Позже можно добавить сравнение старого и нового значения прямо в интерфейсе."
        >
          <AdminDataTable
            caption="История изменений цен"
            rows={history}
            rowKey={(item) => item.id}
            emptyState={
              <AdminEmptyState
                title="История пока пустая"
                description="Когда в системе появятся изменения правил, они начнут записываться сюда автоматически."
              />
            }
            columns={[
              {
                key: 'ruleId',
                header: 'Правило',
                render: (item) => <span>{item.ruleId}</span>,
              },
              {
                key: 'changedBy',
                header: 'Кто изменил',
                render: (item) => <span>{item.changedBy ?? 'Не указано'}</span>,
              },
              {
                key: 'changedAt',
                header: 'Когда',
                render: (item) => (
                  <span>{new Date(item.changedAt).toLocaleString('ru-RU')}</span>
                ),
              },
            ]}
          />
        </AdminSectionCard>

        <AdminHelpCard
          title="Зачем нужен этот журнал"
          description="Если цена в калькуляторе вдруг стала неожиданной, вы быстро увидите, было ли изменение правил. Это снижает риск спорных ситуаций внутри команды."
        />
      </div>
    </div>
  )
}
