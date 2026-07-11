import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/admin-auth'

export default async function AdminDashboardPage() {
  await requireAdminAuth()

  const [leadCount, portfolioCount, activeRulesCount, activeTierCount] = await Promise.all([
    prisma.lead.count(),
    prisma.portfolioImage.count({ where: { isActive: true } }),
    prisma.pricingRule.count({ where: { isActive: true } }),
    prisma.subscriptionTier.count({ where: { isActive: true } }),
  ])

  return (
    <main>
      <section>
        <h1>Admin Dashboard</h1>
        <ul>
          <li>Total leads: {leadCount}</li>
          <li>Active portfolio images: {portfolioCount}</li>
          <li>Active pricing rules: {activeRulesCount}</li>
          <li>Active subscription tiers: {activeTierCount}</li>
        </ul>
      </section>
    </main>
  )
}
