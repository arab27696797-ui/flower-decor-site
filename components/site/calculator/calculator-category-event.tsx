'use client'

// components/site/calculator/calculator-category-event.tsx
// General event decoration calculator category component.
// Follows the same architectural pattern as floral, balloons, and bouquet.
// All four select fields (eventType, zoneType, scale, urgency) use multipliers only —
// no fixedPrice logic in this category.

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
// Internal helpers — price computation for event decoration category
// ---------------------------------------------------------------------------

function resolveOption(
  field: CategoryField,
  value: string,
): SelectOption | undefined {
  return field.options?.find((opt) => opt.value === value)
}

/**
 * Computes the raw base price for the event decoration category.
 *
 * Logic:
 *   - Start from the category basePrice (30 000 ₽ by default).
 *   - Chain-multiply by each select field's option multiplier in field order:
 *       eventType  → wedding ×1.5, corporate ×1.3, gala ×1.6, etc.
 *       zoneType   → full_hall ×1.5, photo_zone ×0.7, entrance ×0.8, etc.
 *       scale      → small ×0.75, medium ×1.0, large ×1.5, xlarge ×2.0
 *       urgency    → standard ×1.0, urgent ×1.25, express ×1.5
 *   - No toggle fields exist in this category config.
 *   - No fixedPrice values exist in this category config.
 *
 * The field order from CATEGORY_CONFIGS.event is preserved so that
 * multiplier application is deterministic and consistent with the config.
 */
function computeEventBasePrice(
  selections: Record<string, string | boolean>,
  basePrice: number,
  fields: CategoryField[],
): number {
  let price = basePrice

  for (const field of fields) {
    if (field.type !== 'select') continue

    const selected = selections[field.id]
    if (typeof selected !== 'string') continue

    const option = resolveOption(field, selected)
    if (option?.multiplier !== undefined) {
      price = price * option.multiplier
    }
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
// Urgency values that trigger a contextual notice
// ---------------------------------------------------------------------------

const URGENT_VALUES = new Set(['urgent', 'express'])

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CalculatorCategoryEventProps {
  onCalculated?: () => void
}

export function CalculatorCategoryEvent({
  onCalculated,
}: CalculatorCategoryEventProps) {
  const { t, locale } = useTranslations()

  const config         = CATEGORY_CONFIGS.event
  const { upsertItem } = useCalculatorCart()
  const alreadyInCart  = useCalculatorCart(selectCategoryInCart('event'))
  const existingItem   = useCalculatorCart(selectItemByCategory('event'))

  // -------------------------------------------------------------------------
  // Local form state
  // -------------------------------------------------------------------------
  const [selections, setSelections] = useState<Record<string, string | boolean>>(
    () => buildDefaultSelections(config.fields),
  )

  const [isCalculated, setIsCalculated] = useState(false)
  const [previewPrice, setPreviewPrice] = useState<number | null>(null)

  // -------------------------------------------------------------------------
  // Field change handler with live preview recomputation
  // -------------------------------------------------------------------------
  const handleChange = useCallback(
    (fieldId: string, value: string | boolean) => {
      setSelections((prev) => {
        const next     = { ...prev, [fieldId]: value }
        const liveBase = computeEventBasePrice(
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
    const basePrice = computeEventBasePrice(
      selections,
      config.pricing.basePrice,
      config.fields,
    )
    const resolved  = buildSelections(selections, config.fields, locale)
    const cartItem  = buildCartItem(
      'event',
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
  // Urgency notice flag
  // -------------------------------------------------------------------------
  const isUrgent = URGENT_VALUES.has(
    typeof selections['urgency'] === 'string' ? selections['urgency'] : '',
  )

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
                  htmlFor={`event-${field.id}`}
                  className="text-sm font-medium text-brand-ink/80"
                >
                  {fieldLabel(field)}
                </label>
                <select
                  id={`event-${field.id}`}
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

          // Event category has no toggle fields in the current config,
          // but the branch is preserved for forward-compatibility.
          if (field.type === 'toggle') {
            const checked = currentValue === true
            return (
              <div key={field.id} className="flex items-center justify-between gap-4">
                <label
                  htmlFor={`event-${field.id}`}
                  className="text-sm font-medium text-brand-ink/80 cursor-pointer"
                >
                  {fieldLabel(field)}
                </label>
                <button
                  id={`event-${field.id}`}
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

      {/* Urgency contextual notice */}
      {isUrgent && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800 leading-relaxed">
          {locale === 'en'
            ? '⚡ Urgent and express decoration orders are confirmed by phone. Our team will contact you within 30 minutes after receiving your request.'
            : '⚡ Срочные и экспресс-заказы на оформление подтверждаются по телефону. Наш менеджер свяжется с вами в течение 30 минут после получения заявки.'}
        </div>
      )}

      {/* 24-hour guarantee badge — always visible in this category */}
      <div className="rounded-lg bg-brand-forest/5 border border-brand-forest/15 px-4 py-3 text-xs text-brand-forest/80 leading-relaxed">
        {locale === 'en'
          ? '✓ Full event decoration within 24 hours after payment confirmation.'
          : '✓ Полное оформление мероприятия в течение 24 часов после подтверждения оплаты.'}
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

export default CalculatorCategoryEvent
