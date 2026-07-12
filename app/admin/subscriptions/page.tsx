import { AdminDataTable } from '@/components/admin/admin-data-table'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'
import { AdminHelpCard } from '@/components/admin/admin-help-card'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminSectionCard } from '@/components/admin/admin-section-card'
import { AdminStatsCard } from '@/components/admin/admin-stats-card'
import { requireAdminAuth } from '@/lib/admin-auth'
import { getActiveSubscriptionTiers } from '@/lib/repositories'

export default async function AdminSubscriptionsPage() {
  await requireAdminAuth()

  const tiers = await getActiveSubscriptionTiers()

  const averageVisits =
    tiers.length > 0
      ? Math.round(tiers.reduce((sum, tier) => sum + tier.visitsPerMonth, 0) / tiers.length)
      : 0
  const averageMarkup =
    tiers.length > 0
      ? Math.round(tiers.reduce((sum, tier) => sum + tier.markupPercent, 0) / tiers.length)
      : 0

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <AdminPageHeader
        eyebrow="Подписки"
        title="Тарифы на обслуживание"
        description="Раздел нужен для регулярного ухода за искусственными композициями, входными зонами и другими объектами, которые требуют периодического обслуживания."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatsCard
          label="Активные тарифы"
          value={tiers.length}
          hint="Все подписочные предложения, доступные сейчас."
          tone="accent"
        />
        <AdminStatsCard
          label="Среднее число выездов"
          value={averageVisits}
          hint="Ориентир по регулярности обслуживания в месяц."
        />
        <AdminStatsCard
          label="Средняя наценка"
          value={`${averageMarkup}%`}
          hint="Показывает среднюю маржинальность текущих тарифов."
          tone="soft"
        />
        <AdminStatsCard
          label="Зон обслуживания"
          value={new Set(tiers.map((tier) => tier.zoneDescription)).size}
          hint="Сколько вариантов зон уже описано в тарифах."
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <AdminSectionCard
          title="Доступные тарифы"
          description="Здесь собраны тарифы для повторяющихся выездов и обслуживания. Это основа для будущего подписочного направления."
        >
          <AdminDataTable
            caption="Тарифы подписки"
            rows={tiers}
            rowKey={(tier) => tier.id}
            emptyState={
              <AdminEmptyState
                title="Тарифы пока не настроены"
                description="Когда вы добавите варианты обслуживания, они появятся в этой таблице и смогут использоваться на сайте."
              />
            }
            columns={[
              {
                key: 'tier',
                header: 'Тариф',
                render: (tier) => <span className="font-medium text-brand-ink">{tier.tierId}</span>,
              },
              {
                key: 'visits',
                header: 'Выезды в месяц',
                render: (tier) => <span>{tier.visitsPerMonth}</span>,
              },
              {
                key: 'cost',
                header: 'Цена за выезд',
                render: (tier) => <span>{tier.costPerVisit}</span>,
              },
              {
                key: 'markup',
                header: 'Наценка',
                render: (tier) => <span>{tier.markupPercent}%</span>,
              },
              {
                key: 'zone',
                header: 'Зона',
                render: (tier) => <span>{tier.zoneDescription}</span>,
              },
            ]}
          />
        </AdminSectionCard>

        <AdminHelpCard
          title="Для чего нужен этот блок"
          description="Подписка даёт более предсказуемую выручку и помогает не продавать каждый раз с нуля. Здесь удобно хранить понятные условия для владельца и команды."
        >
          <div className="rounded-card border border-brand-ink/10 bg-white/70 px-4 py-3 text-sm leading-6 text-brand-ink/75">
            Позже сюда можно добавить калькуляцию общей месячной стоимости и рекомендации по зоне обслуживания.
          </div>
        </AdminHelpCard>
      </div>
    </div>
  )
}
