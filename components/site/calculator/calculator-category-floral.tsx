'use client'

// components/site/calculator/calculator-category-floral.tsx
// Floral decoration calculator category component.
// Renders the floral form fields, computes a subtotal, and upserts
// the result into the shared zustand cart. Acts as the pattern template
// for balloon, bouquet, and event category components.

import React, { useState, useCallback } from 'react'

import {
  CATEGORY_CONFIGS,
  type CategoryField,
  type SelectOption,
  type CategorySelection,
} from '@/lib/calculator-config'
import {
  useCalculatorCart,
  buildCartItem,
  selectCategoryInCart,
  selectItemByCategory,
} from '@/components/site/calculator/calculator-cart'
import { useTranslations } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Internal helpers — price computation from user selections
// ---------------------------------------------------------------------------

/**
 * Resolves a user-selected value to its matching SelectOption, or undefined.
 */
function resolveOption(
  field: CategoryField,
  value: string,
): SelectOption | undefined {
  return field.options?.find((opt) => opt.value === value)
}

/**
 * Computes the raw base price for the floral category
 * from the user's selections and the category pricing config.
 *
 * Logic:
 *   - Start from the category basePrice.
 *   - Multiply by each selected option's `multiplier` (chained, not summed).
 *   - If an option has `fixedPrice`, use it directly (overrides everything else).
 *   - Toggle fields with `defaultValue: false` add a flat surcharge when enabled.
 */
function computeFloralBasePrice(
  selections: Record<string, string | boolean>,
  basePrice: number,
  fields: CategoryField[],
): number {
  let price = basePrice
  let hasFixedPrice = false
  let fixedPrice = 0

  for (const field of fields) {
    const selected = selections[field.id]

    if (field.type === 'select' && typeof selected === 'string') {
      const option = resolveOption(field, selected)
      if (!option) continue

      if (option.fixedPrice !== undefined) {
        // Fixed price from an option overrides the accumulated price entirely
        hasFixedPrice = true
        fixedPrice = option.fixedPrice
      } else if (!hasFixedPrice && option.multiplier !== undefined) {
        price = price * option.multiplier
      }
    }

    if (field.type === 'toggle' && selected === true) {
      // Toggle add-ons add 10% of the current accumulated price as a surcharge
      if (!hasFixedPrice) {
        price = price * 1.1
      }
    }
  }

  return hasFixedPrice ? fixedPrice : price
}

/**
 * Builds the CategorySelection array from raw form state.
 * These entries are stored in the CartItem and later shown in the
 * cart summary, lead form, and Telegram message.
 */
function buildSelections(
  rawSelections: Record<string, string | boolean>,
  fields: CategoryField[],
  locale: 'ru' | 'en',
): CategorySelection[] {
  return fields.map((field) => {
    const selected = rawSelections[field.id]

    if (field.type === 'toggle') {
      const boolVal = Boolean(selected)
      return {
        fieldId:          field.id,
        labelRu:          field.labelRu,
        labelEn:          field.labelEn,
        selectedValue:    boolVal,
        selectedLabelRu:  boolVal ? 'Да' : 'Нет',
        selectedLabelEn:  boolVal ? 'Yes' : 'No',
      }
    }

    const strVal = typeof selected === 'string' ? selected : String(selected)
    const option  = resolveOption(field, strVal)

    return {
      fieldId:         field.id,
      labelRu:         field.labelRu,
      labelEn:         field.labelEn,
      selectedValue:   strVal,
      selectedLabelRu: option?.labelRu ?? strVal,
      selectedLabelEn: option?.labelEn ?? strVal,
    }
  })
}

/**
 * Builds a default selection map from the field definitions.
 * Ensures the form always has a valid initial state.
 */
