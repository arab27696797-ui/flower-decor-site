// app/layout.tsx
// Si-Si — Root layout for Next.js App Router.
// Loads Cormorant Garamond (display) + Inter (body) via next/font/google.
// Both subsets include Cyrillic for Russian primary locale.
// Font CSS variables --font-cormorant and --font-inter are injected on <html>
// and consumed by Tailwind (font-display / font-sans) via tailwind.config.
// No custom provider is added — the accepted i18n setup (lib/i18n.ts) is
// context-free (utility functions only, no React context required at root level).
// Metadata API: metadataBase + default title template + OG defaults.
// Individual pages override via their own `export const metadata` or
// `generateMetadata()` — App Router merges them automatically.

import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

// Display font — Cormorant Garamond (elegant serif, floral/luxury feel)
// Used for all headings, hero text, and decorative display copy.
const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: true,
})

// Body font — Inter (clean, legible sans-serif for UI, forms, labels)
// Used for body copy, buttons, form fields, nav links, and all UI chrome.
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
})

// ---------------------------------------------------------------------------
// Site-wide metadata defaults
// ---------------------------------------------------------------------------
// All pages inherit these. Individual pages override what they need.
// App Router deep-merges per-page `metadata` exports on top of these defaults.

export const metadata: Metadata = {
  // metadataBase is required for absolute OG/Twitter image URLs.
  // Replace with real production domain once deployed.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://si-si.ru'
  ),

  // Title template: page-specific titles get " — Si-Si" appended.
  // The root `default` is used when a page exports no title.
  title: {
    default: 'Si-Si — Оформление мероприятий в Москве за 24 часа',
    template: '%s — Si-Si',
  },

  description:
    'Флористическое оформление входных групп, свадеб, корпоративов и любых мероприятий ' +
    'в Москве и МО. Искусственные и живые цветы, воздушные шары, срочные букеты. ' +
    'Под ключ за 24 часа.',

  // Indexing defaults — individual pages may narrow these.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph defaults
  openGraph: {
    type: 'website',
    siteName: 'Si-Si',
    locale: 'ru_RU',
    title: 'Si-Si — Оформление мероприятий в Москве за 24 часа',
    description:
      'Флористическое оформление под ключ: входные группы, свадьбы, корпоративы. ' +
      'Москва и МО. Старт за 24 часа после оплаты.',
    // og:image — uncomment and set once brand photography is available:
    // images: [
    //   {
    //     url: '/og-image.jpg',
    //     width: 1200,
    //     height: 630,
    //     alt: 'Si-Si — флористическое оформление мероприятий',
    //   },
    // ],
  },

  // Twitter / X card
  twitter: {
    card: 'summary_large_image',
    title: 'Si-Si — Оформление мероприятий в Москве за 24 часа',
    description:
      'Флористический декор под ключ: входные группы, свадьбы, корпоративы. ' +
      'Москва и МО.',
  },

  // Canonical and alternate locales are handled per-page via `alternates`
  // in each page's metadata export (see app/page.tsx, app/privacy-policy/page.tsx).

  // Verification tags — fill in once connected to search consoles:
  // verification: {
  //   google: 'GOOGLE_SITE_VERIFICATION_TOKEN',
  //   yandex: 'YANDEX_VERIFICATION_TOKEN',
  // },
}

// ---------------------------------------------------------------------------
// Root layout component
// ---------------------------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    /*
     * lang="ru" — primary locale. The bilingual switcher (in Navbar) changes
     * the visible content language via lib/i18n.ts without requiring route-level
     * locale segmentation at this stage. If full /en route prefix is added later,
     * lang will be moved to a per-locale layout in app/[locale]/layout.tsx.
     */
    <html
      lang="ru"
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
         * DNS prefetch for any third-party domains used in components.
         * These are safe to include unconditionally — they only hint the browser.
         */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        {/* Yandex Metrika or Google Analytics tags go here once confirmed */}
      </head>

      <body
        className="
          min-h-dvh antialiased
          bg-brand-cream text-brand-ink
          font-sans
        "
      >
        {/*
         * No root-level providers required by the current accepted architecture:
         * - Calculator state: Zustand store (self-initialising, no provider needed)
         * - i18n: lib/i18n.ts utility functions (context-free)
         * - Forms: react-hook-form (component-level, no root provider)
         * If a ThemeProvider or ToastProvider is added in a future step,
         * it belongs here wrapping {children}.
         */}
        {children}
      </body>
    </html>
  )
}
