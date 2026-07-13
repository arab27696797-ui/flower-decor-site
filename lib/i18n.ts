// lib/i18n.ts
// Lightweight i18n layer — no external dependencies.
// Supports 'ru' and 'en' locales. Designed to be forward-compatible
// with Next.js route-based locale handling when needed.

import { ru } from './translations/ru'
import { en } from './translations/en'
import type { Translations } from './translations/ru'

// ---------------------------------------------------------------------------
// Locale types and constants
// ---------------------------------------------------------------------------

export type Locale = 'ru' | 'en'

export const LOCALES: Locale[] = ['ru', 'en']

export const DEFAULT_LOCALE: Locale = 'ru'

// ---------------------------------------------------------------------------
// Translation map — single lookup table
// ---------------------------------------------------------------------------

const translationMap: Record<Locale, Translations> = { ru, en }

// ---------------------------------------------------------------------------
// Core resolver — returns the full translation object for a given locale.
// Falls back to DEFAULT_LOCALE if an unsupported locale is passed.
// ---------------------------------------------------------------------------

export function getTranslations(locale: Locale | string): Translations {
  const safe = isLocale(locale) ? locale : DEFAULT_LOCALE
  return translationMap[safe]
}

// ---------------------------------------------------------------------------
// Type guard — checks if an unknown string is a valid Locale
// ---------------------------------------------------------------------------

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as string[]).includes(value)
}

// ---------------------------------------------------------------------------
// Locale metadata — display names for the language switcher
// ---------------------------------------------------------------------------

export const LOCALE_LABELS: Record<Locale, string> = {
  ru: 'RU',
  en: 'EN',
}

export const LOCALE_FULL_NAMES: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
}

// ---------------------------------------------------------------------------
// HTML lang attribute values — for <html lang="..."> in layout
// ---------------------------------------------------------------------------

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  ru: 'ru',
  en: 'en',
}

// ---------------------------------------------------------------------------
// String interpolation helper — replaces {key} tokens in translated strings.
//
// Usage:
//   interpolate(t.footer.copyright, { year: '2025' })
//   // → '© 2025 Флоральный декор. Все права защищены.'
// ---------------------------------------------------------------------------

export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in values ? String(values[key]) : `{${key}}`,
  )
}

// ---------------------------------------------------------------------------
// React hook — useTranslations
//
// Usage in a client component:
//
//   const { t, locale, setLocale } = useTranslations()
//   // or with a locale prop drilled from a server component:
//   const { t } = useTranslations(locale)
//
// The hook reads/writes locale from a module-level variable so it
// persists across re-renders without requiring a Context provider.
// This is intentional: the site is a single-language-at-a-time view.
// If route-based locale is added later, replace the module variable
// with a proper Context or zustand slice.
// ---------------------------------------------------------------------------

// Module-level current locale — shared across all hook calls.
// Initialised from browser language preference when possible.
let _currentLocale: Locale = DEFAULT_LOCALE

/**
 * Initialise locale from browser / navigator preference.
 * Call once in the root client layout or _app equivalent.
 * Safe to call multiple times — subsequent calls are no-ops if
 * locale was already set by the user manually.
 */
export function initLocaleFromBrowser(): void {
  if (typeof navigator === 'undefined') return
  const browserLang = navigator.language?.slice(0, 2).toLowerCase()
  if (isLocale(browserLang) && _currentLocale === DEFAULT_LOCALE) {
    _currentLocale = browserLang
  }
}

/**
 * Imperatively read the current locale.
 * Useful in non-React contexts (e.g. the Telegram formatter, API helpers).
 */
export function getCurrentLocale(): Locale {
  return _currentLocale
}

/**
 * Imperatively set the current locale.
 * Call from the language switcher onClick before triggering a re-render.
 */
export function setCurrentLocale(locale: Locale): void {
  _currentLocale = locale
}

// ---------------------------------------------------------------------------
// useTranslations React hook
//
// Two calling conventions:
//   1. useTranslations()           — reads from module-level locale state
//   2. useTranslations(locale)     — uses a fixed locale (server-component pattern)
// ---------------------------------------------------------------------------

// Lazy import of React hooks — avoids importing React in non-React files
// that also import from lib/i18n.ts (e.g. lib/telegram.ts).
// The hook itself is a named export; non-React callers use getTranslations() directly.

import { useState, useCallback } from 'react'

export function useTranslations(fixedLocale?: Locale): {
  t: Translations
  locale: Locale
  setLocale: (locale: Locale) => void
  interpolate: typeof interpolate
} {
  const [locale, setLocaleState] = useState<Locale>(
    fixedLocale ?? _currentLocale,
  )

  const setLocale = useCallback((next: Locale) => {
    _currentLocale = next
    setLocaleState(next)

    // Sync <html lang="..."> attribute for accessibility and SEO
    if (typeof document !== 'undefined') {
      document.documentElement.lang = LOCALE_HTML_LANG[next]
    }
  }, [])

  const t = fixedLocale
    ? getTranslations(fixedLocale)
    : getTranslations(locale)

  return { t, locale, setLocale, interpolate }
}

// ---------------------------------------------------------------------------
// Server-side helper — resolves locale from Next.js params or searchParams.
//
// Usage in a Next.js Server Component:
//
//   // app/[locale]/page.tsx
//   export default function Page({ params }: { params: { locale: string } }) {
//     const t = getTranslationsForPage(params.locale)
//     return <HeroSection t={t} />
//   }
// ---------------------------------------------------------------------------

export function getTranslationsForPage(localeParam: string | undefined): Translations {
  return getTranslations(localeParam ?? DEFAULT_LOCALE)
}

// ---------------------------------------------------------------------------
// Locale toggle helper — returns the other locale (for the language switcher)
// ---------------------------------------------------------------------------

export function toggleLocale(current: Locale): Locale {
  return current === 'ru' ? 'en' : 'ru'
}

// ---------------------------------------------------------------------------
// SEO helpers — canonical locale path prefix
//
// Currently returns '' for 'ru' (default, no prefix) and '/en' for 'en'.
// Adjust when route-based locale is implemented.
// ---------------------------------------------------------------------------

export function getLocalePathPrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`
}

export function getAlternateLocaleHref(
  currentPath: string,
  targetLocale: Locale,
): string {
  const prefix = getLocalePathPrefix(targetLocale)
  // Strip existing locale prefix before adding the new one
  const cleanPath = currentPath.replace(/^\/(ru|en)/, '')
  return `${prefix}${cleanPath || '/'}`
}
