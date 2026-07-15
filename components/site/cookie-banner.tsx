'use client'

// components/site/cookie-banner.tsx
// Si-Si — Cookie consent banner.
// Compliant with Russian 152-FZ personal data requirements.
// Shown on first visit; dismissed on accept.
// Persistence: localStorage with a graceful in-memory fallback
// (localStorage may be blocked in sandboxed iframes — the fallback
// keeps the banner hidden for the session without crashing).
// Position: fixed bottom bar — does NOT block the viewport.
// Accessible: role="region", aria-label, focus-visible rings.

import React, { useState, useEffect, useCallback } from 'react'
import { useTranslations } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Storage key
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'sisi_cookie_consent_v1'

// ---------------------------------------------------------------------------
// Safe storage helpers — graceful fallback when localStorage is unavailable
// ---------------------------------------------------------------------------

function safeStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeStorageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Silently fail — in-memory state handles the session
  }
}

// ---------------------------------------------------------------------------
// Cookie Banner component
// ---------------------------------------------------------------------------

export function CookieBanner() {
  const { locale } = useTranslations()

  // ---- Visibility state ---------------------------------------------------
  // Start hidden (false) to avoid flash on SSR hydration.
  // After mount we check storage and show if consent not yet given.
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const already = safeStorageGet(STORAGE_KEY)
    if (!already) {
      // Small delay so the banner appears after page paint, not immediately
      const timer = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  // ---- Accept handler -----------------------------------------------------
  const handleAccept = useCallback(() => {
    safeStorageSet(STORAGE_KEY, 'accepted')
    setVisible(false)
  }, [])

  // ---- Do not render anything on server or when already accepted ----------
  if (!mounted || !visible) return null

  // ---- Localised strings --------------------------------------------------
  const text = locale === 'en'
    ? 'We use cookies and similar technologies to ensure the website works correctly, analyse traffic, and improve the user experience. By continuing to use the site, you consent to their use in accordance with our'
    : 'Мы используем файлы cookie и аналогичные технологии для корректной работы сайта, анализа трафика и улучшения пользовательского опыта. Продолжая использовать сайт, вы даёте согласие на их обработку в соответствии с нашей'

  const policyLinkText = locale === 'en'
    ? 'Privacy Policy'
    : 'Политикой конфиденциальности'

  const acceptLabel = locale === 'en'
    ? 'Accept and continue'
    : 'Принять и продолжить'

  const policyHref = '/privacy-policy'

  const regionLabel = locale === 'en'
    ? 'Cookie consent notice'
    : 'Уведомление об использовании файлов cookie'

  // -------------------------------------------------------------------------
  return (
    <div
      role="region"
      aria-label={regionLabel}
      aria-live="polite"
      className="
        fixed bottom-0 left-0 right-0 z-50
        px-4 pb-4 pt-0
        pointer-events-none
      "
    >
      {/* Inner banner — pointer-events re-enabled on the card only */}
      <div
        className="
          pointer-events-auto
          mx-auto max-w-3xl
          rounded-xl border border-brand-ink/10
          bg-white/95 backdrop-blur-md
          shadow-lg
          px-5 py-4
          flex flex-col gap-3
          sm:flex-row sm:items-center sm:gap-5
          animate-slide-up
        "
        style={{
          // Inline animation fallback for environments where
          // Tailwind animate-slide-up is not configured
          animation: 'sisi-slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        }}
      >
        {/* ---- Icon ---------------------------------------------------- */}
        <span
          aria-hidden="true"
          className="
            hidden sm:flex
            h-9 w-9 shrink-0 items-center justify-center
            rounded-lg bg-brand-forest/8 text-brand-forest
          "
        >
          <svg
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
            className="h-4 w-4" aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8 v4 M12 16 h.01" />
          </svg>
        </span>

        {/* ---- Text ----------------------------------------------------- */}
        <p className="text-xs text-brand-ink/65 leading-relaxed flex-1">
          {text}{' '}
          <a
            href={policyHref}
            className="
              text-brand-forest underline underline-offset-2
              hover:text-brand-forest/80
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-brand-gold rounded-sm
              transition-colors duration-150
            "
          >
            {policyLinkText}
          </a>
          {locale === 'ru' ? '.' : '.'}
        </p>

        {/* ---- Accept button ------------------------------------------- */}
        <button
          type="button"
          onClick={handleAccept}
          aria-label={acceptLabel}
          className="
            shrink-0 self-start sm:self-auto
            rounded-lg bg-brand-forest px-4 py-2
            text-xs font-semibold text-white
            hover:bg-brand-forest/90 active:bg-brand-forest/80
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-brand-gold focus-visible:ring-offset-2
            whitespace-nowrap
          "
        >
          {acceptLabel}
        </button>
      </div>

      {/* ---- Keyframe definition — scoped inline to avoid globals dependency */}
      <style>{`
        @keyframes sisi-slide-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes sisi-slide-up {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        }
      `}</style>
    </div>
  )
}

export default CookieBanner
