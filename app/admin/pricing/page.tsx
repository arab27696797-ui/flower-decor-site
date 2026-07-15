// app/admin/pricing/page.tsx
// PRIMA Decor — Admin: Calculator Pricing Configuration.
// Allows non-technical staff to view and edit calculator base prices.
// Fetches current config from GET /api/admin/pricing on mount.
// Saves changes via PATCH /api/admin/pricing (deep partial merge).
//
// CLIENT COMPONENT — required for interactive form state, fetch, and UI feedback.
// All helper components are defined in this file to satisfy the single-file rule.
//
// PERSISTENCE: Changes survive only within the current server process.
// A visible warning informs staff of this limitation.

'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { PricingConfig } from '@/lib/calculator-config'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LoadState = 'idle' | 'loading' | 'ready' | 'error'
type SaveState = 'idle' | 'saving' | 'saved' | 'error'

// ---------------------------------------------------------------------------
// Helper: format a number for display in an input field
// ---------------------------------------------------------------------------

function fmt(n: number): string {
  return String(n)
}

// ---------------------------------------------------------------------------
// Helper: parse an input string to a number, fallback to 0
// ---------------------------------------------------------------------------

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) && n >= 0 ? n : 0
}

// ---------------------------------------------------------------------------
// Sub-components — defined inline (single-file rule)
// ---------------------------------------------------------------------------

/** Labelled numeric input — accessible, styled for staff use */
function PriceField({
  label,
  value,
  onChange,
  unit = '₽',
  description,
}: {
  label: string
  value: number
  onChange: (val: number) => void
  unit?: string
  description?: string
}) {
  const id = useRef(
    `price-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.random()
      .toString(36)
      .slice(2, 7)}`
  ).current

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-brand-ink"
      >
        {label}
      </label>
      {description && (
        <p className="text-xs text-brand-ink/50 leading-snug">{description}</p>
      )}
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          min={0}
          step={500}
          value={fmt(value)}
          onChange={(e) => onChange(parseNum(e.target.value))}
          className="
            w-full rounded-lg border border-brand-ink/15
            bg-white px-3 py-2
            text-sm text-brand-ink
            placeholder:text-brand-ink/30
            focus:outline-none focus:ring-2 focus:ring-brand-gold
            transition-shadow duration-150
          "
        />
        <span className="shrink-0 text-sm text-brand-ink/45 w-4">{unit}</span>
      </div>
    </div>
  )
}

/** Section card wrapper — groups related price fields */
function PriceSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section
      aria-labelledby={`section-${title.replace(/\s/g, '-').toLowerCase()}`}
      className="
        rounded-xl border border-brand-ink/8
        bg-white shadow-card
        overflow-hidden
      "
    >
      <div className="px-6 py-4 border-b border-brand-ink/8 bg-brand-cream/60">
        <h2
          id={`section-${title.replace(/\s/g, '-').toLowerCase()}`}
          className="font-display text-display-md text-brand-ink"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-xs text-brand-ink/50">{description}</p>
        )}
      </div>
      <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {children}
      </div>
    </section>
  )
}

