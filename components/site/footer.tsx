'use client'

// components/site/footer.tsx
// Si-Si — Site footer.
// Brand block + nav links + contact links + legal links + copyright.
// Contact constants isolated at the top for easy replacement when contacts admin is wired.
// External links use target="_blank" rel="noopener noreferrer".

import React from 'react'
import { useTranslations } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Contact constants — mirror of contacts-section.tsx; replace together
// ---------------------------------------------------------------------------

const CONTACT_PHONE_DISPLAY   = '+7 (999) 000-00-00'
const CONTACT_PHONE_TEL       = '+79990000000'
const CONTACT_TELEGRAM_HANDLE = 'si-si_msk'
const CONTACT_WHATSAPP_NUMBER = '79990000000'
const CONTACT_EMAIL           = 'info@si-si.ru'

// ---------------------------------------------------------------------------
// Inline SVG logo mark — same as navbar, no external dep
// ---------------------------------------------------------------------------

function SiSiLogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="8" y="6" width="2.5" height="20" rx="1.25" fill="currentColor" />
      <path
        d="M10.5 6.5 C10.5 6.5 22 6 22 12.5 C22 19 10.5 18.5 10.5 18.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="22" cy="12.5" r="2" fill="currentColor" opacity="0.35" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Inline SVG social icons
// ---------------------------------------------------------------------------

function IconTelegram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="M22 2 L11 13" stroke="currentColor" strokeWidth={1.8}
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2 L15 22 L11 13 L2 9 L22 2Z" stroke="currentColor" strokeWidth={1.8}
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8
               8.5 8.5 0 0 1-7.6 4.7
               8.38 8.38 0 0 1-3.8-.9
               L3 21 l1.9-5.7
               a8.38 8.38 0 0 1-.9-3.8
               8.5 8.5 0 0 1 4.7-7.6
               8.38 8.38 0 0 1 3.8-.9
               h.5
               a8.48 8.48 0 0 1 8 8 v.5Z" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2
               19.79 19.79 0 0 1-8.63-3.07
               A19.5 19.5 0 0 1 4.69 12
               19.79 19.79 0 0 1 1.61 3.38
               A2 2 0 0 1 3.58 1h3
               a2 2 0 0 1 2 1.72
               c.127.96.361 1.903.7 2.81
               a2 2 0 0 1-.45 2.11L7.91 8.56
               a16 16 0 0 0 6.12 6.12l1.27-1.27
               a2 2 0 0 1 2.11-.45
               c.907.339 1.85.573 2.81.7
               A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7 L12 13 L22 7" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Link group types
// ---------------------------------------------------------------------------

interface FooterLink {
  labelRu: string
  labelEn: string
  href:    string
  external?: boolean
}

// ---------------------------------------------------------------------------
// Nav link groups
// ---------------------------------------------------------------------------

const NAV_LINKS: FooterLink[] = [
  { labelRu: 'Услуги',      labelEn: 'Services',    href: '#services'   },
  { labelRu: 'Портфолио',   labelEn: 'Portfolio',   href: '#portfolio'  },
  { labelRu: 'Калькулятор', labelEn: 'Calculator',  href: '#calculator' },
  { labelRu: 'Контакты',    labelEn: 'Contacts',    href: '#contacts'   },
]

