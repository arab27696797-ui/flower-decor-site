// app/page.tsx
// Si-Si — Public homepage (Next.js App Router, Server Component).
//
// ARCHITECTURE:
//   This file is a Server Component (no 'use client' directive).
//   All interactive behaviour lives inside the imported 'use client' components.
//   The page composes accepted section components in conversion-optimised order.
//
// SECTION ORDER (conversion rationale):
//   1. Navbar          — persistent navigation + language switcher + CTA
//   2. HeroSection     — primary H1, value proposition, dual CTA, marquee
//   3. ServicesSection — what we offer, anchor: #services
//   4. AdvantagesSection — why us, social proof, differentiators, anchor: #advantages
//   5. PortfolioPreview — completed works marquee (/api/portfolio), anchor: #portfolio
//   6. Calculator      — price estimator, anchor: #calculator (hero CTA target)
//   7. LeadForm        — lead capture, anchor: #contact (calculator summary CTA target)
//   8. ContactsSection — phone, Telegram, WhatsApp, service area, anchor: #contacts
//   9. Footer          — legal links, secondary nav, social
//  10. CookieBanner    — cookie consent (fixed/sticky, outside page flow)
//
// SEO:
//   - Metadata export below covers title, description, OG, Twitter card.
//   - JSON-LD LocalBusiness schema is injected via <script type="application/ld+json">.
//   - One H1 only — rendered inside <HeroSection>.
//   - Section heading hierarchy (H2 inside each section) is enforced in components.
//   - Canonical URL is set via alternates.canonical.

import type { Metadata } from 'next'

// ---------------------------------------------------------------------------
// Accepted public section components
// ---------------------------------------------------------------------------
import { Navbar }            from '@/components/site/navbar'
import { HeroSection }       from '@/components/site/hero-section'
import { ServicesSection }   from '@/components/site/services-section'
import { AdvantagesSection } from '@/components/site/advantages-section'
import { PortfolioPreview }  from '@/components/site/portfolio-preview'
import { LeadFormWithCart }  from '@/components/site/lead-form-with-cart'
import { ContactsSection }   from '@/components/site/contacts-section'
import { Footer }            from '@/components/site/footer'
import { CookieBanner }      from '@/components/site/cookie-banner'

// ---------------------------------------------------------------------------
// Accepted calculator components
// ---------------------------------------------------------------------------
import { CalculatorCategoryFloral }   from '@/components/site/calculator/calculator-category-floral'
import { CalculatorCategoryBalloons } from '@/components/site/calculator/calculator-category-balloons'
import { CalculatorCategoryBouquet }  from '@/components/site/calculator/calculator-category-bouquet'
import { CalculatorCategoryEvent }    from '@/components/site/calculator/calculator-category-event'
import { CalculatorSummary }          from '@/components/site/calculator/calculator-summary'

// ---------------------------------------------------------------------------
// SEO Metadata — App Router export
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Si-Si — Оформление мероприятий в Москве за 24 часа',
  description:
    'Флористическое оформление входных групп, свадеб, корпоративов и любых мероприятий в Москве и МО. ' +
    'Искусственные и живые цветы, воздушные шары, срочные букеты от 15 000 ₽. Под ключ за 24 часа.',
  keywords: [
    'оформление мероприятий Москва',
    'флористический декор',
    'оформление входных групп',
    'свадебное оформление',
    'корпоративный декор',
    'воздушные шары',
    'срочный букет',
    'искусственные цветы декор',
    'живые цветы оформление',
    'декор за 24 часа',
  ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://si-si.ru',
  },
  openGraph: {
    title: 'Si-Si — Оформление мероприятий в Москве за 24 часа',
    description:
      'Флористическое оформление входных групп, свадеб, корпоративов в Москве и МО. ' +
      'Под ключ: идея, декор, доставка, монтаж и демонтаж.',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://si-si.ru',
    siteName: 'Si-Si',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Si-Si — Оформление мероприятий в Москве за 24 часа',
    description:
      'Флористический декор под ключ: входные группы, свадьбы, корпоративы. Москва и МО. Старт за 24 часа.',
  },
}

// ---------------------------------------------------------------------------
// JSON-LD — LocalBusiness structured data
// ---------------------------------------------------------------------------

const jsonLdLocalBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Si-Si',
  description:
    'Флористическое оформление мероприятий, входных групп, свадеб и корпоративов ' +
    'в Москве и Московской области. Под ключ за 24 часа.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://si-si.ru',
  telephone: '+79990000000',   // TODO: replace with real phone before launch
  email: 'info@si-si.ru',      // TODO: replace with real email before launch
  image: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://si-si.ru'}/og-cover.jpg`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Москва',
    addressRegion: 'Московская область',
    addressCountry: 'RU',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 55.7558,
    longitude: 37.6176,
  },
  areaServed: [
    { '@type': 'City', name: 'Москва' },
    { '@type': 'AdministrativeArea', name: 'Московская область' },
  ],
  priceRange: '₽₽₽',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday', 'Sunday',
    ],
    opens: '09:00',
    closes: '22:00',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Услуги флористического оформления',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Оформление искусственными цветами' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Оформление живыми цветами' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Оформление воздушными шарами' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Срочный букет от 15 000 ₽' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Оформление мероприятий за 24 часа' },
      },
    ],
  },
}

// ---------------------------------------------------------------------------
// Page component — Server Component (no 'use client')
// ---------------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      {/* JSON-LD structured data for Google / Yandex local search */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }}
      />

      {/* Skip-to-content link — accessibility */}
      <a
        href="#main-content"
        className="
          sr-only focus:not-sr-only
          focus:fixed focus:left-4 focus:top-4 focus:z-[200]
          focus:rounded-md focus:bg-brand-gold focus:px-4 focus:py-2
          focus:text-sm focus:font-semibold focus:text-brand-ink
          focus:shadow-lg focus:outline-none
        "
      >
        Перейти к содержанию
      </a>

      {/* Sticky navigation — rendered outside <main> so it overlays content */}
      <Navbar />

      <main id="main-content">
        {/* 1. Hero — primary value proposition, H1, dual CTA, services marquee */}
        <HeroSection />

        {/* 2. Services — bento grid of offerings
               Anchor: #services */}
        <section id="services" aria-label="Услуги оформления" className="scroll-mt-20">
          <ServicesSection />
        </section>

        {/* 3. Advantages — animated stats + trust cards
               Anchor: #advantages */}
        <section id="advantages" aria-label="Наши преимущества" className="scroll-mt-20">
          <AdvantagesSection />
        </section>

        {/* 4. Portfolio — dual photo marquee from /api/portfolio
               Anchor: #portfolio */}
        <section id="portfolio" aria-label="Портфолио" className="scroll-mt-20">
          <PortfolioPreview />
        </section>

        {/* 5. Calculator — price estimator (multi-category accumulative cart)
               Anchor: #calculator — target of the hero primary CTA.
               Category cards on the left, sticky estimate panel on the right. */}
        <section
          id="calculator"
          aria-labelledby="calculator-heading"
          className="relative scroll-mt-20 overflow-hidden bg-brand-onyx py-20 sm:py-24 lg:py-28"
        >
          {/* Wine glow accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[-10%] top-24 h-[26rem] w-[26rem] rounded-full bg-brand-wine/40 blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section heading */}
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-gold">
                Калькулятор
              </p>
              <h2
                id="calculator-heading"
                className="font-display text-display-lg font-semibold text-brand-parchment"
              >
                Соберите свою{' '}
                <span className="text-gold-gradient italic">смету</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-brand-stone sm:text-base">
                Выберите один или несколько видов услуг — все позиции
                автоматически суммируются в итоговую смету справа.
              </p>
            </div>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
              {/* Category cards */}
              <div className="flex flex-col gap-6">
                {/* Category A — Floral decoration */}
                <CalculatorCategoryFloral />

                {/* Category B — Balloon decoration */}
                <CalculatorCategoryBalloons />

                {/* Category C — Urgent bouquet */}
                <CalculatorCategoryBouquet />

                {/* Category D — General event decoration */}
                <CalculatorCategoryEvent />
              </div>

              {/* Sticky estimate panel */}
              <div className="lg:sticky lg:top-24">
                <CalculatorSummary />
              </div>
            </div>
          </div>
        </section>

        {/* 6. Lead form — anchor: #contact (calculator summary CTA target) */}
        <section id="contact" aria-label="Оставить заявку" className="scroll-mt-20">
          <LeadFormWithCart />
        </section>

        {/* 7. Contacts — anchor: #contacts */}
        <section id="contacts" aria-label="Контакты" className="scroll-mt-20">
          <ContactsSection />
        </section>

        {/* 8. Footer */}
        <Footer />
      </main>

      {/* 9. Cookie consent — fixed, outside page flow */}
      <CookieBanner />
    </>
  )
}
