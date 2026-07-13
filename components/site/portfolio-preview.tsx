'use client'

import { useEffect, useState } from 'react'
import { useScrollReveal } from '../../hooks/use-scroll-reveal'
import type { PortfolioImage } from '../../types'

type PortfolioResponse = {
  ok: boolean
  data: PortfolioImage[]
}

export function PortfolioPreview() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()
  const [images, setImages] = useState<PortfolioImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((json: PortfolioResponse) => {
        if (json.ok) setImages(json.data)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <div
        ref={ref}
        className={`space-y-3 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="text-display-md font-semibold text-brand-ink">
          Портфолио по типам событий
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-brand-ink/80 md:text-base">
          Примеры оформлений для свадеб, дней рождения, детских праздников и
          корпоративов.
        </p>
      </div>

      {isLoading ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-card bg-brand-blush/30"
            />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="mt-6 rounded-card border border-brand-ink/10 bg-white/85 p-6 shadow-card">
          <p className="text-sm leading-6 text-brand-ink/70">
            Первые примеры оформлений появятся здесь после загрузки фото в
            админ-панели.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="group overflow-hidden rounded-card border border-brand-ink/10 bg-white/80 shadow-card transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <img
                src={image.url}
                alt={image.eventType}
                width={400}
                height={280}
                loading="lazy"
                className="h-40 w-full object-cover"
              />
              <p className="p-3 text-sm font-medium text-brand-ink">
                {image.eventType}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
