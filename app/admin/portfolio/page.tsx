import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/admin-auth'

export default async function AdminPortfolioPage() {
  await requireAdminAuth()

  const images = await prisma.portfolioImage.findMany({
    orderBy: [
      { eventType: 'asc' },
      { sortOrder: 'asc' },
      { id: 'asc' },
    ],
  })

  return (
    <main>
      <section>
        <h1>Admin Portfolio</h1>
        <p>Total images: {images.length}</p>

        <ul>
          {images.map((image) => (
            <li key={image.id}>
              <article>
                <h2>{image.eventType}</h2>
                <p>URL: {image.url}</p>
                <p>Sort order: {image.sortOrder}</p>
                <p>Active: {image.isActive ? 'yes' : 'no'}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
