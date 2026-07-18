'use client'

// components/site/calculator/calculator-summary.tsx
// Shared summary / estimate cart component for the multi-accumulative
// calculator — "Si-Si Noir" dark glass restyle.
// Logic unchanged: reads items from the zustand cart store, renders each
// category line, supports remove/clear, CTA submits via onSubmitRequest
// when provided, otherwise smooth-scrolls to #contact (the cart reaches
// the lead form through the shared store via LeadFormWithCart).

import React from 'react'

import type { EstimateCart, CartItem } from '@/lib/calculator-config'
import {
  useCalculatorCart,
  selectCartHasItems,
  selectFormattedTotal,
  selectItemCount,
} from '@/components/site/calculator/calculator-cart'
import { useTranslations } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CalculatorSummaryProps {
  /**
   * Called when the user clicks the primary CTA ("Submit request / Continue").
   * Receives the current EstimateCart snapshot so the lead form can pre-fill
   * calculator context without needing its own zustand access.
   */
  onSubmitRequest?: (cart: EstimateCart) => void

  /**
   * Optional: if true, renders in a compact mode (fewer details per item).
   */
  compact?: boolean
}

// ---------------------------------------------------------------------------
// Sub-component: single cart item row
// ---------------------------------------------------------------------------

interface CartItemRowProps {
  item: CartItem
  locale: 'ru' | 'en'
  compact: boolean
  onRemove: (id: string) => void
}

