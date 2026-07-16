import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: true,
})

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://si-si.ru'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'Si-Si — свадебный декор и оформление мероприятий в Москве',
    template: '%s — Si-Si',
  },

  description:
    'Si-Si — свадебный декор, цветочное оформление и флористика на мероприятия в Москве и Московской области. Премиальная подача, монтаж и выезд под ключ.',

  keywords: [
    'свадебный декор',
    'цветочное оформление Москва',
    'флористика на мероприятия',
    'оформление мероприятий Москва',
    'свадебная флористика Москва',
    'оформление свадьбы Москва',
    'оформление шарами Москва',
    'срочный букет Москва',
  ],

  alternates: {
    canonical: siteUrl,
  },

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

  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Si-Si',
    locale: 'ru_RU',
    title: 'Si-Si — свадебный декор и оформление мероприятий в Москве',
    description:
      'Премиальный свадебный декор, флористика и оформление мероприятий в Москве и МО. Si-Si — под ключ, с характером и выездом на площадку.',
    images: [
      {
        url: '/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Si-Si — свадебный декор и оформление мероприятий',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Si-Si — свадебный декор и оформление мероприятий в Москве',
    description:
      'Свадебный декор, цветочное оформление, фотозоны, шары и срочные букеты в Москве и МО.',
    images: ['/og-cover.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>

      <body
        className="
          min-h-dvh antialiased
          bg-brand-cream text-brand-ink
          font-sans
        "
      >
        {children}
      </body>
    </html>
  )
}
