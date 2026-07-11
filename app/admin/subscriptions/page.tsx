import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/admin-auth'

export default async function AdminSubscriptionsPage() {
  await requireAdminAuth()

  const tiers = await prisma.subscriptionTier.findMany({
    orderBy: {
      costPerVisit: 'asc',
    },
  })

  return (
    <main>
      <section>
        <h1>Admin Subscription Tiers</h1>
        <p>Total tiers: {tiers.length}</p>

        <ul>
          {tiers.map((tier) => (
            <li key={tier.id}>
              <article>
                <h2>{tier.tierId}</h2>
                <p>Visits per month: {tier.visitsPerMonth}</p>
                <p>Cost per visit: {tier.costPerVisit}</p>
                <p>Markup: {tier.markupPercent}%</p>
                <p>Zone: {tier.zoneDescription}</p>
                <p>Active: {tier.isActive ? 'yes' : 'no'}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
