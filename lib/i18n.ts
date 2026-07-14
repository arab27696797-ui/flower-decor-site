// lib/i18n.ts
// Lightweight i18n layer — no external dependencies.
// Supports 'ru' and 'en' locales. Designed to be forward-compatible
// with Next.js route-based locale handling when needed.

import ru from './translations/ru'
import { en } from './translations/en'
import type { Translations } from './translations/ru'
import { useState, useCallback } from 'react'

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
// Module-level locale state
// ---------------------------------------------------------------------------

let _currentLocale: Locale = DEFAULT_LOCALE

export function initLocaleFromBrowser(): void {
  if (typeof navigator === 'undefined') return
  const browserLang = navigator.language?.slice(0, 2).toLowerCase()
  if (isLocale(browserLang) && _currentLocale === DEFAULT_LOCALE) {
    _currentLocale = browserLang
  }
}

export function getCurrentLocale(): Locale {
  return _currentLocale
}

export function setCurrentLocale(locale: Locale): void {
  _currentLocale = locale
}

// ---------------------------------------------------------------------------
// useTranslations React hook
// ---------------------------------------------------------------------------

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
// Server-side helper
// ---------------------------------------------------------------------------

export function getTranslationsForPage(localeParam: string | undefined): Translations {
  return getTranslations(localeParam ?? DEFAULT_LOCALE)
}

// ---------------------------------------------------------------------------
// Locale toggle helper
// ---------------------------------------------------------------------------

export function toggleLocale(current: Locale): Locale {
  return current === 'ru' ? 'en' : 'ru'
}

// ---------------------------------------------------------------------------
// SEO helpers
// ---------------------------------------------------------------------------

export function getLocalePathPrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`
}

export function getAlternateLocaleHref(
  currentPath: string,
  targetLocale: Locale,
): string {
  const prefix = getLocalePathPrefix(targetLocale)
  const cleanPath = currentPath.replace(/^\/(ru|en)/, '')
  return `${prefix}${cleanPath || '/'}`
}
