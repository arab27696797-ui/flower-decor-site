'use client'

// components/site/calculator/calculator-category-bouquet.tsx
// Bouquet calculator category component.
// Follows the same architectural pattern as floral and balloons components.
// Key pricing difference: bouquetSize uses fixedPrice as the base,
// then occasion and urgency multipliers are applied on top of it.

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
// Internal helpers — price computation for bouquet category
// ---------------------------------------------------------------------------

function resolveOption(
  field: CategoryField,
  value: string,
): SelectOption | undefined {
  return field.options?.find((opt) => opt.value === value)
}

/**
 * Computes the raw base price for the bouquet category.
 *
 * Logic:
 *   1. Find the selected bouquetSize option.
 *      If it has a fixedPrice, that becomes the absolute starting price.
 *      If not (defensive fallback), use the category basePrice instead.
 *   2. Apply the occasion multiplier on top of the resolved bouquet price.
 *   3. Apply the urgency multiplier on top of the result.
 *   4. addBalloons toggle: adds a flat surcharge of 1 500 ₽ (a modest
 *      balloon add-on to an existing bouquet order — consistent with the
 *      config's pricePerUnit-less bouquet pricing model; no phantom fields
 *      are introduced).
 *
 * Note: addBalloons is intentionally a flat amount, not a percentage,
 * because a small balloon add-on to a bouquet has a fixed market price
 * regardless of bouquet size. The 1 500 ₽ figure is within the acceptable
 * range for a small helium balloon cluster add-on in Moscow.
 */
const BALLOONS_ADDON_PRICE = 1_500 // flat surcharge when addBalloons is toggled on

function computeBouquetBasePrice(
  selections: Record<string, string | boolean>,
  fallbackBasePrice: number,
  fields: CategoryField[],
): number {
  let price = fallbackBasePrice

  // Step 1 — resolve the bouquet size price first (may be fixedPrice)
  const sizeField   = fields.find((f) => f.id === 'bouquetSize')
  const sizeValue   = typeof selections['bouquetSize'] === 'string'
    ? selections['bouquetSize']
    : undefined

  if (sizeField && sizeValue) {
    const sizeOption = resolveOption(sizeField, sizeValue)
    if (sizeOption) {
      if (sizeOption.fixedPrice !== undefined) {
        // fixedPrice is the absolute bouquet price — overrides basePrice
        price = sizeOption.fixedPrice
      } else if (sizeOption.multiplier !== undefined) {
        // Defensive: if someone later adds a non-fixed option
        price = fallbackBasePrice * sizeOption.multiplier
      }
    }
  }

  // Step 2 — apply occasion multiplier
  const occasionField = fields.find((f) => f.id === 'occasion')
  const occasionValue = typeof selections['occasion'] === 'string'
    ? selections['occasion']
    : undefined

  if (occasionField && occasionValue) {
    const occasionOption = resolveOption(occasionField, occasionValue)
    if (occasionOption?.multiplier !== undefined) {
      price = price * occasionOption.multiplier
    }
  }

  // Step 3 — apply urgency multiplier
  const urgencyField = fields.find((f) => f.id === 'urgency')
  const urgencyValue = typeof selections['urgency'] === 'string'
    ? selections['urgency']
    : undefined

  if (urgencyField && urgencyValue) {
    const urgencyOption = resolveOption(urgencyField, urgencyValue)
    if (urgencyOption?.multiplier !== undefined) {
      price = price * urgencyOption.multiplier
    }
  }

  // Step 4 — addBalloons flat surcharge
  if (selections['addBalloons'] === true) {
    price = price + BALLOONS_ADDON_PRICE
  }

  return Math.round(price)
}

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
        fieldId:         field.id,
        labelRu:         field.labelRu,
        labelEn:         field.labelEn,
        selectedValue:   boolVal,
        selectedLabelRu: boolVal ? 'Да' : 'Нет',
        selectedLabelEn: boolVal ? 'Yes' : 'No',
      }
    }

    const strVal = typeof selected === 'string' ? selected : String(selected)
    const option = resolveOption(field, strVal)

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

interface CalculatorCategoryBouquetProps {
  onCalculated?: () => void
}

