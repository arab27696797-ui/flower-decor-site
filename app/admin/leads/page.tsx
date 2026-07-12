import { AdminDataTable } from '@/components/admin/admin-data-table'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'
import { AdminHelpCard } from '@/components/admin/admin-help-card'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminSectionCard } from '@/components/admin/admin-section-card'
import { AdminStatsCard } from '@/components/admin/admin-stats-card'
import { requireAdminAuth } from '@/lib/admin-auth'
import { getRecentLeads } from '@/lib/repositories'

export default async function AdminLeadsPage() {
  await requireAdminAuth()

  const leads = await getRecentLeads(100)

  const newLeadsCount = leads.filter((lead) => lead.status === 'new').length
  const paidLeadsCount = leads.filter((lead) => lead.paymentStatus === 'paid').length
  const pendingPaymentCount = leads.filter((lead) => lead.paymentStatus !== 'paid').length

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <AdminPageHeader
        eyebrow="Заявки"
        title="Лиды и обращения"
        description="Здесь видно, кто уже оставил заявку, по какому событию обратился и кто ждёт обратной связи или подтверждения оплаты."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatsCard
          label="Всего заявок"
          value={leads.length}
          hint="Все обращения, которые уже пришли с сайта."
        />
        <AdminStatsCard
          label="Новые"
          value={newLeadsCount}
          hint="Этим клиентам лучше ответить в первую очередь."
          tone="accent"
        />
        <AdminStatsCard
          label="Оплачено"
          value={paidLeadsCount}
          hint="Заявки, где уже отмечена оплата."
          tone="soft"
        />
        <AdminStatsCard
          label="Ждут оплаты"
          value={pendingPaymentCount}
          hint="Можно использовать как список для повторного контакта."
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <AdminSectionCard
          title="Последние обращения"
          description="Таблица показывает последние заявки. Для старта этого достаточно, чтобы вручную вести обработку без CRM."
        >
          <AdminDataTable
            caption="Последние заявки"
            rows={leads}
            rowKey={(lead) => lead.id}
            emptyState={
              <AdminEmptyState
                title="Заявок пока нет"
                description="Когда посетители начнут отправлять формы, здесь появится список обращений с основными деталями."
              />
            }
            columns={[
              {
                key: 'client',
                header: 'Клиент',
                render: (lead) => (
                  <div>
                    <p className="font-medium text-brand-ink">{lead.name}</p>
                    <p className="text-brand-ink/65">{lead.phone}</p>
                  </div>
                ),
              },
              {
                key: 'event',
                header: 'Событие',
                render: (lead) => (
                  <div>
                    <p>{lead.eventType}</p>
                    <p className="text-brand-ink/65">
                      {new Date(lead.desiredDate).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Статус',
                render: (lead) => (
                  <div>
                    <p>{lead.status}</p>
                    <p className="text-brand-ink/65">Оплата: {lead.paymentStatus}</p>
                  </div>
                ),
              },
              {
                key: 'source',
                header: 'Источник',
                render: (lead) => (
                  <div>
                    <p>{lead.utmSource ?? 'Без метки'}</p>
                    <p className="text-brand-ink/65">{lead.deviceType}</p>
                  </div>
                ),
              },
              {
                key: 'created',
                header: 'Создано',
                render: (lead) => (
                  <span>{new Date(lead.createdAt).toLocaleString('ru-RU')}</span>
                ),
              },
            ]}
          />
        </AdminSectionCard>

        <AdminHelpCard
          title="Как работать с этим разделом"
          description="Сначала проверяйте новые заявки, потом отмечайте оплату и только после этого переносите клиента в дальнейшую работу. Так проще не терять людей на старте, пока процессы ещё ручные."
        >
          <div className="rounded-card border border-brand-ink/10 bg-white/70 px-4 py-3 text-sm leading-6 text-brand-ink/75">
            Если заявок станет много, следующим шагом можно добавить фильтры, быстрые статусы и экспорт.
          </div>
        </AdminHelpCard>
      </div>
    </div>
  )
}
