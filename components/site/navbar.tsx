'use client'

// components/site/navbar.tsx
// Si-Si — glass navbar, "Noir" theme.
// Transparent over the hero → frosted glass after 24px of scroll.
// Mobile: animated full-screen overlay menu (AnimatePresence).
// Includes working RU/EN switcher (site-wide via the i18n subscription fix).

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useTranslations, toggleLocale, LOCALE_LABELS } from '@/lib/i18n'

const NAV_LINKS = [
  { href: '#services',   ru: 'Услуги',     en: 'Services' },
  { href: '#portfolio',  ru: 'Портфолио',  en: 'Portfolio' },
  { href: '#calculator', ru: 'Калькулятор', en: 'Calculator' },
  { href: '#contacts',   ru: 'Контакты',   en: 'Contacts' },
]

export function Navbar() {
  const { locale, setLocale } = useTranslations()
  const reduceMotion = useReducedMotion()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <header
        className={`
          fixed inset-x-0 top-0 z-navbar transition-all duration-300 ease-out-expo
          ${isScrolled
            ? 'border-b border-brand-parchment/[0.07] bg-brand-onyx/80 backdrop-blur-nav'
            : 'border-b border-transparent bg-transparent'}
        `}
      >
        <div
          className={`
            mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8
            transition-all duration-300 ease-out-expo
            ${isScrolled ? 'py-3' : 'py-5'}
          `}
        >
          {/* Wordmark */}
          <a
            href="#hero"
            className="font-display text-2xl font-semibold tracking-tight text-brand-parchment"
            aria-label="Si-Si — на главную"
          >
            Si<span className="text-brand-gold">–</span>Si
          </a>

          {/* Desktop links */}
          <nav aria-label={locale === 'en' ? 'Main navigation' : 'Основная навигация'} className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="
                  group relative text-sm font-medium text-brand-stone
                  transition-colors duration-200 hover:text-brand-parchment
                "
              >
                {locale === 'en' ? link.en : link.ru}
                <span
                  aria-hidden="true"
                  className="
                    absolute -bottom-1 left-0 h-px w-0 bg-brand-gold
                    transition-all duration-250 ease-out-expo
                    group-hover:w-full
                  "
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Locale switcher */}
            <button
              type="button"
              onClick={() => setLocale(toggleLocale(locale))}
              aria-label={locale === 'en' ? 'Switch to Russian' : 'Switch to English'}
              className="
                rounded-full border border-brand-parchment/15 px-3 py-1.5
                text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-stone
                transition-colors duration-200
                hover:border-brand-gold/40 hover:text-brand-gold
              "
            >
              {LOCALE_LABELS[locale === 'ru' ? 'en' : 'ru']}
            </button>

            {/* CTA */}
            <a
              href="#contact"
              className="
                btn-gold-sheen animate-sheen
                hidden min-h-10 items-center rounded-card px-5 py-2
                text-sm font-semibold text-brand-onyx shadow-gold-glow
                transition-transform duration-200 ease-out-expo hover:-translate-y-0.5
                sm:inline-flex
              "
            >
              {locale === 'en' ? 'Leave a request' : 'Оставить заявку'}
            </a>

            {/* Mobile burger */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label={locale === 'en' ? 'Open menu' : 'Открыть меню'}
              aria-expanded={isOpen}
              className="
                inline-flex h-10 w-10 items-center justify-center rounded-card
                border border-brand-parchment/15 text-brand-parchment md:hidden
              "
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.25 }}
            className="fixed inset-0 z-overlay flex flex-col bg-brand-onyx/97 backdrop-blur-xl md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={locale === 'en' ? 'Menu' : 'Меню'}
          >
            <div className="flex items-center justify-between px-4 py-5">
              <span className="font-display text-2xl font-semibold text-brand-parchment">
                Si<span className="text-brand-gold">–</span>Si
              </span>
              <button
                type="button"
                onClick={closeMenu}
                aria-label={locale === 'en' ? 'Close menu' : 'Закрыть меню'}
                className="inline-flex h-10 w-10 items-center justify-center rounded-card border border-brand-parchment/15 text-brand-parchment"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0.1 : 0.4,
                    delay: reduceMotion ? 0 : 0.06 * i,
                    ease: 'easeOut',
                  }}
                  className="border-b border-brand-parchment/[0.07] py-4 font-display text-3xl text-brand-parchment transition-colors hover:text-brand-gold"
                >
                  {locale === 'en' ? link.en : link.ru}
                </motion.a>
              ))}

              <motion.a
                href="#contact"
                onClick={closeMenu}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0.1 : 0.4,
                  delay: reduceMotion ? 0 : 0.06 * NAV_LINKS.length,
                  ease: 'easeOut',
                }}
                className="
                  btn-gold-sheen animate-sheen mt-8 inline-flex min-h-12
                  items-center justify-center rounded-card px-7 py-3.5
                  text-sm font-semibold text-brand-onyx shadow-gold-glow
                "
              >
                {locale === 'en' ? 'Leave a request' : 'Оставить заявку'}
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
