// app/page.tsx
// PRIMA Decor — Main homepage (App Router).
// Composes all accepted site sections into a single conversion-optimised landing page.
// Section order: Navbar → Hero → Services → Advantages → Calculator → Lead Form → Contacts → Footer + CookieBanner.
// Hero section is temporarily inlined here since components/site/hero-section.tsx
// has not yet been accepted as a final file — it is clearly isolated and easy to extract.
// All other sections are imported from their accepted component files.

import type { Metadata } from 'next'

// ---- Accepted section components ----------------------------------------
import { Navbar }             from '@/components/site/navbar'
import { ServicesSection }    from '@/components/site/services-section'
import { AdvantagesSection }  from '@/components/site/advantages-section'
import { ContactsSection }    from '@/components/site/contacts-section'
import { Footer }             from '@/components/site/footer'
import { CookieBanner }       from '@/components/site/cookie-banner'

// ---- Calculator sections (accepted) -------------------------------------
import { CalculatorCategoryFloral }   from '@/components/site/calculator/calculator-category-floral'
import { CalculatorCategoryBalloons } from '@/components/site/calculator/calculator-category-balloons'
import { CalculatorCategoryBouquet }  from '@/components/site/calculator/calculator-category-bouquet'
import { CalculatorCategoryEvent }    from '@/components/site/calculator/calculator-category-event'
import { CalculatorSummary }          from '@/components/site/calculator/calculator-summary'

// ---- Lead form (accepted) -----------------------------------------------
import { LeadForm } from '@/components/site/lead-form'

// ---------------------------------------------------------------------------
// SEO Metadata — App Router export
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'PRIMA Decor — Оформление мероприятий в Москве за 24 часа',
  description:
    'Флористическое оформление входных групп, свадеб, корпоративов и любых мероприятий в Москве и МО. Искусственные и живые цветы, воздушные шары, срочные букеты. Под ключ за 24 часа.',
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
    canonical: '/',
  },
  openGraph: {
    title: 'PRIMA Decor — Оформление мероприятий в Москве за 24 часа',
    description:
      'Флористическое оформление входных групп, свадеб, корпоративов в Москве и МО. Под ключ: идея, декор, доставка, монтаж и демонтаж.',
    url: '/',
    siteName: 'PRIMA Decor',
    locale: 'ru_RU',
    type: 'website',
    // og:image should be added here once final brand photography is available:
    // images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'PRIMA Decor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRIMA Decor — Оформление мероприятий в Москве за 24 часа',
    description:
      'Флористический декор под ключ: входные группы, свадьбы, корпоративы. Москва и МО. Старт за 24 часа.',
  },
  // JSON-LD structured data is added inline below via <script> tag
}

// ---------------------------------------------------------------------------
// JSON-LD — LocalBusiness structured data for SEO
// ---------------------------------------------------------------------------

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'PRIMA Decor',
  description:
    'Флористическое оформление мероприятий, входных групп, свадеб и корпоративов в Москве и Московской области. Под ключ за 24 часа.',
  url: 'https://primadecor.ru', // Replace with real domain
  telephone: '+79990000000',    // Replace with real phone
  email: 'info@primadecor.ru',  // Replace with real email
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Москва',
    addressRegion: 'Московская область',
    addressCountry: 'RU',
  },
  areaServed: [
    { '@type': 'City', name: 'Москва' },
    { '@type': 'AdministrativeArea', name: 'Московская область' },
  ],
  priceRange: '₽₽₽',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday',
    ],
    opens: '09:00',
    closes: '22:00',
  },
  serviceType: [
    'Флористическое оформление мероприятий',
    'Оформление входных групп',
    'Свадебное оформление',
    'Корпоративный декор',
    'Оформление воздушными шарами',
    'Срочный букет',
  ],
}

// ---------------------------------------------------------------------------
// Inline Hero Section
// ISOLATED: extract to components/site/hero-section.tsx when ready for
// full visual design pass. All hero copy and logic is contained here only.
// ---------------------------------------------------------------------------

// NOTE: This is a Server Component page. Interactive client behaviour
// (language switching, mobile menu, calculator state) lives inside the
// individual 'use client' section components imported above.
// The hero content below is static HTML rendered on the server.

