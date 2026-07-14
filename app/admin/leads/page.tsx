import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/admin-auth'

export default async function AdminLeadsPage() {
  await requireAdminAuth()

  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  const totalLeadsCount = leads.length
  const newLeadsCount = leads.filter((lead) => lead.status === 'new').length
  const contactedLeadsCount = leads.filter((lead) => lead.status === 'contacted').length
  const confirmedLeadsCount = leads.filter((lead) => lead.status === 'confirmed').length
  const closedLeadsCount = leads.filter((lead) => lead.status === 'closed').length
  const cancelledLeadsCount = leads.filter((lead) => lead.status === 'cancelled').length

  return (
    <main>
      <section>
        <h1>Admin Leads</h1>

        <ul>
          <li>Total leads: {totalLeadsCount}</li>
          <li>New: {newLeadsCount}</li>
          <li>Contacted: {contactedLeadsCount}</li>
          <li>Confirmed: {confirmedLeadsCount}</li>
          <li>Closed: {closedLeadsCount}</li>
          <li>Cancelled: {cancelledLeadsCount}</li>
        </ul>

        <hr />

        <ul>
          {leads.map((lead) => (
            <li key={lead.id}>
              <article>
                <h2>{lead.name} — {lead.phone}</h2>
                <p>Status: {lead.status}</p>
                <p>Location: {lead.eventLocation}</p>
                {lead.desiredDate && (
                  <p>Desired date: {lead.desiredDate.toISOString()}</p>
                )}
                <p>Created at: {lead.createdAt.toISOString()}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
