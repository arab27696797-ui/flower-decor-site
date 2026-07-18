'use client'

// components/site/cookie-banner.tsx
// Si-Si — cookie consent banner.
// Slides up on first visit; persists choice in localStorage.
// Dismisses itself permanently after acceptance.

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useTranslations } from '@/lib/i18n'

const STORAGE_KEY = 'sisi-cookie-consent-v1'

export function CookieBanner() {
  const { locale } = useTranslations()
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)

  // Show only when no stored choice exists
  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === null) {
        const timer = setTimeout(() => setVisible(true), 1800)
        return () => clearTimeout(timer)
      }
    } catch {
      // localStorage unavailable (private mode) — show banner anyway
      setVisible(true)
    }
  }, [])

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {
      /* noop */
    }
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 32 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          role="dialog"
          aria-live="polite"
          aria-label={locale === 'en' ? 'Cookie notice' : 'Уведомление о cookie'}
          className="
            fixed bottom-4 left-4 right-4 z-[90]
            sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md
          "
        >
          <div className="glass-card rounded-card p-5 shadow-dark-card">
            <div className="flex items-start gap-3.5">
              {/* Cookie icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/25 bg-brand-gold/[0.08] text-brand-gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                  <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z" />
                  <path d="M8.5 8.5v.01" />
                  <path d="M16 15.5v.01" />
                  <path d="M12 12v.01" />
                  <path d="M11 17v.01" />
                  <path d="M7 14v.01" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-brand-parchment">
                  {locale === 'en' ? 'We use cookies' : 'Мы используем cookie'}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-brand-stone">
                  {locale === 'en' ? (
                    <>
                      They help the site work and let us understand how it is used. Details in the{' '}
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          rounded-sm text-brand-gold-dark underline underline-offset-2
                          transition-colors duration-150 hover:text-brand-gold
                        "
                      >
                        privacy policy
                      </a>
                      .
                    </>
                  ) : (
                    <>
                      Они нужны для работы сайта и помогают понять, как им пользуются. Подробнее — в{' '}
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          rounded-sm text-brand-gold-dark underline underline-offset-2
                          transition-colors duration-150 hover:text-brand-gold
                        "
                      >
                        политике конфиденциальности
                      </a>
                      .
                    </>
                  )}
                </p>

                <div className="mt-3.5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={accept}
                    className="
                      inline-flex min-h-9 items-center justify-center rounded-btn
                      border border-brand-gold/70 bg-brand-gold px-4 py-1.5
                      text-xs font-semibold text-brand-midnight
                      transition-all duration-150 hover:bg-brand-gold-light
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold
                    "
                  >
                    {locale === 'en' ? 'Accept & continue' : 'Принять и продолжить'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieBanner
