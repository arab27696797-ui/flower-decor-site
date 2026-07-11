import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/admin-auth'

export default async function AdminLeadsPage() {
  await requireAdminAuth()

  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main>
      <section>
        <h1>Admin Leads</h1>
        <p>Total leads: {leads.length}</p>

        <ul>
          {leads.map((lead) => (
            <li key={lead.id}>
              <article>
                <h2>{lead.name}</h2>
                <p>Phone: {lead.phone}</p>
                <p>Event type: {lead.eventType}</p>
                <p>Status: {lead.status}</p>
                <p>Payment status: {lead.paymentStatus}</p>
                <p>Created at: {lead.createdAt.toISOString()}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