/** Alert banner — info, warning, success, or error */
function Alert({
  type,
  children,
}: {
  type: 'info' | 'warning' | 'success' | 'error'
  children: React.ReactNode
}) {
  const styles: Record<string, string> = {
    info:    'bg-blue-50    border-blue-200    text-blue-800',
    warning: 'bg-amber-50   border-amber-200   text-amber-800',
    success: 'bg-green-50   border-green-200   text-green-800',
    error:   'bg-red-50     border-red-200     text-red-800',
  }
  const icons: Record<string, string> = {
    info:    'ℹ️',
    warning: '⚠️',
    success: '✅',
    error:   '❌',
  }
  return (
    <div
      role="alert"
      className={`
        flex items-start gap-2.5 rounded-lg border
        px-4 py-3 text-sm leading-relaxed
        ${styles[type]}
      `}
    >
      <span aria-hidden="true" className="mt-0.5 shrink-0">{icons[type]}</span>
      <div>{children}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function AdminPricingPage() {
  // ---- State ----
  const [loadState, setLoadState]   = useState<LoadState>('idle')
  const [saveState, setSaveState]   = useState<SaveState>('idle')
  const [loadError, setLoadError]   = useState<string | null>(null)
  const [saveError, setSaveError]   = useState<string | null>(null)
  const [config, setConfig]         = useState<PricingConfig | null>(null)

  // ---- Load pricing on mount ----
  const loadPricing = useCallback(async () => {
    setLoadState('loading')
    setLoadError(null)

    try {
      const res = await fetch('/api/admin/pricing', { cache: 'no-store' })

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`)
      }

      const json = await res.json() as { success: boolean; data: PricingConfig }

      if (!json.success || !json.data) {
        throw new Error('Unexpected response format from server.')
      }

      setConfig(json.data)
      setLoadState('ready')
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : 'Unknown error loading pricing.'
      )
      setLoadState('error')
    }
  }, [])

  useEffect(() => {
    loadPricing()
  }, [loadPricing])

  // ---- Save pricing ----
  const handleSave = async () => {
    if (!config) return

    setSaveState('saving')
    setSaveError(null)

    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })

      const json = await res.json() as {
        success: boolean
        message?: string
        error?: string
        details?: string[]
      }

      if (!res.ok || !json.success) {
        const msg = json.details
          ? json.details.join('; ')
          : (json.error ?? `Server returned ${res.status}`)
        throw new Error(msg)
      }

      setSaveState('saved')

      // Reset saved indicator after 3 seconds
      setTimeout(() => setSaveState('idle'), 3000)
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Unknown error saving pricing.'
      )
      setSaveState('error')
    }
  }

  // ---- Typed setters for nested config fields ----
  // These helpers produce a new config object on each change (immutable updates).

  function setFloral(
    key: keyof PricingConfig['floral'] & string,
    subKey: string,
    val: number
  ) {
    if (!config) return
    setConfig({
      ...config,
      floral: {
        ...config.floral,
        [key]: { ...(config.floral[key] as Record<string, number>), [subKey]: val },
      },
    })
  }

  function setBalloons(
    key: keyof PricingConfig['balloons'] & string,
    subKey: string,
    val: number
  ) {
    if (!config) return
    setConfig({
      ...config,
      balloons: {
        ...config.balloons,
        [key]: { ...(config.balloons[key] as Record<string, number>), [subKey]: val },
      },
    })
  }

  function setBouquet(
    key: keyof Omit<PricingConfig['bouquet'], 'balloonAddon'> & string,
    subKey: string,
    val: number
  ) {
    if (!config) return
    setConfig({
      ...config,
      bouquet: {
        ...config.bouquet,
        [key]: { ...(config.bouquet[key] as Record<string, number>), [subKey]: val },
      },
    })
  }

  function setEvent(
    key: keyof PricingConfig['event'] & string,
    subKey: string,
    val: number
  ) {
    if (!config) return
    setConfig({
      ...config,
      event: {
        ...config.event,
        [key]: { ...(config.event[key] as Record<string, number>), [subKey]: val },
      },
    })
  }

  function setMarkup(val: number) {
    if (!config) return
    setConfig({ ...config, markupMultiplier: val })
  }

  // ---------------------------------------------------------------------------
  // Render states
  // ---------------------------------------------------------------------------

  if (loadState === 'loading' || loadState === 'idle') {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-brand-ink/50 text-sm animate-pulse">
          Загрузка настроек цен…
        </p>
      </div>
    )
  }

  if (loadState === 'error') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-4">
        <Alert type="error">
          <strong>Ошибка загрузки настроек:</strong> {loadError}
        </Alert>
        <button
          onClick={loadPricing}
          className="
            rounded-lg bg-brand-forest px-4 py-2
            text-sm font-medium text-white
            hover:bg-brand-forest-dark active:bg-brand-forest-dark
            transition-colors duration-150
          "
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  if (!config) return null

  // ---------------------------------------------------------------------------
  // Full editor
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 space-y-8">

      {/* ---- Page header ---- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-display-lg text-brand-ink">
            Настройка цен калькулятора
          </h1>
          <p className="mt-1 text-sm text-brand-ink/55">
            Измените базовые цены и нажмите «Сохранить». Калькулятор на сайте
            обновится немедленно.
          </p>
        </div>

        {/* Save button */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          <button
            onClick={handleSave}
            disabled={saveState === 'saving'}
            aria-busy={saveState === 'saving'}
            className="
              inline-flex items-center gap-2
              rounded-lg bg-brand-forest px-5 py-2.5
              text-sm font-semibold text-white
              hover:bg-brand-forest-dark active:bg-brand-forest-dark
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-brand-gold focus-visible:ring-offset-2
            "
          >
            {saveState === 'saving' ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin"
                />
                Сохранение…
              </>
            ) : saveState === 'saved' ? (
              <>✓ Сохранено</>
            ) : (
              'Сохранить цены'
            )}
          </button>

          {saveState === 'saved' && (
            <p className="text-xs text-green-700">
              Изменения применены до перезапуска сервера.
            </p>
          )}
        </div>
      </div>

      {/* ---- Persistence warning ---- */}
      <Alert type="warning">
        <strong>Важно:</strong> Изменения хранятся в памяти сервера и сбрасываются
        при перезапуске (деплое). Для постоянного хранения необходимо подключить базу данных.
        После каждого деплоя цены нужно будет ввести повторно, если они отличаются от стандартных.
      </Alert>

      {/* ---- Save error ---- */}
      {saveState === 'error' && saveError && (
        <Alert type="error">
          <strong>Ошибка при сохранении:</strong> {saveError}
        </Alert>
      )}

      {/* ---- Instructions ---- */}
      <details className="rounded-xl border border-brand-ink/8 bg-brand-cream/50 overflow-hidden">
        <summary className="
          cursor-pointer select-none
          px-5 py-3.5 text-sm font-semibold text-brand-forest
          hover:bg-brand-cream transition-colors duration-150
          list-none flex items-center gap-2
        ">
          <span aria-hidden="true">📋</span>
          Как пользоваться этой страницей
        </summary>
        <div className="px-5 pb-4 pt-2 text-sm text-brand-ink/70 leading-relaxed space-y-2">
          <p>
            <strong>Базовые цены</strong> — это начальная стоимость услуги при минимальном объёме.
            Итоговая цена в калькуляторе рассчитывается на основе этих значений с учётом
            выбранных параметров и наценки.
          </p>
          <p>
            <strong>Наценка (множитель)</strong> — коэффициент, умножающийся на сумму.
            Значение 1.30 означает +30% к базовой цене. Рекомендуемый диапазон: 1.20 – 1.50.
          </p>
          <p>
            <strong>Как изменить цену:</strong> кликните на поле → введите новое значение
            → нажмите «Сохранить цены» вверху страницы.
          </p>
          <p>
            <strong>Все суммы</strong> указываются в рублях (₽) без НДС.
          </p>
        </div>
      </details>

      {/* ================================================================
          MARKUP MULTIPLIER
         ================================================================ */}
      <PriceSection
        title="Наценка калькулятора"
        description="Коэффициент применяется ко всем категориям. 1.30 = +30% к базовой цене."
      >
        <PriceField
          label="Множитель наценки"
          value={config.markupMultiplier}
          onChange={setMarkup}
          unit="×"
          description="Например: 1.30 для 30% наценки"
        />
      </PriceSection>

      {/* ================================================================
          FLORAL DECORATION PRICES
         ================================================================ */}
      <PriceSection
        title="А. Цветочное оформление"
        description="Базовые цены по масштабу и типу цветов."
      >
        <PriceField
          label="Малый масштаб — живые цветы"
          value={config.floral.baseByScale.small}
          onChange={(v) => setFloral('baseByScale', 'small', v)}
          description="Небольшая входная группа, стол, арка"
        />
        <PriceField
          label="Средний масштаб — живые цветы"
          value={config.floral.baseByScale.medium}
          onChange={(v) => setFloral('baseByScale', 'medium', v)}
          description="Средний зал, несколько зон"
        />
        <PriceField
          label="Крупный масштаб — живые цветы"
          value={config.floral.baseByScale.large}
          onChange={(v) => setFloral('baseByScale', 'large', v)}
          description="Большой зал, полное оформление"
        />
        <PriceField
          label="Надбавка: искусственные цветы"
          value={config.floral.typeMultiplierDelta.artificial}
          onChange={(v) => setFloral('typeMultiplierDelta', 'artificial', v)}
          unit="₽"
          description="Прибавляется к базовой цене при выборе искусственных"
        />
        <PriceField
          label="Надбавка: смешанные цветы"
          value={config.floral.typeMultiplierDelta.mixed}
          onChange={(v) => setFloral('typeMultiplierDelta', 'mixed', v)}
          unit="₽"
          description="Прибавляется при выборе смешанного варианта"
        />
        <PriceField
          label="Надбавка: плотная композиция"
          value={config.floral.densitySurcharge.dense}
          onChange={(v) => setFloral('densitySurcharge', 'dense', v)}
          unit="₽"
          description="Доплата за высокую плотность декора"
        />
      </PriceSection>

      {/* ================================================================
          BALLOON DECORATION PRICES
         ================================================================ */}
      <PriceSection
        title="Б. Воздушные шары"
        description="Базовые цены по масштабу оформления шарами."
      >
        <PriceField
          label="Малый масштаб"
          value={config.balloons.baseByScale.small}
          onChange={(v) => setBalloons('baseByScale', 'small', v)}
          description="Несколько гирлянд, небольшая арка"
        />
        <PriceField
          label="Средний масштаб"
          value={config.balloons.baseByScale.medium}
          onChange={(v) => setBalloons('baseByScale', 'medium', v)}
          description="Полное оформление зала шарами"
        />
        <PriceField
          label="Крупный масштаб"
          value={config.balloons.baseByScale.large}
          onChange={(v) => setBalloons('baseByScale', 'large', v)}
          description="Масштабная инсталляция, большое мероприятие"
        />
        <PriceField
          label="Надбавка: сложная композиция"
          value={config.balloons.compositionSurcharge.complex}
          onChange={(v) => setBalloons('compositionSurcharge', 'complex', v)}
          unit="₽"
          description="Доплата за нестандартные формы и конструкции"
        />
        <PriceField
          label="Надбавка: доп. элементы (цветы, гирлянды)"
          value={config.balloons.addonPrice.flowers}
          onChange={(v) => setBalloons('addonPrice', 'flowers', v)}
          unit="₽"
          description="Стоимость дополнения к шарному оформлению"
        />
      </PriceSection>

      {/* ================================================================
          BOUQUET PRICES
         ================================================================ */}
      <PriceSection
        title="В. Срочный букет"
        description="Базовая стоимость букетов разного размера."
      >
        <PriceField
          label="Небольшой букет"
          value={config.bouquet.baseBySize.small}
          onChange={(v) => setBouquet('baseBySize', 'small', v)}
          description="Минимальная стоимость"
        />
        <PriceField
          label="Средний букет"
          value={config.bouquet.baseBySize.medium}
          onChange={(v) => setBouquet('baseBySize', 'medium', v)}
        />
        <PriceField
          label="Большой букет"
          value={config.bouquet.baseBySize.large}
          onChange={(v) => setBouquet('baseBySize', 'large', v)}
        />
        <PriceField
          label="Надбавка: срочность (2–4 часа)"
          value={config.bouquet.urgencySurcharge.urgent}
          onChange={(v) => setBouquet('urgencySurcharge', 'urgent', v)}
          unit="₽"
          description="Доплата за срочное исполнение"
        />
        <PriceField
          label="Надбавка: добавить шары к букету"
          value={config.bouquet.balloonAddon}
          onChange={(val) => {
            if (!config) return
            setConfig({ ...config, bouquet: { ...config.bouquet, balloonAddon: val } })
          }}
          unit="₽"
          description="Стоимость добавления небольшой шаровой композиции"
        />
      </PriceSection>

      {/* ================================================================
          EVENT DECORATION PRICES
         ================================================================ */}
      <PriceSection
        title="Г. Оформление мероприятий"
        description="Базовые цены по типу зоны и масштабу."
      >
        <PriceField
          label="Входная группа"
          value={config.event.baseByZone.entrance}
          onChange={(v) => setEvent('baseByZone', 'entrance', v)}
          description="Оформление входной зоны"
        />
        <PriceField
          label="Банкетный зал"
          value={config.event.baseByZone.banquet}
          onChange={(v) => setEvent('baseByZone', 'banquet', v)}
        />
        <PriceField
          label="Свадебная зона"
          value={config.event.baseByZone.wedding}
          onChange={(v) => setEvent('baseByZone', 'wedding', v)}
        />
        <PriceField
          label="Корпоративное мероприятие"
          value={config.event.baseByZone.corporate}
          onChange={(v) => setEvent('baseByZone', 'corporate', v)}
        />
        <PriceField
          label="Надбавка: срочность (до 24 ч)"
          value={config.event.urgencySurcharge.rush}
          onChange={(v) => setEvent('urgencySurcharge', 'rush', v)}
          unit="₽"
          description="Доплата при срочном заказе"
        />
        <PriceField
          label="Надбавка: крупный масштаб"
          value={config.event.scaleSurcharge.large}
          onChange={(v) => setEvent('scaleSurcharge', 'large', v)}
          unit="₽"
          description="Доплата за большой объём оформления"
        />
      </PriceSection>

      {/* ---- Bottom save bar — sticky on scroll for convenience ---- */}
      <div className="
        sticky bottom-4 z-10
        flex items-center justify-between gap-4
        rounded-xl border border-brand-gold/30
        bg-white/90 backdrop-blur-sm
        shadow-panel
        px-5 py-3.5
      ">
        <p className="text-xs text-brand-ink/55">
          Проверьте все значения перед сохранением.
        </p>
        <button
          onClick={handleSave}
          disabled={saveState === 'saving'}
          aria-busy={saveState === 'saving'}
          className="
            inline-flex items-center gap-2
            rounded-lg bg-brand-forest px-5 py-2.5
            text-sm font-semibold text-white
            hover:bg-brand-forest-dark
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-brand-gold focus-visible:ring-offset-2
          "
        >
          {saveState === 'saving' ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin"
              />
              Сохранение…
            </>
          ) : saveState === 'saved' ? (
            '✓ Сохранено'
          ) : (
            'Сохранить цены'
          )}
        </button>
      </div>

    </div>
  )
}