export function CalculatorCategoryBouquet({
  onCalculated,
}: CalculatorCategoryBouquetProps) {
  const { t, locale } = useTranslations()

  const config         = CATEGORY_CONFIGS.bouquet
  const { upsertItem } = useCalculatorCart()
  const alreadyInCart  = useCalculatorCart(selectCategoryInCart('bouquet'))
  const existingItem   = useCalculatorCart(selectItemByCategory('bouquet'))

  // -------------------------------------------------------------------------
  // Local form state
  // -------------------------------------------------------------------------
  const [selections, setSelections] = useState<Record<string, string | boolean>>(
    () => buildDefaultSelections(config.fields),
  )

  const [isCalculated, setIsCalculated] = useState(false)
  const [previewPrice, setPreviewPrice] = useState<number | null>(null)

  // -------------------------------------------------------------------------
  // Field change handler with live price preview
  // -------------------------------------------------------------------------
  const handleChange = useCallback(
    (fieldId: string, value: string | boolean) => {
      setSelections((prev) => {
        const next     = { ...prev, [fieldId]: value }
        const liveBase = computeBouquetBasePrice(
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
  // Calculate and push to shared cart
  // -------------------------------------------------------------------------
  const handleCalculate = useCallback(() => {
    const basePrice = computeBouquetBasePrice(
      selections,
      config.pricing.basePrice,
      config.fields,
    )
    const resolved  = buildSelections(selections, config.fields, locale)
    const cartItem  = buildCartItem(
      'bouquet',
      config.labelRu,
      resolved,
      basePrice,
    )

    upsertItem(cartItem)
    setIsCalculated(true)
    onCalculated?.()
  }, [selections, config, locale, upsertItem, onCalculated])

  const handleEdit = useCallback(() => {
    setIsCalculated(false)
  }, [])

  // -------------------------------------------------------------------------
  // Label helpers
  // -------------------------------------------------------------------------
  const fieldLabel  = (field: CategoryField): string =>
    locale === 'en' ? field.labelEn : field.labelRu

  const optionLabel = (opt: SelectOption): string =>
    locale === 'en' ? opt.labelEn : opt.labelRu

  const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽'

  // -------------------------------------------------------------------------
  // Urgency badge — visual hint for same-day / express options
  // -------------------------------------------------------------------------
  const urgencyValue    = selections['urgency']
  const isUrgentOrExpress =
    urgencyValue === 'same_day' || urgencyValue === 'express'

  // -------------------------------------------------------------------------
  // Render: calculated / added summary state
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
                {locale === 'en' ? sel.selectedLabelEn : sel.selectedLabelRu}
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

        {/* Edit */}
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

      {/* Dynamic fields */}
      <div className="space-y-4">
        {config.fields.map((field) => {
          const currentValue = selections[field.id]

          if (field.type === 'select') {
            return (
              <div key={field.id} className="flex flex-col gap-1.5">
                <label
                  htmlFor={`bouquet-${field.id}`}
                  className="text-sm font-medium text-brand-ink/80"
                >
                  {fieldLabel(field)}
                  {/* Show fixed prices inline in the bouquetSize label for clarity */}
                  {field.id === 'bouquetSize' && (
                    <span className="ml-1.5 text-xs text-brand-ink/40 font-normal">
                      {locale === 'en' ? '— price fixed per size' : '— цена фиксирована'}
                    </span>
                  )}
                </label>
                <select
                  id={`bouquet-${field.id}`}
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
                      {/* Append fixed price to bouquetSize options for UX transparency */}
                      {field.id === 'bouquetSize' && opt.fixedPrice !== undefined
                        ? ` — от ${opt.fixedPrice.toLocaleString('ru-RU')} ₽`
                        : ''}
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
                  htmlFor={`bouquet-${field.id}`}
                  className="text-sm font-medium text-brand-ink/80 cursor-pointer"
                >
                  {fieldLabel(field)}
                  {/* Show the balloon add-on price hint */}
                  {field.id === 'addBalloons' && (
                    <span className="ml-1.5 text-xs text-brand-ink/40 font-normal">
                      +{BALLOONS_ADDON_PRICE.toLocaleString('ru-RU')} ₽
                    </span>
                  )}
                </label>
                <button
                  id={`bouquet-${field.id}`}
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

      {/* Urgency notice — contextual, only when same_day or express is selected */}
      {isUrgentOrExpress && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800 leading-relaxed">
          {locale === 'en'
            ? '⚡ Urgent orders are accepted by phone. Please call us after submitting your request.'
            : '⚡ Срочные заказы принимаются по телефону. Позвоните нам после отправки заявки.'}
        </div>
      )}

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
        {t.calculator.disclaimer}
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
          : (locale === 'en' ? t.common.addToEstimate : t.common.addToEstimate)}
      </button>
    </div>
  )
}

export default CalculatorCategoryBouquet
