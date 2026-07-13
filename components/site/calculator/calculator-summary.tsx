'use client'

// components/site/calculator/calculator-summary.tsx
// Shared summary / estimate cart component for the multi-accumulative calculator.
// Reads all items from the zustand cart store, renders each category line,
// supports remove and clear actions, and exposes the full EstimateCart
// to the parent for lead form integration.

import React, { useEffect } from 'react'

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
   * Useful if the summary is embedded inline near the categories rather than
   * in a dedicated sticky panel.
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

  const label = locale === 'en' ? item.categoryLabelEn : item.categoryLabelRu

  return (
    <li className="group flex flex-col gap-2 py-3 border-b border-brand-gold/15 last:border-b-0">

      {/* Category label + remove button */}
      <div className="flex items-start justify-between gap-3">
        <span className="font-medium text-sm text-brand-forest">
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
            shrink-0 text-xs text-brand-ink/40
            hover:text-red-500 transition-colors
            focus-visible:outline-none focus-visible:ring-1
            focus-visible:ring-brand-gold rounded
          "
        >
          {locale === 'en' ? 'Remove' : 'Удалить'}
        </button>
      </div>

      {/* Selections — hidden in compact mode */}
      {!compact && (
        <ul className="space-y-0.5">
          {item.selections.map((sel) => {
            // Skip toggle fields that are set to false — they add noise
            if (typeof sel.selectedValue === 'boolean' && !sel.selectedValue) {
              return null
            }
            return (
              <li
                key={sel.fieldId}
                className="flex justify-between gap-2 text-xs text-brand-ink/60"
              >
                <span>
                  {locale === 'en' ? sel.labelEn : sel.labelRu}
                </span>
                <span className="text-brand-ink/80 font-medium">
                  {locale === 'en' ? sel.selectedLabelEn : sel.selectedLabelRu}
                </span>
              </li>
            )
          })}
        </ul>
      )}

      {/* Subtotal */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-brand-ink/50">
          {locale === 'en' ? 'Subtotal' : 'Подытог'}
        </span>
        <span className="text-sm font-semibold text-brand-forest">
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
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      {/* Simple floral icon — inline SVG, no external dependency */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="text-brand-gold/50"
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

      <p className="text-sm font-medium text-brand-ink/60">
        {locale === 'en'
          ? 'Your estimate is empty'
          : 'Смета пока пустая'}
      </p>
      <p className="text-xs text-brand-ink/40 max-w-[22ch] leading-relaxed">
        {locale === 'en'
          ? 'Select one or more categories above to build your estimate.'
          : 'Выберите одну или несколько категорий выше, чтобы собрать смету.'}
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
  const items        = useCalculatorCart((s) => s.items)
  const hasItems     = useCalculatorCart(selectCartHasItems)
  const formattedTotal = useCalculatorCart(selectFormattedTotal)
  const itemCount    = useCalculatorCart(selectItemCount)
  const removeItem   = useCalculatorCart((s) => s.removeItem)
  const clearCart    = useCalculatorCart((s) => s.clearCart)
  const getEstimateCart = useCalculatorCart((s) => s.getEstimateCart)

  const totalBeforeMarkup = useCalculatorCart((s) => s.totalBeforeMarkup)

  const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽'

  // ---------------------------------------------------------------------------
  // Handle submit — snapshot the cart and pass to parent
  // ---------------------------------------------------------------------------
  const handleSubmit = () => {
    if (!onSubmitRequest) return
    onSubmitRequest(getEstimateCart())
  }

  // ---------------------------------------------------------------------------
  // Render: empty state
  // ---------------------------------------------------------------------------
  if (!hasItems) {
    return (
      <div className="rounded-xl border border-brand-gold/20 bg-white overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-gold/15 bg-brand-cream/50">
          <h3 className="font-display text-display-md text-brand-forest">
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
    <div className="rounded-xl border border-brand-gold/20 bg-white overflow-hidden">

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="px-6 py-4 border-b border-brand-gold/15 bg-brand-cream/50 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-display-md text-brand-forest">
            {locale === 'en' ? 'Your estimate' : 'Ваша смета'}
          </h3>
          <p className="text-xs text-brand-ink/50 mt-0.5">
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
            text-xs text-brand-ink/40 hover:text-red-500
            transition-colors focus-visible:outline-none
            focus-visible:ring-1 focus-visible:ring-brand-gold rounded
          "
        >
          {locale === 'en' ? 'Clear all' : 'Очистить'}
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Item list                                                            */}
      {/* ------------------------------------------------------------------ */}
      <ul className="px-6 divide-y divide-brand-gold/10">
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

      {/* ------------------------------------------------------------------ */}
      {/* Totals                                                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="px-6 pt-4 pb-2 border-t border-brand-gold/15 space-y-2">

        {/* Subtotal before markup — shown as reference */}
        <div className="flex items-center justify-between text-xs text-brand-ink/50">
          <span>
            {locale === 'en' ? 'Before fees' : 'До наценки'}
          </span>
          <span>{fmt(totalBeforeMarkup)}</span>
        </div>

        {/* Total with markup */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-brand-ink/80">
            {locale === 'en' ? 'Approximate total' : 'Итого ориентировочно'}
          </span>
          <span className="text-xl font-bold text-brand-forest">
            {formattedTotal}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Disclaimer                                                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="px-6 py-3">
        <p className="text-xs text-brand-ink/45 leading-relaxed">
          {locale === 'en'
            ? 'Approximate cost. Final price depends on measurements, composition, materials, delivery, urgency, and approval.'
            : 'Ориентировочная стоимость. Итоговая цена зависит от замеров, состава, материалов, доставки, срочности и согласования.'}
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Brand trust note — PRIMA Decor offer context                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="px-6 py-3 mx-4 mb-4 rounded-lg bg-brand-forest/5 border border-brand-forest/10">
        <p className="text-xs text-brand-forest/75 leading-relaxed font-medium">
          {locale === 'en'
            ? 'PRIMA Decor — full-service event decoration in Moscow & MO within 24 hours. Concept, materials, delivery, installation and removal — we handle everything.'
            : 'PRIMA Decor — оформление входных групп и мероприятий в Москве и МО за 24 часа. Идея, материалы, доставка, монтаж и демонтаж — всё берём на себя.'}
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* CTA                                                                  */}
      {/* ------------------------------------------------------------------ */}
      {onSubmitRequest && (
        <div className="px-6 pb-6">
          <button
            type="button"
            onClick={handleSubmit}
            className="
              w-full rounded-lg bg-brand-forest px-5 py-3.5
              text-sm font-semibold text-white text-center
              hover:bg-brand-forest/90 active:bg-brand-forest/80
              transition-colors focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-brand-gold
            "
          >
            {locale === 'en'
              ? 'Submit request →'
              : 'Отправить заявку →'}
          </button>
          <p className="mt-2 text-center text-xs text-brand-ink/40">
            {locale === 'en'
              ? 'No payment required — we will contact you to confirm'
              : 'Оплата не требуется — мы свяжемся для подтверждения'}
          </p>
        </div>
      )}
    </div>
  )
}

export default CalculatorSummary