function buildDefaultSelections(
  fields: CategoryField[],
): Record<string, string | boolean> {
  const defaults: Record<string, string | boolean> = {}
  for (const field of fields) {
    if (field.defaultValue !== undefined) {
      defaults[field.id] =
        typeof field.defaultValue === 'boolean'
          ? field.defaultValue
          : String(field.defaultValue)
    }
  }
  return defaults
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CalculatorCategoryFloralProps {
  /** Optional callback invoked after the item is upserted into the cart */
  onCalculated?: () => void
}

export function CalculatorCategoryFloral({
  onCalculated,
}: CalculatorCategoryFloralProps) {
  const { t, locale } = useTranslations()

  const config        = CATEGORY_CONFIGS.floral
  const { upsertItem } = useCalculatorCart()
  const alreadyInCart = useCalculatorCart(selectCategoryInCart('floral'))
  const existingItem  = useCalculatorCart(selectItemByCategory('floral'))

  // -------------------------------------------------------------------------
  // Local form state — selections keyed by field.id
  // -------------------------------------------------------------------------
  const [selections, setSelections] = useState<Record<string, string | boolean>>(
    () => buildDefaultSelections(config.fields),
  )

  // Track whether the user has hit "Calculate" at least once in this session
  const [isCalculated, setIsCalculated] = useState(false)

  // Live preview price (before markup, for UX feedback)
  const [previewPrice, setPreviewPrice] = useState<number | null>(null)

  // -------------------------------------------------------------------------
  // Update a single field value
  // -------------------------------------------------------------------------
  const handleChange = useCallback(
    (fieldId: string, value: string | boolean) => {
      setSelections((prev) => {
        const next = { ...prev, [fieldId]: value }

        // Recompute live preview whenever user changes a field
        const liveBase = computeFloralBasePrice(
          next,
          config.pricing.basePrice,
          config.fields,
        )
        setPreviewPrice(Math.round(liveBase * config.pricing.markupCoefficient))

        return next
      })
    },
    [config],
  )

  // -------------------------------------------------------------------------
  // Calculate and push to cart
  // -------------------------------------------------------------------------
  const handleCalculate = useCallback(() => {
    const basePrice  = computeFloralBasePrice(
      selections,
      config.pricing.basePrice,
      config.fields,
    )
    const resolved   = buildSelections(selections, config.fields, locale)
    const cartItem   = buildCartItem(
      'floral',
      config.labelRu,
      resolved,
      basePrice,
    )

    upsertItem(cartItem)
    setIsCalculated(true)
    onCalculated?.()
  }, [selections, config, locale, upsertItem, onCalculated])

  // -------------------------------------------------------------------------
  // Allow the user to re-edit after calculating
  // -------------------------------------------------------------------------
  const handleEdit = useCallback(() => {
    setIsCalculated(false)
  }, [])

  // -------------------------------------------------------------------------
  // Label resolution — display in the correct language
  // -------------------------------------------------------------------------
  const fieldLabel = (field: CategoryField): string =>
    locale === 'en' ? field.labelEn : field.labelRu

  const optionLabel = (opt: SelectOption): string =>
    locale === 'en' ? opt.labelEn : opt.labelRu

  // -------------------------------------------------------------------------
  // Price formatting helper
  // -------------------------------------------------------------------------
  const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽'

  // -------------------------------------------------------------------------
  // Render: "calculated / added" state — show summary + edit button
  // -------------------------------------------------------------------------
  if (isCalculated && existingItem) {
    return (
      <div className="rounded-xl border border-brand-gold/30 bg-brand-cream p-6 space-y-4">
        {/* Category header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-display-md text-brand-forest">
              {locale === 'en' ? config.labelEn : config.labelRu}
            </h3>
            <p className="text-sm text-brand-ink/60 mt-0.5">
              {locale === 'en' ? config.descriptionEn : config.descriptionRu}
            </p>
          </div>
          {/* Green "added" badge */}
          <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            {locale === 'en' ? '✓ Added' : '✓ Добавлено'}
          </span>
        </div>

        {/* Selections summary */}
        <ul className="space-y-1.5 text-sm text-brand-ink/80">
          {existingItem.selections.map((sel) => (
            <li key={sel.fieldId} className="flex justify-between gap-2">
              <span className="text-brand-ink/60">
                {locale === 'en' ? sel.labelEn : sel.labelRu}
              </span>
              <span className="font-medium">
                {typeof sel.selectedValue === 'boolean'
                  ? (locale === 'en' ? sel.selectedLabelEn : sel.selectedLabelRu)
                  : (locale === 'en' ? sel.selectedLabelEn : sel.selectedLabelRu)}
              </span>
            </li>
          ))}
        </ul>

        {/* Subtotal */}
        <div className="pt-2 border-t border-brand-gold/20 flex items-center justify-between">
          <span className="text-sm text-brand-ink/60">
            {locale === 'en' ? 'Subtotal (estimate)' : 'Подытог (ориентировочно)'}
          </span>
          <span className="text-lg font-semibold text-brand-forest">
            {fmt(existingItem.subtotalWithMarkup)}
          </span>
        </div>

        {/* Edit button */}
        <button
          type="button"
          onClick={handleEdit}
          className="text-sm text-brand-gold underline underline-offset-2 hover:text-brand-forest transition-colors"
        >
          {locale === 'en' ? 'Edit selection' : 'Изменить выбор'}
        </button>
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // Render: form state
  // -------------------------------------------------------------------------
  return (
    <div className="rounded-xl border border-brand-gold/20 bg-white p-6 space-y-5">

      {/* Category header */}
      <div>
        <h3 className="font-display text-display-md text-brand-forest">
          {locale === 'en' ? config.labelEn : config.labelRu}
        </h3>
        <p className="text-sm text-brand-ink/60 mt-1">
          {locale === 'en' ? config.descriptionEn : config.descriptionRu}
        </p>
      </div>

      {/* Dynamic field rendering */}
      <div className="space-y-4">
        {config.fields.map((field) => {
          const currentValue = selections[field.id]

          if (field.type === 'select') {
            return (
              <div key={field.id} className="flex flex-col gap-1.5">
                <label
                  htmlFor={`floral-${field.id}`}
                  className="text-sm font-medium text-brand-ink/80"
                >
                  {fieldLabel(field)}
                </label>
                <select
                  id={`floral-${field.id}`}
                  value={typeof currentValue === 'string' ? currentValue : ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="
                    w-full rounded-lg border border-brand-ink/20 bg-brand-cream
                    px-3 py-2.5 text-sm text-brand-ink
                    focus:outline-none focus:ring-2 focus:ring-brand-gold/50
                    transition-colors
                  "
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {optionLabel(opt)}
                    </option>
                  ))}
                </select>
              </div>
            )
          }

          if (field.type === 'toggle') {
            const checked = currentValue === true
            return (
              <div key={field.id} className="flex items-center justify-between gap-4">
                <label
                  htmlFor={`floral-${field.id}`}
                  className="text-sm font-medium text-brand-ink/80 cursor-pointer"
                >
                  {fieldLabel(field)}
                </label>
                <button
                  id={`floral-${field.id}`}
                  type="button"
                  role="switch"
                  aria-checked={checked}
                  onClick={() => handleChange(field.id, !checked)}
                  className={`
                    relative inline-flex h-6 w-11 shrink-0 items-center rounded-full
                    transition-colors focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-brand-gold
                    ${checked ? 'bg-brand-forest' : 'bg-brand-ink/20'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 rounded-full bg-white shadow
                      transition-transform
                      ${checked ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>
            )
          }

          return null
        })}
      </div>

      {/* Live price preview */}
      {previewPrice !== null && (
        <div className="rounded-lg bg-brand-cream/70 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-brand-ink/60">
            {locale === 'en' ? 'Approximate total' : 'Ориентировочно'}
          </span>
          <span className="font-semibold text-brand-forest">
            {fmt(previewPrice)}
          </span>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-brand-ink/50 leading-relaxed">
        {locale === 'en'
          ? t.calculator.disclaimer
          : t.calculator.disclaimer}
      </p>

      {/* CTA */}
      <button
        type="button"
        onClick={handleCalculate}
        className="
          w-full rounded-lg bg-brand-forest px-5 py-3
          text-sm font-semibold text-white
          hover:bg-brand-forest/90 active:bg-brand-forest/80
          transition-colors focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-brand-gold
        "
      >
        {alreadyInCart
          ? (locale === 'en' ? 'Update estimate' : 'Обновить смету')
          : (locale === 'en'
              ? t.common.addToEstimate
              : t.common.addToEstimate)}
      </button>
    </div>
  )
}

export default CalculatorCategoryFloral
