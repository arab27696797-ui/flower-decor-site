import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/admin-auth'

export default async function AdminPricingPage() {
  await requireAdminAuth()

  const rules = await prisma.pricingRule.findMany({
    orderBy: [
      { category: 'asc' },
      { marketLo: 'asc' },
      { label: 'asc' },
    ],
  })

  return (
    <main>
      <section>
        <h1>Admin Pricing Rules</h1>
        <p>Total rules: {rules.length}</p>

        <ul>
          {rules.map((rule) => (
            <li key={rule.id}>
              <article>
                <h2>{rule.label}</h2>
                <p>Calc type: {rule.calcType}</p>
                <p>Category: {rule.category}</p>
                <p>Market range: {rule.marketLo} - {rule.marketHi}</p>
                <p>Markup: {rule.markupPercent}%</p>
                <p>Artificial coef: {rule.artificialCoef}</p>
                <p>Active: {rule.isActive ? 'yes' : 'no'}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
