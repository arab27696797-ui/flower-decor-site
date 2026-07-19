'use client'

// components/site/navbar.tsx
// Si-Si — Sticky public navbar, light festive theme.
// Sections: logo (scrolls to top), anchor links, CTA button, RU/EN toggle.
// Mobile: hamburger opens full-screen overlay with the same links.
// All interactive elements meet the 44px touch-target requirement.

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useTranslations } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Anchor link model — href matches section ids in app/page.tsx
// ---------------------------------------------------------------------------

const NAV_LINKS = [
  { href: '#services',   ru: 'Услуги',     en: 'Services'   },
  { href: '#portfolio',  ru: 'Портфолио',  en: 'Portfolio'  },
  { href: '#calculator', ru: 'Калькулятор', en: 'Calculator' },
  { href: '#contacts',   ru: 'Контакты',   en: 'Contacts'   },
] as const

export function Navbar() {
  const { locale, setLocale } = useTranslations()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduceMotion = useReducedMotion()

  // Track scroll to add a subtle glass background once the hero is passed
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const toggleLocale = () => setLocale(locale === 'ru' ? 'en' : 'ru')

  return (
    <>
      <header
        className={`
          fixed inset-x-0 top-0 z-[100]
          transition-all duration-300 ease-out-expo
          ${
            scrolled
              ? 'border-b border-brand-parchment/[0.08] bg-brand-onyx/85 shadow-[0_4px_24px_rgba(51,35,26,0.06)] backdrop-blur-md'
              : 'bg-transparent'
          }
        `}
      >
        <nav
          aria-label={locale === 'en' ? 'Main navigation' : 'Основная навигация'}
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:h-[4.5rem] lg:px-8"
        >
          {/* Logo — click scrolls to top */}
          <a
            href="#hero"
            onClick={closeMenu}
            className="group flex min-h-11 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            aria-label={locale === 'en' ? 'Si-Si — back to top' : 'Si-Si — наверх'}
          >
            {/* Blossom mark */}
            <svg
              viewBox="0 0 40 40"
              className="h-8 w-8 shrink-0 transition-transform duration-300 group-hover:rotate-12"
              aria-hidden="true"
            >
              <g>
                <ellipse cx="20" cy="10" rx="5" ry="8" fill="#E7AAB9" />
                <ellipse cx="20" cy="10" rx="5" ry="8" fill="#E7AAB9" transform="rotate(72 20 20)" />
                <ellipse cx="20" cy="10" rx="5" ry="8" fill="#E7AAB9" transform="rotate(144 20 20)" />
                <ellipse cx="20" cy="10" rx="5" ry="8" fill="#E7AAB9" transform="rotate(216 20 20)" />
                <ellipse cx="20" cy="10" rx="5" ry="8" fill="#E7AAB9" transform="rotate(288 20 20)" />
                <circle cx="20" cy="20" r="4.5" fill="#C8A96E" />
              </g>
            </svg>
            <span className="font-display text-xl font-semibold tracking-tight text-brand-parchment">
              Si-Si
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="min-h-11 rounded-md px-3.5 py-2.5 text-sm font-medium text-brand-stone transition-colors duration-200 hover:text-brand-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                {locale === 'en' ? link.en : link.ru}
              </a>
            ))}
          </div>

          {/* Right cluster — language toggle + CTA (desktop) */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={toggleLocale}
              aria-label={locale === 'en' ? 'Switch to Russian' : 'Switch to English'}
              className="min-h-11 min-w-11 rounded-md border border-brand-parchment/10 bg-brand-parchment/[0.04] px-3 text-xs font-semibold uppercase tracking-wider text-brand-stone transition-colors duration-200 hover:border-brand-gold/40 hover:text-brand-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              {locale === 'en' ? 'RU' : 'EN'}
            </button>

            <a
              href="#calculator"
              className="btn-gold-sheen sheen-always inline-flex min-h-11 items-center gap-2 rounded-btn px-5 py-2.5 text-sm font-semibold text-brand-ink shadow-gold-glow transition-transform duration-200 ease-out-expo hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-onyx"
            >
              {locale === 'en' ? 'Get an estimate' : 'Рассчитать'}
            </a>
          </div>

          {/* Mobile — language toggle + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleLocale}
              aria-label={locale === 'en' ? 'Switch to Russian' : 'Switch to English'}
              className="min-h-11 min-w-11 rounded-md border border-brand-parchment/10 bg-brand-parchment/[0.04] px-3 text-xs font-semibold uppercase tracking-wider text-brand-stone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              {locale === 'en' ? 'RU' : 'EN'}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={
                menuOpen
                  ? locale === 'en' ? 'Close menu' : 'Закрыть меню'
                  : locale === 'en' ? 'Open menu' : 'Открыть меню'
              }
              className="flex min-h-11 min-w-11 items-center justify-center rounded-md border border-brand-parchment/10 bg-brand-parchment/[0.04] text-brand-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h10" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={locale === 'en' ? 'Menu' : 'Меню'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[90] flex flex-col bg-brand-onyx/97 pt-20 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, x: reduceMotion ? 0 : -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 + i * 0.05, ease: 'easeOut' }}
                  className="flex min-h-12 items-center border-b border-brand-parchment/[0.06] py-3 font-display text-2xl font-semibold text-brand-parchment transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                >
                  {locale === 'en' ? link.en : link.ru}
                </motion.a>
              ))}

              <motion.a
                href="#calculator"
                onClick={closeMenu}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }}
                className="btn-gold-sheen sheen-always mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-btn px-7 py-3.5 text-sm font-semibold text-brand-ink shadow-gold-glow"
              >
                {locale === 'en' ? 'Get an estimate' : 'Рассчитать стоимость'}
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