function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="
        relative overflow-hidden
        bg-brand-forest text-white
        px-4 pt-28 pb-20
        sm:px-6 sm:pt-36 sm:pb-28
        md:pt-40 md:pb-32
      "
    >
      {/* Decorative background layer — soft ambient circles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="
          absolute -top-24 -right-24 h-96 w-96 rounded-full
          bg-brand-gold/10 blur-3xl
        " />
        <div className="
          absolute bottom-0 -left-16 h-72 w-72 rounded-full
          bg-white/5 blur-2xl
        " />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">

        {/* Eyebrow label */}
        <p className="
          inline-flex items-center gap-2
          rounded-full border border-white/20
          bg-white/8 px-3.5 py-1.5
          text-xs font-semibold uppercase tracking-widest text-white/70
          mb-6
        ">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
          Москва и Московская область
        </p>

        {/* H1 */}
        <h1
          id="hero-heading"
          className="
            font-display text-display-xl text-white leading-tight
            max-w-3xl
          "
        >
          Оформление&nbsp;мероприятий
          <br className="hidden sm:block" />
          {' '}и&nbsp;входных групп —{' '}
          <span className="text-brand-gold">за&nbsp;24&nbsp;часа</span>
        </h1>

        {/* Subheading */}
        <p className="
          mt-5 text-base text-white/70 leading-relaxed
          max-w-xl
        ">
          Искусственные и живые цветы, воздушные шары, свадьбы, корпоративы.
          Под&nbsp;ключ: идея, подбор декора, материалы, доставка, монтаж и демонтаж.
          Все заботы берём на себя.
        </p>

        {/* CTA row */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#calculator"
            className="
              inline-flex items-center justify-center gap-2
              rounded-lg bg-brand-gold px-6 py-3.5
              text-sm font-semibold text-brand-ink
              hover:bg-brand-gold/90 active:bg-brand-gold/80
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-white focus-visible:ring-offset-2
              focus-visible:ring-offset-brand-forest
            "
          >
            Рассчитать стоимость и сроки
          </a>

          <a
            href="tel:+79990000000"
            className="
              inline-flex items-center justify-center gap-2
              rounded-lg border border-white/25
              bg-white/8 px-6 py-3.5
              text-sm font-semibold text-white
              hover:bg-white/15 active:bg-white/20
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-white focus-visible:ring-offset-2
              focus-visible:ring-offset-brand-forest
            "
          >
            {/* Phone icon */}
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}
              strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true" className="h-4 w-4">
              <path d="M18.3 14.1v2.5a1.67 1.67 0 0 1-1.82 1.67
                       16.49 16.49 0 0 1-7.19-2.56
                       A16.25 16.25 0 0 1 3.77 10
                       16.49 16.49 0 0 1 1.22 2.84
                       A1.67 1.67 0 0 1 2.88 1.17h2.5
                       a1.67 1.67 0 0 1 1.67 1.43
                       c.106.8.3 1.59.58 2.34
                       a1.67 1.67 0 0 1-.38 1.76L6.2 7.63
                       a13.33 13.33 0 0 0 5.1 5.1l1.07-1.07
                       a1.67 1.67 0 0 1 1.76-.38
                       c.76.28 1.54.472 2.34.58
                       A1.67 1.67 0 0 1 18.3 14.1Z" />
            </svg>
            Позвонить
          </a>
        </div>

        {/* Trust microcopy row */}
        <div className="
          mt-8 flex flex-wrap gap-x-5 gap-y-2
          text-xs text-white/45
        ">
          {[
            'Старт работ через 24 ч после оплаты',
            'Срочные проекты — в день обращения',
            'Работаем 7 дней в неделю',
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-brand-gold/60" />
              {item}
            </span>
          ))}
        </div>

      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Calculator section wrapper
// Groups all four category panels + summary under one semantic section.
// ---------------------------------------------------------------------------

function CalculatorSection() {
  return (
    <section
      id="calculator"
      aria-labelledby="calculator-heading"
      className="bg-brand-cream"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">

        {/* Section header */}
        <div className="max-w-2xl mb-10 md:mb-14">
          <h2
            id="calculator-heading"
            className="font-display text-display-lg text-brand-ink leading-tight"
          >
            Рассчитать стоимость
          </h2>
          <p className="mt-3 text-base text-brand-ink/65 leading-relaxed">
            Выберите одну или несколько категорий — предыдущий выбор не сбрасывается.
            В итоге вы увидите суммарную ориентировочную стоимость.
          </p>
        </div>

        {/* Category panels — stack vertically, each is self-contained */}
        <div className="flex flex-col gap-4">
          <CalculatorCategoryFloral />
          <CalculatorCategoryBalloons />
          <CalculatorCategoryBouquet />
          <CalculatorCategoryEvent />
        </div>

        {/* Summary + disclaimer */}
        <div className="mt-8">
          <CalculatorSummary />
        </div>

      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Lead form section wrapper
// ---------------------------------------------------------------------------

function LeadFormSection() {
  return (
    <section
      id="lead-form"
      aria-labelledby="lead-form-heading"
      className="bg-white"
    >
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">

        <div className="mb-8 md:mb-10">
          <h2
            id="lead-form-heading"
            className="font-display text-display-lg text-brand-ink leading-tight"
          >
            Оставить заявку
          </h2>
          <p className="mt-3 text-base text-brand-ink/65 leading-relaxed">
            Опишите ваш проект — мы свяжемся и уточним детали. Без обязательств.
          </p>
        </div>

        <LeadForm />

      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Skip-to-content link — accessibility
// ---------------------------------------------------------------------------

function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        fixed top-2 left-2 z-[100]
        rounded-lg bg-brand-forest px-4 py-2
        text-sm font-semibold text-white
        focus:outline-none focus:ring-2 focus:ring-brand-gold
      "
    >
      Перейти к содержимому
    </a>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      {/* Accessibility: skip nav */}
      <SkipToContent />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky navbar — renders above everything */}
      <Navbar />

      {/* Main content landmark */}
      <main id="main-content">

        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Services */}
        <ServicesSection />

        {/* 3. Advantages / Trust */}
        <AdvantagesSection />

        {/* 4. Calculator */}
        <CalculatorSection />

        {/* 5. Lead form */}
        <LeadFormSection />

        {/* 6. Contacts */}
        <ContactsSection />

      </main>

      {/* Footer */}
      <Footer />

      {/* Cookie banner — fixed position, renders last in DOM */}
      <CookieBanner />
    </>
  )
}
