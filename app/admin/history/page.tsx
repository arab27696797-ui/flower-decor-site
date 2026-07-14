import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/admin-auth'

export default async function AdminPricingHistoryPage() {
  await requireAdminAuth()

  const history = await prisma.pricingHistory.findMany({
    orderBy: {
      changedAt: 'desc',
    },
  })

  return (
    <main>
      <section>
        <h1>Admin Pricing History</h1>
        <p>Total changes: {history.length}</p>

        <ul>
          {history.map((item) => (
            <li key={item.id}>
              <article>
                <h2>Change ID: {item.id}</h2>
                <p>Changed by: {item.changedBy ?? 'unknown'}</p>
                <p>Changed at: {item.changedAt.toISOString()}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
