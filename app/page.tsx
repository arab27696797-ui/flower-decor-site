// app/page.tsx
// PRIMA Decor — Public homepage (Next.js App Router, Server Component).
//
// ARCHITECTURE:
//   This file is a Server Component (no 'use client' directive).
//   All interactive behaviour lives inside the imported 'use client' components.
//   The page composes accepted section components in conversion-optimised order.
//
// SECTION ORDER (conversion rationale):
//   1. Navbar          — persistent navigation + language switcher + phone CTA
//   2. HeroSection     — primary H1, value proposition, dual CTA, trust badges
//   3. ServicesSection — what we offer, anchor: #services
//   4. AdvantagesSection — why us, social proof, differentiators, anchor: #advantages
//   5. Calculator      — price estimator, anchor: #calculator (hero CTA target)
//   6. LeadForm        — lead capture, anchor: #contact (calculator summary CTA target)
//   7. ContactsSection — phone, Telegram, WhatsApp, service area, anchor: #contacts
//   8. Footer          — legal links, secondary nav, social
//   9. CookieBanner    — cookie consent (fixed/sticky, outside page flow)
//
// SEO:
//   - Metadata export below covers title, description, OG, Twitter card.
//   - JSON-LD LocalBusiness schema is injected via <script type="application/ld+json">.
//   - One H1 only — rendered inside <HeroSection>.
//   - Section heading hierarchy (H2 inside each section) is enforced in components.
//   - Canonical URL is set via alternates.canonical.
//
// ANCHORS:
//   The hero CTAs link to:
//     href="#calculator"  — handled by <section id="calculator"> in this file
//     href="tel:..."      — handled by ContactsSection phone constant
//   The calculator summary "Submit" CTA links to:
//     href="#contact"     — handled by <section id="contact"> in this file
//
// NOTE ON NEXT.CONFIG.TS:
//   output: 'standalone' is set — this page is compiled to a standalone server file.
//   No getServerSideProps or getStaticProps (App Router — uses fetch/async components).
//   The page is fully statically renderable; no runtime DB calls at page level.

import type { Metadata } from 'next'

// ---------------------------------------------------------------------------
// Accepted public section components
// ---------------------------------------------------------------------------
import { Navbar }            from '@/components/site/navbar'
import { HeroSection }       from '@/components/site/hero-section'
import { ServicesSection }   from '@/components/site/services-section'
import { AdvantagesSection } from '@/components/site/advantages-section'
import { LeadForm }          from '@/components/site/lead-form'
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
// Served as <head> tags on the page by Next.js at build time.
// Update NEXT_PUBLIC_SITE_URL in .env.example / Railway env vars.
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'PRIMA Decor — Оформление мероприятий в Москве за 24 часа',
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
    // Canonical URL — replace with actual production domain once live.
    canonical: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://primadecor.ru',
  },
  openGraph: {
    title: 'PRIMA Decor — Оформление мероприятий в Москве за 24 часа',
    description:
      'Флористическое оформление входных групп, свадеб, корпоративов в Москве и МО. ' +
      'Под ключ: идея, декор, доставка, монтаж и демонтаж.',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://primadecor.ru',
    siteName: 'PRIMA Decor',
    locale: 'ru_RU',
    type: 'website',
    // og:image — uncomment and add final brand photograph when available:
    // images: [{ url: '/og-cover.jpg', width: 1200, height: 630, alt: 'PRIMA Decor — флористическое оформление' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRIMA Decor — Оформление мероприятий в Москве за 24 часа',
    description:
      'Флористический декор под ключ: входные группы, свадьбы, корпоративы. Москва и МО. Старт за 24 часа.',
  },
}

// ---------------------------------------------------------------------------
// JSON-LD — LocalBusiness structured data
// Injected as <script type="application/ld+json"> in the page <head>.
// This tells Google search what kind of business this is, where it operates,
// and what services it provides — critical for local SEO.
// Update phone, email, and url before first public launch.
// ---------------------------------------------------------------------------

const jsonLdLocalBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'PRIMA Decor',
  description:
    'Флористическое оформление мероприятий, входных групп, свадеб и корпоративов ' +
    'в Москве и Московской области. Под ключ за 24 часа.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://primadecor.ru',
  telephone: '+79990000000',   // TODO: replace with real phone before launch
  email: 'info@primadecor.ru', // TODO: replace with real email before launch
  image: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://primadecor.ru'}/og-cover.jpg`,
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
        itemOffered: {
          '@type': 'Service',
          name: 'Оформление искусственными цветами',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Оформление живыми цветами',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Оформление воздушными шарами',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Срочный букет от 15 000 ₽',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Оформление мероприятий за 24 часа',
        },
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
        // dangerouslySetInnerHTML is the correct App Router pattern for JSON-LD.
        // The value is serialised from a static constant — no user input involved.
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Skip-to-content link — accessibility, keyboard navigation           */}
      {/* Positioned off-screen until focused (styled in globals.css)         */}
      {/* ------------------------------------------------------------------ */}
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

      {/* ------------------------------------------------------------------ */}
      {/* Sticky navigation — rendered outside <main> so it overlays content  */}
      {/* ------------------------------------------------------------------ */}
      <Navbar />

      {/* ------------------------------------------------------------------ */}
      {/* Main page content                                                    */}
      {/* id="main-content" is the skip-link target                           */}
      {/* ------------------------------------------------------------------ */}
      <main id="main-content">

        {/* 1. Hero — primary value proposition, H1, dual CTA */}
        {/* id="hero" is set inside <HeroSection> itself       */}
        <HeroSection />

        {/* 2. Services — what the business actually offers
               Anchor: #services — linked from navbar "Услуги" item */}
        <section id="services" aria-label="Услуги оформления">
          <ServicesSection />
        </section>

        {/* 3. Advantages — trust signals, differentiators
               Anchor: #advantages */}
        <section id="advantages" aria-label="Наши преимущества">
          <AdvantagesSection />
        </section>

        {/* 4. Calculator — price estimator (multi-category accumulative cart)
               Anchor: #calculator — this is the target of the hero primary CTA
               The calculator is composed of four category input components
               and a shared summary block that shows the live total. */}
        <section
          id="calculator"
          aria-labelledby="calculator-heading"
          className="scroll-mt-20"
        >
          {/*
            scroll-mt-20 (80px) compensates for the sticky navbar height
            so the section heading is not hidden behind the nav when
            the page scrolls to #calculator from the hero CTA.
          */}

          {/*
            CALCULATOR LAYOUT:
            The four category components are stacked vertically.
            Each category writes its selections into the shared Zustand store
            (components/site/calculator/calculator-cart.ts).
            <CalculatorSummary> reads from the same store and renders
            the live total + disclaimer + "Request this" CTA.

            The category components are independent — the order here only
            affects visual presentation. All state is shared via Zustand,
            so removing or reordering components does not break accumulation.
          */}

          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">

            <h2
              id="calculator-heading"
              className="font-display text-display-md text-brand-ink mb-3 text-center"
            >
              Рассчитайте стоимость
            </h2>
            <p className="text-center text-sm text-brand-stone mb-12 max-w-xl mx-auto">
              Выберите один или несколько видов услуг. Все выбранные позиции
              суммируются в итоговую смету автоматически.
            </p>

            {/* Category A — Floral decoration */}
            <CalculatorCategoryFloral />

            {/* Category B — Balloon decoration */}
            <CalculatorCategoryBalloons />

            {/* Category C — Urgent bouquet */}
            <CalculatorCategoryBouquet />

            {/* Category D — General event / entrance zone / wedding / corporate */}
            <CalculatorCategoryEvent />

            {/* Shared summary — reads from Zustand, shows total + disclaimer + CTA */}
            <CalculatorSummary />

          </div>
        </section>

        {/* 5. Lead form — contact capture
               Anchor: #contact — target of the calculator summary CTA
               The form receives pre-filled calculator data from the Zustand store. */}
        <section
          id="contact"
          aria-labelledby="lead-form-heading"
          className="scroll-mt-20"
        >
          <LeadForm />
        </section>

        {/* 6. Contacts — phone, Telegram, WhatsApp, service area
               Anchor: #contacts — linked from navbar and footer */}
        <section
          id="contacts"
          aria-label="Контакты и способы связи"
          className="scroll-mt-20"
        >
          <ContactsSection />
        </section>

      </main>

      {/* ------------------------------------------------------------------ */}
      {/* Footer — legal links, secondary nav, social media                   */}
      {/* Rendered outside <main> — it is a site-wide landmark                */}
      {/* ------------------------------------------------------------------ */}
      <Footer />

      {/* ------------------------------------------------------------------ */}
      {/* Cookie consent banner — fixed overlay, outside page flow            */}
      {/* Rendered after all content so it does not block LCP element         */}
      {/* ------------------------------------------------------------------ */}
      <CookieBanner />
    </>
  )
}
