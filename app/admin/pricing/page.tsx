import { AdminDataTable } from '@/components/admin/admin-data-table'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'
import { AdminHelpCard } from '@/components/admin/admin-help-card'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminSectionCard } from '@/components/admin/admin-section-card'
import { AdminStatsCard } from '@/components/admin/admin-stats-card'
import { requireAdminAuth } from '@/lib/admin-auth'
import { getActivePricingRules } from '@/lib/repositories'

export default async function AdminPricingPage() {
  await requireAdminAuth()

  const rules = await getActivePricingRules()

  const artificialRulesCount = rules.filter((rule) => rule.label.toLowerCase().includes('искус')).length
  const averageMarkup =
    rules.length > 0
      ? Math.round(rules.reduce((sum, rule) => sum + rule.markupPercent, 0) / rules.length)
      : 0
  const categoriesCount = new Set(rules.map((rule) => rule.category)).size

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <AdminPageHeader
        eyebrow="Цены"
        title="Правила расчёта"
        description="Здесь хранятся диапазоны рынка, коэффициенты и наценка. Эти данные используются в калькуляторах и помогают держать единые правила расчёта по всему сайту."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatsCard
          label="Активные правила"
          value={rules.length}
          hint="Все правила, которые сейчас участвуют в расчётах."
          tone="accent"
        />
        <AdminStatsCard
          label="Категории"
          value={categoriesCount}
          hint="Сколько направлений уже заведено в прайс-логику."
        />
        <AdminStatsCard
          label="Средняя наценка"
          value={`${averageMarkup}%`}
          hint="Средний ориентир по текущим правилам."
          tone="soft"
        />
        <AdminStatsCard
          label="Искусственные"
          value={artificialRulesCount}
          hint="Количество правил, связанных с искусственными позициями."
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <AdminSectionCard
          title="Активные правила"
          description="Для MVP таблицы достаточно: можно просматривать данные и проверять, что калькулятор опирается на правильные диапазоны и коэффициенты."
        >
          <AdminDataTable
            caption="Правила расчёта"
            rows={rules}
            rowKey={(rule) => rule.id}
            emptyState={
              <AdminEmptyState
                title="Правила пока не добавлены"
                description="Когда вы занесёте диапазоны рынка и коэффициенты, они появятся здесь и станут доступны калькуляторам."
              />
            }
            columns={[
              {
                key: 'label',
                header: 'Правило',
                render: (rule) => (
                  <div>
                    <p className="font-medium text-brand-ink">{rule.label}</p>
                    <p className="text-brand-ink/65">{rule.calcType}</p>
                  </div>
                ),
              },
              {
                key: 'category',
                header: 'Категория',
                render: (rule) => <span>{rule.category}</span>,
              },
              {
                key: 'range',
                header: 'Диапазон рынка',
                render: (rule) => (
                  <span>
                    {rule.marketLo} - {rule.marketHi}
                  </span>
                ),
              },
              {
                key: 'markup',
                header: 'Наценка',
                render: (rule) => <span>{rule.markupPercent}%</span>,
              },
              {
                key: 'coef',
                header: 'Коэффициент',
                render: (rule) => <span>{rule.artificialCoef}</span>,
              },
            ]}
          />
        </AdminSectionCard>

        <AdminHelpCard
          title="Когда менять эти значения"
          description="Обновляйте правила, когда меняются закупочные цены, сезонность или ваш подход к марже. Лучше менять их осознанно, а не вручную пересчитывать каждую заявку отдельно."
        >
          <div className="rounded-card border border-brand-ink/10 bg-white/70 px-4 py-3 text-sm leading-6 text-brand-ink/75">
            Следующий шаг для этого раздела — форма редактирования и автоматическая запись в историю изменений.
          </div>
        </AdminHelpCard>
      </div>
    </div>
  )
}
