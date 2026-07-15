'use client'

// components/site/navbar.tsx
// Si-Si — sticky responsive navbar.
// Desktop: logo | nav links | lang switcher | CTA call button.
// Mobile: logo | lang switcher | hamburger → slide-down menu with nav + CTA.
// Language switching is wired directly to useTranslations setLocale + toggleLocale.
// Scroll-aware: adds a shadow + frosted backdrop when page is scrolled.

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslations, toggleLocale, LOCALE_LABELS } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Nav link definitions — anchor-based single-page navigation
// ---------------------------------------------------------------------------

interface NavLink {
  labelRu: string
  labelEn: string
  href:    string
}

const NAV_LINKS: NavLink[] = [
  { labelRu: 'Услуги',     labelEn: 'Services',   href: '#services'   },
  { labelRu: 'Портфолио',  labelEn: 'Portfolio',  href: '#portfolio'  },
  { labelRu: 'Калькулятор',labelEn: 'Calculator', href: '#calculator' },
  { labelRu: 'Контакты',   labelEn: 'Contacts',   href: '#contacts'   },
]

// ---------------------------------------------------------------------------
// Phone — replace with dynamic contact config when contacts admin is built
// ---------------------------------------------------------------------------

const CONTACT_PHONE_DISPLAY = '+7 (999) 000-00-00'
const CONTACT_PHONE_TEL     = '+79990000000'

// ---------------------------------------------------------------------------
// Hamburger icon — animated open/close
// ---------------------------------------------------------------------------

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className="h-5 w-5 transition-transform duration-200"
      aria-hidden="true"
    >
      {open ? (
        // × close
        <>
          <line x1="5"  y1="5"  x2="19" y2="19" />
          <line x1="19" y1="5"  x2="5"  y2="19" />
        </>
      ) : (
        // ≡ open
        <>
          <line x1="4" y1="7"  x2="20" y2="7"  />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </>
      )}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Main navbar
// ---------------------------------------------------------------------------

