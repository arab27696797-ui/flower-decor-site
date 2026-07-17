'use client'

// components/site/footer.tsx
// Si-Si — site footer, "Noir Bloom" design.
// Brand block + nav + socials + legal links, crowned by a giant ghost
// wordmark. Placeholder contacts remain until the SEO batch.

import Link from 'next/link'
import { useTranslations } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Contact constants — PLACEHOLDERS, replaced in the SEO batch
// ---------------------------------------------------------------------------

const CONTACT_PHONE_DISPLAY   = '+7 (999) 000-00-00'
const CONTACT_PHONE_TEL       = '+79990000000'
const CONTACT_TELEGRAM_HANDLE = 'si-si_msk'
const CONTACT_WHATSAPP_NUMBER = '79990000000'
const CONTACT_EMAIL           = 'info@si-si.ru'
const CONTACT_INSTAGRAM       = 'si-si.msk'

// ---------------------------------------------------------------------------
// Link groups
// ---------------------------------------------------------------------------

interface FooterLink {
  labelRu: string
  labelEn: string
  href: string
}

const NAV_LINKS: FooterLink[] = [
  { labelRu: 'Услуги',      labelEn: 'Services',   href: '#services'   },
  { labelRu: 'Портфолио',   labelEn: 'Portfolio',  href: '#portfolio'  },
  { labelRu: 'Калькулятор', labelEn: 'Calculator', href: '#calculator' },
  { labelRu: 'Контакты',    labelEn: 'Contacts',   href: '#contacts'   },
]

const LEGAL_LINKS: FooterLink[] = [
  { labelRu: 'Политика конфиденциальности',   labelEn: 'Privacy Policy',       href: '/privacy-policy'       },
  { labelRu: 'Обработка персональных данных', labelEn: 'Personal Data Policy', href: '/personal-data-policy' },
  { labelRu: 'Политика cookie',               labelEn: 'Cookie Policy',        href: '/cookie-policy'        },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Footer() {
  const { locale } = useTranslations()
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-brand-midnight-border bg-brand-onyx">
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {/* Brand block */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="w-fit font-display text-3xl font-semibold tracking-tight text-brand-parchment"
            >
              Si<span className="text-brand-gold">–</span>Si
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-brand-stone">
              {locale === 'en'
                ? 'Premium event decoration in Moscow. Florals, balloons, photo zones and full-service styling — within 24 hours.'
                : 'Премиальное оформление мероприятий в Москве. Флористика, шары, фотозоны и декор под ключ — за 24 часа.'}
            </p>

            {/* Socials */}
            <div className="mt-2 flex items-center gap-3">
              <a
                href={`https://t.me/${CONTACT_TELEGRAM_HANDLE}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-midnight-border text-brand-stone transition-all duration-base hover:border-brand-gold/50 hover:text-brand-gold"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M21.9 4.6 18.8 19c-.2 1-.8 1.2-1.6.8l-4.5-3.3-2.2 2.1c-.2.2-.4.4-.9.4l.3-4.6 8.4-7.6c.4-.3-.1-.5-.6-.2L7.3 13.2l-4.4-1.4c-1-.3-1-1 .2-1.4l17.2-6.6c.8-.3 1.5.2 1.6.8Z" />
                </svg>
              </a>
              <a
                href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-midnight-border text-brand-stone transition-all duration-base hover:border-brand-gold/50 hover:text-brand-gold"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                  <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Z" />
                </svg>
              </a>
              <a
                href={`https://instagram.com/${CONTACT_INSTAGRAM}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-midnight-border text-brand-stone transition-all duration-base hover:border-brand-gold/50 hover:text-brand-gold"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                  <circle cx="12" cy="12" r="3.8" />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label={locale === 'en' ? 'Footer navigation' : 'Навигация в подвале'}>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold">
              {locale === 'en' ? 'Navigate' : 'Навигация'}
            </p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-brand-stone transition-colors duration-base hover:text-brand-parchment"
                  >
                    {locale === 'en' ? link.labelEn : link.labelRu}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacts */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold">
              {locale === 'en' ? 'Contacts' : 'Контакты'}
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="text-brand-parchment transition-colors hover:text-brand-gold-light"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-brand-stone transition-colors hover:text-brand-parchment"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="text-brand-stone">
                {locale === 'en' ? 'Moscow & MO · daily 09:00–22:00' : 'Москва и МО · ежедневно 09:00–22:00'}
              </li>
            </ul>
          </div>
        </div>

        {/* Legal row */}
        <div className="mt-12 flex flex-col gap-3 border-t border-brand-midnight-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-brand-stone/70">
            © {year} Si-Si. {locale === 'en' ? 'All rights reserved.' : 'Все права защищены.'}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs text-brand-stone/70 transition-colors hover:text-brand-stone"
                >
                  {locale === 'en' ? link.labelEn : link.labelRu}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Giant ghost wordmark */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[0.16em] text-center font-display text-[22vw] font-semibold leading-none text-brand-parchment/[0.04] md:text-[16rem]">
          Si–Si
        </p>
      </div>
    </footer>
  )
}

export default Footer
