'use client'

// components/site/calculator/calculator-category-card.tsx
// Si-Si — generic calculator category card, "Noir Bloom" design.
// One config-driven component replaces four near-identical category
// components. Price logic is preserved 1:1 per category:
//   floral   — multiplier chain, fixedPrice override, toggle +10% unless fixed
//   balloons — multiplier chain + per-unit composition surcharge, helium +10%
//   bouquet  — fixedPrice by size, then occasion × urgency, +1 500 ₽ balloons
//   event    — pure multiplier chain
// Live preview = raw base × category markupCoefficient (config-driven).

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'

import {
  CATEGORY_CONFIGS,
  type CategoryId,
  type CategoryConfig,
  type CategoryField,
  type SelectOption,
  type CategorySelection,
  type CartItem,
} from '@/lib/calculator-config'
import {
  useCalculatorCart,
  buildCartItem,
  selectCategoryInCart,
  selectItemByCategory,
} from '@/components/site/calculator/calculator-cart'
import { useTranslations } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function resolveOption(
  field: CategoryField,
  value: string,
): SelectOption | undefined {
  return field.options?.find((opt) => opt.value === value)
}

function buildSelections(
  rawSelections: Record<string, string | boolean>,
  fields: CategoryField[],
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
  for (const field of config.fields) {
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
// Per-category raw base price algorithms (exact parity with legacy components)
// ---------------------------------------------------------------------------

function computeFloralBase(
  selections: Record<string, string | boolean>,
  config: CategoryConfig,
): number {
  let price = config.pricing.basePrice
  let hasFixedPrice = false
  let fixedPrice = 0

  for (const field of config.fields) {
    const selected = selections[field.id]

    if (field.type === 'select' && typeof selected === 'string') {
      const option = resolveOption(field, selected)
      if (!option) continue

      if (option.fixedPrice !== undefined) {
        hasFixedPrice = true
        fixedPrice = option.fixedPrice
      } else if (!hasFixedPrice && option.multiplier !== undefined) {
        price = price * option.multiplier
      }
    }

    if (field.type === 'toggle' && selected === true) {
      if (!hasFixedPrice) {
        price = price * 1.1
      }
    }
  }

  return hasFixedPrice ? fixedPrice : price
}

const BALLOON_COMPOSITION_UNITS: Record<string, number> = {
  simple: 0,
  medium: 10,
  complex: 20,
}

function computeBalloonsBase(
  selections: Record<string, string | boolean>,
  config: CategoryConfig,
): number {
  let price = config.pricing.basePrice
  const pricePerUnit = config.pricing.pricePerUnit ?? 0
  let unitSurcharge = 0

  for (const field of config.fields) {
    const selected = selections[field.id]

    if (field.type === 'select' && typeof selected === 'string') {
      const option = resolveOption(field, selected)
      if (!option) continue

      if (option.multiplier !== undefined) {
        price = price * option.multiplier
      }

      if (field.id === 'compositionLevel') {
        const units = BALLOON_COMPOSITION_UNITS[selected] ?? 0
        unitSurcharge = units * pricePerUnit
      }
    }

    if (field.type === 'toggle' && field.id === 'extraHelium' && selected === true) {
      price = price * 1.1
    }
  }

  return Math.round(price + unitSurcharge)
}

const BALLOONS_ADDON_PRICE = 1_500

function computeBouquetBase(
  selections: Record<string, string | boolean>,
  config: CategoryConfig,
): number {
  const fallbackBasePrice = config.pricing.basePrice
  let price = fallbackBasePrice

  // Step 1 — bouquet size (may be fixedPrice, which overrides basePrice)
  const sizeField = config.fields.find((f) => f.id === 'bouquetSize')
  const sizeValue = typeof selections['bouquetSize'] === 'string'
    ? (selections['bouquetSize'] as string)
    : undefined

  if (sizeField && sizeValue) {
    const sizeOption = resolveOption(sizeField, sizeValue)
    if (sizeOption) {
      if (sizeOption.fixedPrice !== undefined) {
        price = sizeOption.fixedPrice
      } else if (sizeOption.multiplier !== undefined) {
        price = fallbackBasePrice * sizeOption.multiplier
      }
    }
  }

  // Step 2 — occasion multiplier
  const occasionField = config.fields.find((f) => f.id === 'occasion')
  const occasionValue = typeof selections['occasion'] === 'string'
    ? (selections['occasion'] as string)
    : undefined

  if (occasionField && occasionValue) {
    const occasionOption = resolveOption(occasionField, occasionValue)
    if (occasionOption?.multiplier !== undefined) {
      price = price * occasionOption.multiplier
    }
  }

  // Step 3 — urgency multiplier
  const urgencyField = config.fields.find((f) => f.id === 'urgency')
  const urgencyValue = typeof selections['urgency'] === 'string'
    ? (selections['urgency'] as string)
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

function computeEventBase(
  selections: Record<string, string | boolean>,
  config: CategoryConfig,
): number {
  let price = config.pricing.basePrice

  for (const field of config.fields) {
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

function computeBasePrice(
  categoryId: CategoryId,
  selections: Record<string, string | boolean>,
  config: CategoryConfig,
): number {
  switch (categoryId) {
    case 'floral':
      return computeFloralBase(selections, config)
    case 'balloons':
      return computeBalloonsBase(selections, config)
    case 'bouquet':
      return computeBouquetBase(selections, config)
    case 'event':
      return computeEventBase(selections, config)
  }
}

// ---------------------------------------------------------------------------
// Urgency values that trigger a contextual notice (union of legacy sets)
// ---------------------------------------------------------------------------

const URGENT_VALUES = new Set(['urgent', 'express', 'same_day'])

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CalculatorCategoryCardProps {
  categoryId: CategoryId
  index: number
  onCalculated?: () => void
}

export function CalculatorCategoryCard({
  categoryId,
  index,
  onCalculated,
}: CalculatorCategoryCardProps) {
  const { locale } = useTranslations()

  const config         = CATEGORY_CONFIGS[categoryId]
  const { upsertItem } = useCalculatorCart()
  const alreadyInCart  = useCalculatorCart(selectCategoryInCart(categoryId))
  const existingItem   = useCalculatorCart(selectItemByCategory(categoryId))

  const [selections, setSelections] = useState<Record<string, string | boolean>>(
    () => buildDefaultSelections(config.fields),
  )
  const [isCalculated, setIsCalculated] = useState(false)
  const [previewPrice, setPreviewPrice] = useState<number | null>(null)

  const handleChange = useCallback(
    (fieldId: string, value: string | boolean) => {
      setSelections((prev) => {
        const next = { ...prev, [fieldId]: value }
        const liveBase = computeBasePrice(categoryId, next, config)
        setPreviewPrice(Math.round(liveBase * config.pricing.markupCoefficient))
        return next
      })
    },
    [categoryId, config],
  )

  const handleCalculate = useCallback(() => {
    const basePrice = computeBasePrice(categoryId, selections, config)
    const resolved  = buildSelections(selections, config.fields)
    const cartItem  = buildCartItem(categoryId, config.labelRu, resolved, basePrice)

    upsertItem(cartItem)
    setIsCalculated(true)
    onCalculated?.()
  }, [categoryId, selections, config, upsertItem, onCalculated])

  const handleEdit = useCallback(() => {
    setIsCalculated(false)
  }, [])

  // -------------------------------------------------------------------------
  // Bouquet — free-form amount, NO markup.
  // The client enters the budget themselves; the cart item is stored at face
  // value (subtotalWithMarkup === subtotalBeforeMarkup === amount).
  // -------------------------------------------------------------------------
  const isCustomBouquet = categoryId === 'bouquet'
  const BOUQUET_MIN = 15_000
  const BOUQUET_PRESETS = [15_000, 25_000, 35_000, 50_000]
  const [customAmount, setCustomAmount] = useState<number>(BOUQUET_MIN)

  const fmtAmount = (n: number) => n.toLocaleString('ru-RU') + ' ₽'

  const handleBouquetCalculate = useCallback(() => {
    const amount = Math.max(BOUQUET_MIN, Math.round(customAmount) || BOUQUET_MIN)

    const item: CartItem = {
      id: `category-${categoryId}`,
      categoryId,
      categoryLabelRu: config.labelRu,
      selections: [
        {
          fieldId: 'customAmount',
          labelRu: 'Сумма букета',
          labelEn: 'Bouquet budget',
          selectedValue: amount,
          selectedLabelRu: fmtAmount(amount),
          selectedLabelEn: fmtAmount(amount),
        },
      ],
      subtotalBeforeMarkup: amount,
      subtotalWithMarkup: amount,
    }

    upsertItem(item)
    setIsCalculated(true)
    onCalculated?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, config, customAmount, upsertItem, onCalculated])

  const fieldLabel = (field: CategoryField): string =>
    locale === 'en' ? field.labelEn : field.labelRu

  const optionLabel = (opt: SelectOption): string =>
    locale === 'en' ? opt.labelEn : opt.labelRu

  const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽'

  const isUrgent = URGENT_VALUES.has(
    typeof selections['urgency'] === 'string' ? (selections['urgency'] as string) : '',
  )

  const title = locale === 'en' ? config.labelEn : config.labelRu
  const description = locale === 'en' ? config.descriptionEn : config.descriptionRu

  // -------------------------------------------------------------------------
  // Render: calculated / added summary state
  // -------------------------------------------------------------------------
  if (isCalculated && existingItem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.06 }}
        className="glass-card rounded-card border-brand-gold/30 p-6 lg:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold">
              {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="font-display text-2xl font-semibold text-brand-parchment">
              {title}
            </h3>
            <p className="mt-1 text-sm text-brand-stone">{description}</p>
          </div>
          <span className="shrink-0 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-gold">
            {locale === 'en' ? 'In estimate ✓' : 'В смете ✓'}
          </span>
        </div>

        <ul className="mt-5 space-y-2 text-sm">
          {existingItem.selections.map((sel) => (
            <li key={sel.fieldId} className="flex justify-between gap-3 border-b border-brand-midnight-border/60 pb-2 last:border-0">
              <span className="text-brand-stone">
                {locale === 'en' ? sel.labelEn : sel.labelRu}
              </span>
              <span className="text-right font-medium text-brand-parchment">
                {locale === 'en' ? sel.selectedLabelEn : sel.selectedLabelRu}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between border-t border-brand-gold/20 pt-4">
          <span className="text-sm text-brand-stone">
            {locale === 'en' ? 'Subtotal (estimate)' : 'Подытог (ориентировочно)'}
          </span>
          <span className="text-lg font-semibold text-gold-gradient">
            {fmt(existingItem.subtotalWithMarkup)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleEdit}
          className="mt-3 text-sm text-brand-gold underline underline-offset-4 transition-colors hover:text-brand-gold-light"
        >
          {locale === 'en' ? 'Edit selection' : 'Изменить выбор'}
        </button>
      </motion.div>
    )
  }

  // -------------------------------------------------------------------------
  // Render: form state
  // -------------------------------------------------------------------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.06 }}
      className="glass-card rounded-card p-6 lg:p-7"
    >
      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold">
          {String(index + 1).padStart(2, '0')}
        </p>
        <h3 className="font-display text-2xl font-semibold text-brand-parchment">
          {title}
        </h3>
        <p className="mt-1 text-sm text-brand-stone">{description}</p>
      </div>

      {/* Bouquet: free-form amount input (no markup) */}
      {isCustomBouquet ? (
        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor={`${categoryId}-custom-amount`}
              className="text-sm font-medium text-brand-parchment/85"
            >
              {locale === 'en' ? 'Your bouquet budget, ₽' : 'Ваша сумма на букет, ₽'}
            </label>
            <input
              id={`${categoryId}-custom-amount`}
              type="number"
              inputMode="numeric"
              min={BOUQUET_MIN}
              step={500}
              value={customAmount}
              onChange={(e) => setCustomAmount(Number(e.target.value))}
              className="
                w-full rounded-xl border border-brand-midnight-border
                bg-brand-midnight-soft px-4 py-3 text-sm text-brand-parchment
                transition-colors duration-base
                focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/25
              "
            />
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2">
            {BOUQUET_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCustomAmount(preset)}
                className={[
                  'rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors duration-base',
                  customAmount === preset
                    ? 'border-brand-gold bg-brand-gold/15 text-brand-gold'
                    : 'border-brand-midnight-border bg-brand-midnight-soft/60 text-brand-stone hover:border-brand-gold/50 hover:text-brand-parchment',
                ].join(' ')}
              >
                {fmtAmount(preset)}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/[0.07] px-4 py-3 text-xs leading-relaxed text-brand-gold-light">
            {locale === 'en'
              ? '💐 Final price — no markup. Our florist will craft the bouquet to fit your budget and confirm the details by phone.'
              : '💐 Финальная цена — без наценки. Флорист соберёт букет под ваш бюджет и уточнит детали по телефону.'}
          </div>
        </div>
      ) : (
      /* Dynamic fields */
      <div className="space-y-5">
        {config.fields.map((field) => {
          const currentValue = selections[field.id]

          if (field.type === 'select') {
            return (
              <div key={field.id} className="flex flex-col gap-2">
                <label
                  htmlFor={`${categoryId}-${field.id}`}
                  className="text-sm font-medium text-brand-parchment/85"
                >
                  {fieldLabel(field)}
                </label>
                <div className="relative">
                  <select
                    id={`${categoryId}-${field.id}`}
                    value={typeof currentValue === 'string' ? currentValue : ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="
                      w-full appearance-none rounded-xl border border-brand-midnight-border
                      bg-brand-midnight-soft px-4 py-3 pr-10 text-sm text-brand-parchment
                      transition-colors duration-base
                      focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/25
                    "
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-brand-midnight text-brand-parchment">
                        {optionLabel(opt)}
                      </option>
                    ))}
                  </select>
                  {/* Custom chevron */}
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gold"
                    aria-hidden="true"
                  >
                    <path d="M5 7.5l5 5 5-5" />
                  </svg>
                </div>
              </div>
            )
          }

          if (field.type === 'toggle') {
            const checked = Boolean(currentValue)
            return (
              <div
                key={field.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-brand-midnight-border bg-brand-midnight-soft/60 px-4 py-3"
              >
                <span className="text-sm font-medium text-brand-parchment/85">
                  {fieldLabel(field)}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={checked}
                  aria-label={fieldLabel(field)}
                  onClick={() => handleChange(field.id, !checked)}
                  className={[
                    'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-base',
                    checked ? 'bg-brand-gold' : 'bg-brand-midnight-border',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'absolute top-0.5 h-5 w-5 rounded-full bg-brand-parchment shadow transition-transform duration-base',
                      checked ? 'translate-x-[22px]' : 'translate-x-0.5',
                    ].join(' ')}
                  />
                </button>
              </div>
            )
          }

          return null
        })}
      </div>
      )}

      {/* Urgency notice */}
      {isUrgent && (
        <div className="mt-5 rounded-xl border border-brand-gold/30 bg-brand-gold/[0.07] px-4 py-3 text-xs leading-relaxed text-brand-gold-light">
          {locale === 'en'
            ? '⚡ Urgent orders are confirmed by phone — our manager will call you within 30 minutes after the request.'
            : '⚡ Срочные заказы подтверждаются по телефону — менеджер свяжется с вами в течение 30 минут после заявки.'}
        </div>
      )}

      {/* Live price preview */}
      {previewPrice !== null && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-brand-midnight-border bg-brand-midnight-soft/60 px-4 py-3">
          <span className="text-sm text-brand-stone">
            {locale === 'en' ? 'Approximate total' : 'Ориентировочно'}
          </span>
          <span className="font-semibold text-brand-parchment">
            {fmt(previewPrice)}
          </span>
        </div>
      )}

      {/* Calculate CTA */}
      <button
        type="button"
        onClick={isCustomBouquet ? handleBouquetCalculate : handleCalculate}
        className="btn-gold-sheen sheen-always mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-btn px-6 py-3 text-sm font-semibold text-brand-ink transition-transform duration-base hover:-translate-y-0.5"
      >
        {alreadyInCart
          ? locale === 'en'
            ? 'Recalculate'
            : 'Пересчитать'
          : locale === 'en'
            ? 'Add to estimate'
            : 'Добавить в смету'}
      </button>
    </motion.div>
  )
}