export function Navbar() {
  const { t, locale, setLocale } = useTranslations()

  const [menuOpen,   setMenuOpen]   = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const menuRef    = useRef<HTMLDivElement>(null)
  const toggleRef  = useRef<HTMLButtonElement>(null)

  // ---- Scroll detection ---------------------------------------------------
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ---- Close mobile menu on outside click ---------------------------------
  useEffect(() => {
    if (!menuOpen) return

    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current   && !menuRef.current.contains(e.target as Node) &&
        toggleRef.current && !toggleRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  // ---- Close menu on Escape -----------------------------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // ---- Close menu when a nav link is clicked ------------------------------
  const handleNavClick = useCallback(() => {
    setMenuOpen(false)
  }, [])

  // ---- Language toggle ----------------------------------------------------
  const handleLangToggle = useCallback(() => {
    setLocale(toggleLocale(locale))
  }, [locale, setLocale])

  // ---- Helpers ------------------------------------------------------------
  const navLabel = (link: NavLink) =>
    locale === 'en' ? link.labelEn : link.labelRu

  const ctaLabel = locale === 'en' ? 'Call us' : 'Позвонить'

  const altLangLabel = LOCALE_LABELS[toggleLocale(locale)]

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${isScrolled
          ? 'bg-brand-cream/95 backdrop-blur-md shadow-sm border-b border-brand-ink/8'
          : 'bg-brand-cream/80 backdrop-blur-sm'
        }
      `}
    >
      <nav
        aria-label={locale === 'en' ? 'Main navigation' : 'Главная навигация'}
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
      >

        {/* ---- Logo ---------------------------------------------------- */}
        <a
          href="/"
          aria-label="Si-Si — на главную"
          className="
            flex items-center gap-2.5 shrink-0
            text-brand-forest hover:text-brand-forest/80
            transition-colors focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-brand-gold rounded
          "
        >
          <span className="font-display text-lg font-semibold tracking-tight text-brand-forest leading-none">
            Si-<span className="font-light ml-1 text-brand-gold">Si</span>
          </span>
        </a>

        {/* ---- Desktop nav -------------------------------------------- */}
        <ul
          role="list"
          className="hidden md:flex items-center gap-1"
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="
                  px-3 py-2 rounded-md
                  text-sm font-medium text-brand-ink/70
                  hover:text-brand-forest hover:bg-brand-forest/5
                  transition-colors duration-150
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-brand-gold
                "
              >
                {navLabel(link)}
              </a>
            </li>
          ))}
        </ul>

        {/* ---- Desktop right controls ---------------------------------- */}
        <div className="hidden md:flex items-center gap-3">

          {/* Language switcher */}
          <button
            type="button"
            onClick={handleLangToggle}
            aria-label={
              locale === 'en'
                ? 'Switch to Russian'
                : 'Переключить на английский'
            }
            className="
              flex items-center gap-1 px-2.5 py-1.5 rounded-md
              text-xs font-semibold tracking-widest
              text-brand-ink/55 border border-brand-ink/15
              hover:text-brand-forest hover:border-brand-gold/50
              hover:bg-brand-forest/5
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-brand-gold
            "
          >
            {LOCALE_LABELS[locale]}
            <span
              className="text-brand-ink/30 font-light select-none"
              aria-hidden="true"
            >
              /
            </span>
            <span className="text-brand-ink/35">{altLangLabel}</span>
          </button>

          {/* CTA: call */}
          <a
            href={`tel:${CONTACT_PHONE_TEL}`}
            aria-label={
              locale === 'en'
                ? `Call Si-Si: ${CONTACT_PHONE_DISPLAY}`
                : `Позвонить Si-Si: ${CONTACT_PHONE_DISPLAY}`
            }
            className="
              flex items-center gap-2 rounded-lg
              bg-brand-forest px-4 py-2
              text-sm font-semibold text-white
              hover:bg-brand-forest/90 active:bg-brand-forest/80
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-brand-gold focus-visible:ring-offset-2
            "
          >
            {/* Phone icon — inline SVG */}
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z"
                clipRule="evenodd"
              />
            </svg>
            {ctaLabel}
          </a>
        </div>

        {/* ---- Mobile right controls ----------------------------------- */}
        <div className="flex md:hidden items-center gap-2">

          {/* Language switcher — compact on mobile */}
          <button
            type="button"
            onClick={handleLangToggle}
            aria-label={
              locale === 'en'
                ? 'Switch to Russian'
                : 'Переключить на английский'
            }
            className="
              px-2 py-1.5 rounded-md
              text-xs font-semibold tracking-widest
              text-brand-ink/55 border border-brand-ink/15
              hover:text-brand-forest hover:border-brand-gold/50
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-brand-gold
            "
          >
            {altLangLabel}
          </button>

          {/* Hamburger toggle */}
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={
              menuOpen
                ? (locale === 'en' ? 'Close menu' : 'Закрыть меню')
                : (locale === 'en' ? 'Open menu'  : 'Открыть меню')
            }
            onClick={() => setMenuOpen((v) => !v)}
            className="
              flex h-9 w-9 items-center justify-center rounded-md
              text-brand-ink/70 hover:text-brand-forest hover:bg-brand-forest/8
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-brand-gold
            "
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>
      </nav>

      {/* ---- Mobile menu -------------------------------------------------- */}
      {/* Slide-down panel — controlled visibility with CSS transition */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="region"
        aria-label={locale === 'en' ? 'Mobile navigation' : 'Мобильная навигация'}
        className={`
          md:hidden overflow-hidden
          border-t border-brand-ink/8
          bg-brand-cream/98 backdrop-blur-md
          transition-all duration-300 ease-in-out
          ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
        `}
      >
        <div className="mx-auto max-w-6xl px-4 py-4 space-y-1">

          {/* Nav links */}
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="
                flex items-center px-3 py-2.5 rounded-lg
                text-sm font-medium text-brand-ink/75
                hover:text-brand-forest hover:bg-brand-forest/6
                transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-gold
              "
            >
              {navLabel(link)}
            </a>
          ))}

          {/* Divider */}
          <div className="my-2 border-t border-brand-ink/8" />

          {/* CTA call button — full width on mobile */}
          <a
            href={`tel:${CONTACT_PHONE_TEL}`}
            onClick={handleNavClick}
            aria-label={
              locale === 'en'
                ? `Call Si-Si: ${CONTACT_PHONE_DISPLAY}`
                : `Позвонить: ${CONTACT_PHONE_DISPLAY}`
            }
            className="
              flex items-center justify-center gap-2
              w-full rounded-lg bg-brand-forest px-4 py-3
              text-sm font-semibold text-white
              hover:bg-brand-forest/90 active:bg-brand-forest/80
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-brand-gold
            "
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z"
                clipRule="evenodd"
              />
            </svg>
            {CONTACT_PHONE_DISPLAY}
          </a>

          {/* Brand micro-promise */}
          <p className="px-3 pt-1 text-xs text-brand-ink/40 text-center leading-relaxed">
            {locale === 'en'
              ? 'Full-service decoration · Moscow & MO · 24 h'
              : 'Оформление под ключ · Москва и МО · 24 часа'}
          </p>
        </div>
      </div>
    </header>
  )
}

export default Navbar
