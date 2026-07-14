import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/admin-auth'

export default async function AdminDashboardPage() {
  await requireAdminAuth()

  const [leadCount, activeLeadCount, portfolioCount, activePortfolioCount] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'new' } }),
    prisma.portfolioItem.count(),
    prisma.portfolioItem.count({ where: { isActive: true } }),
  ])

  return (
    <main>
      <section>
        <h1>Admin Dashboard</h1>
        <ul>
          <li>Total leads: {leadCount}</li>
          <li>New leads: {activeLeadCount}</li>
          <li>Total portfolio items: {portfolioCount}</li>
          <li>Active portfolio items: {activePortfolioCount}</li>
        </ul>
      </section>
    </main>
  )
}