function CartItemRow({ item, locale, compact, onRemove }: CartItemRowProps) {
  const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽'

  const label = locale === 'en'
    ? (item.categoryLabelEn ?? item.categoryLabelRu)
    : item.categoryLabelRu

  return (
    <li className="flex flex-col gap-2 border-b border-brand-midnight-border/70 py-3 last:border-b-0">
      {/* Category label + remove button */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-brand-parchment">
          {label}
        </span>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={
            locale === 'en'
              ? `Remove ${label} from estimate`
              : `Удалить «${label}» из сметы`
          }
          className="
            shrink-0 rounded text-xs text-brand-stone/70
            transition-colors hover:text-red-600
            focus-visible:outline-none focus-visible:ring-1
            focus-visible:ring-brand-gold
          "
        >
          {locale === 'en' ? 'Remove' : 'Удалить'}
        </button>
      </div>

      {/* Selections — hidden in compact mode */}
      {!compact && (
        <ul className="space-y-1">
          {item.selections.map((sel) => {
            // Skip toggle fields that are set to false — they add noise
            if (typeof sel.selectedValue === 'boolean' && !sel.selectedValue) {
              return null
            }
            return (
              <li
                key={sel.fieldId}
                className="flex justify-between gap-3 text-xs text-brand-stone"
              >
                <span>
                  {locale === 'en' ? sel.labelEn : sel.labelRu}
                </span>
                <span className="text-right font-medium text-brand-parchment/85">
                  {locale === 'en' ? sel.selectedLabelEn : sel.selectedLabelRu}
                </span>
              </li>
            )
          })}
        </ul>
      )}

      {/* Subtotal */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-brand-stone/70">
          {locale === 'en' ? 'Subtotal' : 'Подытог'}
        </span>
        <span className="text-sm font-semibold text-brand-gold-light">
          {fmt(item.subtotalWithMarkup)}
        </span>
      </div>
    </li>
  )
}

// ---------------------------------------------------------------------------
// Sub-component: empty state
// ---------------------------------------------------------------------------

function EmptyState({ locale }: { locale: 'ru' | 'en' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="text-brand-gold/60"
      >
        <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.6" />
        <ellipse cx="20" cy="10" rx="3" ry="6" fill="currentColor" opacity="0.3" />
        <ellipse cx="20" cy="30" rx="3" ry="6" fill="currentColor" opacity="0.3" />
        <ellipse cx="10" cy="20" rx="6" ry="3" fill="currentColor" opacity="0.3" />
        <ellipse cx="30" cy="20" rx="6" ry="3" fill="currentColor" opacity="0.3" />
        <ellipse cx="13" cy="13" rx="3" ry="6" fill="currentColor" opacity="0.2"
          transform="rotate(45 13 13)" />
        <ellipse cx="27" cy="13" rx="3" ry="6" fill="currentColor" opacity="0.2"
          transform="rotate(-45 27 13)" />
        <ellipse cx="13" cy="27" rx="3" ry="6" fill="currentColor" opacity="0.2"
          transform="rotate(-45 13 27)" />
        <ellipse cx="27" cy="27" rx="3" ry="6" fill="currentColor" opacity="0.2"
          transform="rotate(45 27 27)" />
      </svg>

      <p className="text-sm font-medium text-brand-parchment/80">
        {locale === 'en'
          ? 'Your estimate is empty'
          : 'Смета пока пустая'}
      </p>
      <p className="max-w-[26ch] text-xs leading-relaxed text-brand-stone">
        {locale === 'en'
          ? 'Select one or more categories on the left to build your estimate.'
          : 'Выберите одну или несколько категорий слева, чтобы собрать смету.'}
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CalculatorSummary({
  onSubmitRequest,
  compact = false,
}: CalculatorSummaryProps) {
  const { locale } = useTranslations()

  // Zustand selectors — targeted to avoid full re-renders
  const items           = useCalculatorCart((s) => s.items)
  const hasItems        = useCalculatorCart(selectCartHasItems)
  const formattedTotal  = useCalculatorCart(selectFormattedTotal)
  const itemCount       = useCalculatorCart(selectItemCount)
  const removeItem      = useCalculatorCart((s) => s.removeItem)
  const clearCart       = useCalculatorCart((s) => s.clearCart)
  const getEstimateCart = useCalculatorCart((s) => s.getEstimateCart)

  const totalBeforeMarkup = useCalculatorCart((s) => s.totalBeforeMarkup)

  const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽'

  // ---------------------------------------------------------------------------
  // Handle submit — snapshot the cart and pass to parent.
  // Fallback: when no onSubmitRequest handler is provided (current homepage
  // usage, where app/page.tsx is a Server Component and cannot pass function
  // props), scroll to the lead form section. The cart itself is already
  // shared with the form via the Zustand store through LeadFormWithCart,
  // so the estimate arrives pre-attached there.
  // ---------------------------------------------------------------------------
  const handleSubmit = () => {
    if (onSubmitRequest) {
      onSubmitRequest(getEstimateCart())
      return
    }

    const target = document.getElementById('contact')
    if (!target) return

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    target.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  // ---------------------------------------------------------------------------
  // Render: empty state
  // ---------------------------------------------------------------------------
  if (!hasItems) {
    return (
      <div className="glass-card overflow-hidden rounded-card">
        <div className="border-b border-brand-midnight-border/70 px-6 py-4">
          <h3 className="font-display text-2xl font-semibold text-brand-parchment">
            {locale === 'en' ? 'Your estimate' : 'Ваша смета'}
          </h3>
        </div>
        <EmptyState locale={locale} />
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Render: filled cart state
  // ---------------------------------------------------------------------------
  return (
    <div className="glass-card overflow-hidden rounded-card">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-brand-midnight-border/70 px-6 py-4">
        <div>
          <h3 className="font-display text-2xl font-semibold text-brand-parchment">
            {locale === 'en' ? 'Your estimate' : 'Ваша смета'}
          </h3>
          <p className="mt-0.5 text-xs text-brand-stone">
            {locale === 'en'
              ? `${itemCount} ${itemCount === 1 ? 'category' : 'categories'} selected`
              : `${itemCount} ${itemCount === 1 ? 'категория' : itemCount < 5 ? 'категории' : 'категорий'} выбрано`}
          </p>
        </div>

        {/* Clear all */}
        <button
          type="button"
          onClick={clearCart}
          className="
            rounded text-xs text-brand-stone/70 transition-colors
            hover:text-red-600 focus-visible:outline-none
            focus-visible:ring-1 focus-visible:ring-brand-gold
          "
        >
          {locale === 'en' ? 'Clear all' : 'Очистить'}
        </button>
      </div>

      {/* Item list */}
      <ul className="px-6">
        {items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            locale={locale}
            compact={compact}
            onRemove={removeItem}
          />
        ))}
      </ul>

      {/* Totals */}
      <div className="space-y-2 border-t border-brand-midnight-border/70 px-6 pb-2 pt-4">
        <div className="flex items-center justify-between text-xs text-brand-stone/70">
          <span>
            {locale === 'en' ? 'Before fees' : 'До наценки'}
          </span>
          <span>{fmt(totalBeforeMarkup)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-brand-parchment/90">
            {locale === 'en' ? 'Approximate total' : 'Итого ориентировочно'}
          </span>
          <span className="text-xl font-bold text-gold-gradient">
            {formattedTotal}
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-6 py-3">
        <p className="text-xs leading-relaxed text-brand-stone/80">
          {locale === 'en'
            ? 'Approximate cost. Final price depends on measurements, composition, materials, delivery, urgency, and approval.'
            : 'Ориентировочная стоимость. Итоговая цена зависит от замеров, состава, материалов, доставки, срочности и согласования.'}
        </p>
      </div>

      {/* Brand trust note */}
      <div className="mx-4 mb-4 rounded-xl border border-brand-gold/25 bg-brand-gold/[0.06] px-4 py-3">
        <p className="text-xs font-medium leading-relaxed text-brand-gold-light">
          {locale === 'en'
            ? 'Si-Si — full-service event decoration in Moscow & MO within 24 hours. Concept, materials, delivery, installation and removal — we handle everything.'
            : 'Si-Si — оформление входных групп и мероприятий в Москве и МО за 24 часа. Идея, материалы, доставка, монтаж и демонтаж — всё берём на себя.'}
        </p>
      </div>

      {/* CTA — always rendered. Without an onSubmitRequest prop it scrolls
          to the lead form; the cart reaches the form via the shared store. */}
      <div className="px-6 pb-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="
            btn-gold-sheen animate-sheen
            min-h-11 w-full rounded-btn px-5 py-3.5
            text-center text-sm font-semibold text-brand-ink
            shadow-gold-glow transition-transform duration-base
            hover:-translate-y-0.5
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-brand-gold
          "
        >
          {locale === 'en'
            ? 'Submit request →'
            : 'Отправить заявку →'}
        </button>
        <p className="mt-2 text-center text-xs text-brand-stone/70">
          {locale === 'en'
            ? 'No payment required — we will contact you to confirm'
            : 'Оплата не требуется — мы свяжемся для подтверждения'}
        </p>
      </div>
    </div>
  )
}

export default CalculatorSummary