const LEGAL_LINKS: FooterLink[] = [
  {
    labelRu: 'Политика конфиденциальности',
    labelEn: 'Privacy Policy',
    href:    '/privacy-policy',
  },
  {
    labelRu: 'Обработка персональных данных',
    labelEn: 'Personal Data Policy',
    href:    '/personal-data-policy',
  },
  {
    labelRu: 'Политика cookie',
    labelEn: 'Cookie Policy',
    href:    '/cookie-policy',
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface FooterLinkItemProps {
  link:   FooterLink
  locale: 'ru' | 'en'
  small?: boolean
}

function FooterLinkItem({ link, locale, small = false }: FooterLinkItemProps) {
  const label = locale === 'en' ? link.labelEn : link.labelRu
  const externalProps = link.external
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <li>
      <a
        href={link.href}
        {...externalProps}
        className={`
          text-brand-ink/55 hover:text-brand-forest
          transition-colors duration-150
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-brand-gold rounded-sm
          ${small ? 'text-xs' : 'text-sm'}
        `}
      >
        {label}
      </a>
    </li>
  )
}

// ---------------------------------------------------------------------------
// Main footer
// ---------------------------------------------------------------------------

export function Footer() {
  const { locale } = useTranslations()

  const tagline = locale === 'en'
    ? 'Floral and event decoration across Moscow and the Moscow region. Fully turnkey — within 24 hours.'
    : 'Флористический декор и оформление мероприятий в Москве и МО. Полностью под ключ — за 24 часа.'

  const navTitle     = locale === 'en' ? 'Navigation'  : 'Навигация'
  const contactTitle = locale === 'en' ? 'Contacts'    : 'Контакты'
  const legalTitle   = locale === 'en' ? 'Legal'       : 'Документы'

  const copyrightLine = locale === 'en'
    ? `© ${new Date().getFullYear()} Si-Si. All rights reserved.`
    : `© ${new Date().getFullYear()} Si-Si. Все права защищены.`

  const disclaimer = locale === 'en'
    ? 'The website does not accept payments. All prices shown are approximate estimates only.'
    : 'Сайт не принимает платежи. Все цены на сайте носят информационный характер и являются приблизительными.'

  return (
    <footer
      aria-label={locale === 'en' ? 'Site footer' : 'Подвал сайта'}
      className="bg-brand-ink text-white"
    >
      {/* ---- Main footer grid ------------------------------------------ */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* ---- Brand block ------------------------------------------- */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Logo */}
            <a
              href="/"
              aria-label="Si-Si — на главную"
              className="
                flex items-center gap-2.5 w-fit
                text-white hover:text-brand-gold
                transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-gold rounded
              "
            >
              <SiSiLogoMark className="h-8 w-8" />
              <span className="font-display text-base font-semibold tracking-wide">
                Si-Si
              </span>
            </a>

            {/* Tagline */}
            <p className="text-sm text-white/55 leading-relaxed max-w-xs">
              {tagline}
            </p>

            {/* Social / messenger icons row */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href={`https://t.me/${CONTACT_TELEGRAM_HANDLE}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-lg bg-white/8 text-white/70
                  hover:bg-white/15 hover:text-white
                  transition-colors duration-150
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-brand-gold
                "
              >
                <IconTelegram />
              </a>

              <a
                href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-lg bg-white/8 text-white/70
                  hover:bg-white/15 hover:text-white
                  transition-colors duration-150
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-brand-gold
                "
              >
                <IconWhatsApp />
              </a>
            </div>
          </div>

          {/* ---- Navigation links -------------------------------------- */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/35">
              {navTitle}
            </h3>
            <ul role="list" className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <FooterLinkItem key={link.href} link={link} locale={locale} />
              ))}
            </ul>
          </div>

          {/* ---- Contact links ----------------------------------------- */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/35">
              {contactTitle}
            </h3>
            <ul role="list" className="flex flex-col gap-2.5">

              {/* Phone */}
              <li>
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  aria-label={CONTACT_PHONE_DISPLAY}
                  className="
                    flex items-center gap-2
                    text-sm text-brand-ink/55 text-white/55
                    hover:text-brand-gold
                    transition-colors duration-150
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-brand-gold rounded-sm
                  "
                >
                  <IconPhone />
                  <span>{CONTACT_PHONE_DISPLAY}</span>
                </a>
              </li>

              {/* Telegram */}
              <li>
                <a
                  href={`https://t.me/${CONTACT_TELEGRAM_HANDLE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="
                    flex items-center gap-2
                    text-sm text-white/55
                    hover:text-brand-gold
                    transition-colors duration-150
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-brand-gold rounded-sm
                  "
                >
                  <IconTelegram />
                  <span>@{CONTACT_TELEGRAM_HANDLE}</span>
                </a>
              </li>

              {/* WhatsApp */}
              <li>
                <a
                  href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="
                    flex items-center gap-2
                    text-sm text-white/55
                    hover:text-brand-gold
                    transition-colors duration-150
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-brand-gold rounded-sm
                  "
                >
                  <IconWhatsApp />
                  <span>WhatsApp</span>
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  aria-label={CONTACT_EMAIL}
                  className="
                    flex items-center gap-2
                    text-sm text-white/55
                    hover:text-brand-gold
                    transition-colors duration-150
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-brand-gold rounded-sm
                  "
                >
                  <IconMail />
                  <span>{CONTACT_EMAIL}</span>
                </a>
              </li>

            </ul>
          </div>

          {/* ---- Legal links ------------------------------------------- */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/35">
              {legalTitle}
            </h3>
            <ul role="list" className="flex flex-col gap-2.5">
              {LEGAL_LINKS.map((link) => (
                <FooterLinkItem key={link.href} link={link} locale={locale} />
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ---- Bottom bar ------------------------------------------------- */}
      <div className="border-t border-white/8">
        <div className="
          mx-auto max-w-6xl px-4 py-5 sm:px-6
          flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between
        ">
          <p className="text-xs text-white/35">
            {copyrightLine}
          </p>
          <p className="text-xs text-white/25 max-w-sm sm:text-right leading-relaxed">
            {disclaimer}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
