'use client'

// components/site/calculator/calculator-category-balloons.tsx
// Balloon decoration calculator category component.
// Follows the same architectural pattern as calculator-category-floral.tsx.
// Uses CATEGORY_CONFIGS.balloons as the single source of truth for fields and pricing.

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
// Internal helpers — price computation for balloon category
// ---------------------------------------------------------------------------

function resolveOption(
  field: CategoryField,
  value: string,
): SelectOption | undefined {
  return field.options?.find((opt) => opt.value === value)
}

/**
 * Computes the raw base price for the balloon category.
 *
 * Logic:
 *   - Start from category basePrice.
 *   - Chain-multiply by each select field's option multiplier.
 *   - The config exposes pricePerUnit for balloons (500 ₽/unit).
 *     However, since there is no explicit quantity number field in the
 *     balloons config, pricePerUnit is used as an additive surcharge
 *     scaled by the composition complexity level:
 *       simple  → +0  units surcharge (basic install, labour covered in base)
 *       medium  → +10 units (panels / columns add discrete unit cost)
 *       complex → +20 units (full installations)
 *     This mirrors real-world balloon pricing without inventing a separate
 *     quantity input that does not exist in the accepted field config.
 *   - The extraHelium toggle adds a flat 10% surcharge on the accumulated price.
 */
function computeBalloonsBasePrice(
  selections: Record<string, string | boolean>,
  basePrice: number,
  pricePerUnit: number,
  fields: CategoryField[],
): number {
  let price = basePrice

  // Map composition level to implied unit count for the per-unit surcharge
  const compositionUnitMap: Record<string, number> = {
    simple:  0,
    medium:  10,
    complex: 20,
  }

  let unitSurcharge = 0

  for (const field of fields) {
    const selected = selections[field.id]

    if (field.type === 'select' && typeof selected === 'string') {
      const option = resolveOption(field, selected)
      if (!option) continue

      // Apply multiplier from eventType / scale / compositionLevel
      if (option.multiplier !== undefined) {
        price = price * option.multiplier
      }

      // Resolve per-unit surcharge from composition level
      if (field.id === 'compositionLevel') {
        const units = compositionUnitMap[selected] ?? 0
        unitSurcharge = units * pricePerUnit
      }
    }

    // extraHelium toggle: +10% of accumulated price
    if (field.type === 'toggle' && field.id === 'extraHelium' && selected === true) {
      price = price * 1.1
    }
  }

  return Math.round(price + unitSurcharge)
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

    const strVal  = typeof selected === 'string' ? selected : String(selected)
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

interface CalculatorCategoryBalloonsProps {
  onCalculated?: () => void
}

export function CalculatorCategoryBalloons({
  onCalculated,
}: CalculatorCategoryBalloonsProps) {
  const { t, locale } = useTranslations()

  const config         = CATEGORY_CONFIGS.balloons
  const pricePerUnit   = config.pricing.pricePerUnit ?? 500
  const { upsertItem } = useCalculatorCart()
  const alreadyInCart  = useCalculatorCart(selectCategoryInCart('balloons'))
  const existingItem   = useCalculatorCart(selectItemByCategory('balloons'))

  // -------------------------------------------------------------------------
  // Local form state
  // -------------------------------------------------------------------------
  const [selections, setSelections] = useState<Record<string, string | boolean>>(
    () => buildDefaultSelections(config.fields),
  )

  const [isCalculated, setIsCalculated] = useState(false)
  const [previewPrice, setPreviewPrice] = useState<number | null>(null)

  // -------------------------------------------------------------------------
  // Field change handler with live preview
  // -------------------------------------------------------------------------
  const handleChange = useCallback(
    (fieldId: string, value: string | boolean) => {
      setSelections((prev) => {
        const next = { ...prev, [fieldId]: value }
        const liveBase = computeBalloonsBasePrice(
          next,
          config.pricing.basePrice,
          pricePerUnit,
          config.fields,
        )
        setPreviewPrice(Math.round(liveBase * config.pricing.markupCoefficient))
        return next
      })
    },
    [config, pricePerUnit],
  )

  // -------------------------------------------------------------------------
  // Calculate and push to shared cart
  // -------------------------------------------------------------------------
  const handleCalculate = useCallback(() => {
    const basePrice = computeBalloonsBasePrice(
      selections,
      config.pricing.basePrice,
      pricePerUnit,
      config.fields,
    )
    const resolved  = buildSelections(selections, config.fields, locale)
    const cartItem  = buildCartItem(
      'balloons',
      config.labelRu,
      resolved,
      basePrice,
    )

    upsertItem(cartItem)
    setIsCalculated(true)
    onCalculated?.()
  }, [selections, config, pricePerUnit, locale, upsertItem, onCalculated])

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

      {/* Dynamic fields */}
      <div className="space-y-4">
        {config.fields.map((field) => {
          const currentValue = selections[field.id]

          if (field.type === 'select') {
            return (
              <div key={field.id} className="flex flex-col gap-1.5">
                <label
                  htmlFor={`balloons-${field.id}`}
                  className="text-sm font-medium text-brand-ink/80"
                >
                  {fieldLabel(field)}
                </label>
                <select
                  id={`balloons-${field.id}`}
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
                  htmlFor={`balloons-${field.id}`}
                  className="text-sm font-medium text-brand-ink/80 cursor-pointer"
                >
                  {fieldLabel(field)}
                </label>
                <button
                  id={`balloons-${field.id}`}
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

export default CalculatorCategoryBalloons
