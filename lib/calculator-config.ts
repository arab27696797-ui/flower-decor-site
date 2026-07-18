// lib/calculator-config.ts
// Core types and default pricing configuration for the multi-accumulative estimate calculator.

// ---------------------------------------------------------------------------
// Category identifiers
// ---------------------------------------------------------------------------

export type CategoryId =
  | 'floral'
  | 'balloons'
  | 'bouquet'
  | 'event'

// ---------------------------------------------------------------------------
// Shared option shape — used across all categories
// ---------------------------------------------------------------------------

export interface SelectOption {
  value: string
  labelRu: string
  labelEn: string
  multiplier?: number
  fixedPrice?: number
}

// ---------------------------------------------------------------------------
// Per-category field definitions (drives dynamic form rendering)
// ---------------------------------------------------------------------------

export interface CategoryField {
  id: string
  labelRu: string
  labelEn: string
  type: 'select' | 'number' | 'toggle'
  options?: SelectOption[]
  min?: number
  max?: number
  step?: number
  defaultValue?: string | number | boolean
}

// ---------------------------------------------------------------------------
// Category-level pricing configuration (editable from admin)
// ---------------------------------------------------------------------------

export interface CategoryPricingConfig {
  basePrice: number
  pricePerUnit?: number
  markupCoefficient: number
}

// ---------------------------------------------------------------------------
// Full category config consumed by the UI
// ---------------------------------------------------------------------------

export interface CategoryConfig {
  id: CategoryId
  labelRu: string
  labelEn: string
  descriptionRu: string
  descriptionEn: string
  fields: CategoryField[]
  pricing: CategoryPricingConfig
}

export type PricingConfig = {
  markupMultiplier: number
  floral: {
    baseByScale: { small: number; medium: number; large: number }
    typeMultiplierDelta: { artificial: number; mixed: number }
    densitySurcharge: { dense: number }
  }
  balloons: {
    baseByScale: { small: number; medium: number; large: number }
    compositionSurcharge: { complex: number }
    addonPrice: { flowers: number }
  }
  bouquet: {
    baseBySize: { small: number; medium: number; large: number }
    urgencySurcharge: { urgent: number }
    balloonAddon: number
  }
  event: {
    baseByZone: { entrance: number; banquet: number; wedding: number; corporate: number }
    urgencySurcharge: { rush: number }
    scaleSurcharge: { large: number }
  }
}

export type CategoryPricing = PricingConfig['floral'] | PricingConfig['balloons'] | PricingConfig['bouquet'] | PricingConfig['event']

export interface SelectionEntry {
  fieldId: string
  labelRu: string
  labelEn: string
  selectedValue: string | number | boolean
  selectedLabelRu: string
  selectedLabelEn: string
}

export interface CategorySelection {
  fieldId: string
  labelRu: string
  labelEn: string
  selectedValue: string | number | boolean
  selectedLabelRu: string
  selectedLabelEn: string
}

export interface CartItem {
  id: string
  categoryId: CategoryId | string
  categoryLabelRu: string
  categoryLabelEn?: string
  selections: SelectionEntry[]
  basePrice?: number
  subtotalBeforeMarkup?: number
  subtotalWithMarkup: number
}

export interface EstimateCart {
  items: CartItem[]
  totalBeforeMarkup: number
  totalWithMarkup: number
  markupCoefficient: number
}

export function applyMarkup(base: number, coefficient: number): number {
  return Math.round(base * coefficient)
}

export const DEFAULT_MARKUP = 3.0
export const MARKUP_FACTOR = DEFAULT_MARKUP
export const MARKUP_MULTIPLIER = DEFAULT_MARKUP

// ---------------------------------------------------------------------------
// Helper: compute cart totals from items
// ---------------------------------------------------------------------------

export function computeCartTotals(
  items: CartItem[],
  markupCoefficient: number = DEFAULT_MARKUP,
): Pick<EstimateCart, 'totalBeforeMarkup' | 'totalWithMarkup'> {
  const totalBeforeMarkup = items.reduce(
    (sum, item) => sum + (item.subtotalBeforeMarkup ?? item.basePrice ?? 0),
    0,
  )

  return {
    totalBeforeMarkup,
    totalWithMarkup: applyMarkup(totalBeforeMarkup, markupCoefficient),
  }
}

// ---------------------------------------------------------------------------
// Build full estimate cart from items
// ---------------------------------------------------------------------------

export function buildEstimateCart(
  items: CartItem[],
  markupCoefficient: number = DEFAULT_MARKUP,
): EstimateCart {
  const { totalBeforeMarkup, totalWithMarkup } = computeCartTotals(
    items,
    markupCoefficient,
  )

  return {
    items,
    totalBeforeMarkup,
    totalWithMarkup,
    markupCoefficient,
  }
}

// ---------------------------------------------------------------------------
// Default pricing config per category
// ---------------------------------------------------------------------------

export const DEFAULT_PRICING: Record<CategoryId, CategoryPricingConfig> = {
  floral: {
    basePrice: 15_000,
    markupCoefficient: DEFAULT_MARKUP,
  },
  balloons: {
    basePrice: 8_000,
    pricePerUnit: 500,
    markupCoefficient: DEFAULT_MARKUP,
  },
  bouquet: {
    basePrice: 15_000,
    markupCoefficient: DEFAULT_MARKUP,
  },
  event: {
    basePrice: 30_000,
    markupCoefficient: DEFAULT_MARKUP,
  },
}

export const DEFAULT_ADMIN_PRICING: PricingConfig = {
  markupMultiplier: DEFAULT_MARKUP,
  floral: {
    baseByScale: { small: 8_000, medium: 15_000, large: 25_000 },
    typeMultiplierDelta: { artificial: 0, mixed: 1_000 },
    densitySurcharge: { dense: 3_000 },
  },
  balloons: {
    baseByScale: { small: 5_000, medium: 9_000, large: 16_000 },
    compositionSurcharge: { complex: 2_500 },
    addonPrice: { flowers: 2_000 },
  },
  bouquet: {
    baseBySize: { small: 7_000, medium: 12_000, large: 18_000 },
    urgencySurcharge: { urgent: 3_000 },
    balloonAddon: 1_500,
  },
  event: {
    baseByZone: { entrance: 12_000, banquet: 25_000, wedding: 35_000, corporate: 30_000 },
    urgencySurcharge: { rush: 5_000 },
    scaleSurcharge: { large: 8_000 },
  },
}

// ---------------------------------------------------------------------------
// Floral category field definitions
// ---------------------------------------------------------------------------

const floralFields: CategoryField[] = [
  {
    id: 'eventType',
    labelRu: 'Тип мероприятия',
    labelEn: 'Event type',
    type: 'select',
    options: [
      { value: 'wedding', labelRu: 'Свадьба', labelEn: 'Wedding', multiplier: 1.4 },
      { value: 'corporate', labelRu: 'Корпоратив', labelEn: 'Corporate event', multiplier: 1.2 },
      { value: 'birthday', labelRu: 'День рождения', labelEn: 'Birthday', multiplier: 1.0 },
      { value: 'entrance', labelRu: 'Входная зона', labelEn: 'Entrance zone', multiplier: 1.1 },
      { value: 'exhibition', labelRu: 'Выставка / презентация', labelEn: 'Exhibition', multiplier: 1.15 },
      { value: 'other', labelRu: 'Другое', labelEn: 'Other', multiplier: 1.0 },
    ],
    defaultValue: 'wedding',
  },
  {
    id: 'flowerType',
    labelRu: 'Тип цветов',
    labelEn: 'Flower type',
    type: 'select',
    options: [
      { value: 'artificial', labelRu: 'Искусственные', labelEn: 'Artificial', multiplier: 0.85 },
      { value: 'fresh', labelRu: 'Живые', labelEn: 'Fresh', multiplier: 1.2 },
      { value: 'mixed', labelRu: 'Смешанные', labelEn: 'Mixed', multiplier: 1.05 },
    ],
    defaultValue: 'fresh',
  },
  {
    id: 'scale',
    labelRu: 'Масштаб оформления',
    labelEn: 'Decoration scale',
    type: 'select',
    options: [
      { value: 'small', labelRu: 'Небольшое (до 30 кв. м)', labelEn: 'Small (up to 30 m²)', multiplier: 0.8 },
      { value: 'medium', labelRu: 'Среднее (30–80 кв. м)', labelEn: 'Medium (30–80 m²)', multiplier: 1.0 },
      { value: 'large', labelRu: 'Большое (80–200 кв. м)', labelEn: 'Large (80–200 m²)', multiplier: 1.5 },
      { value: 'xlarge', labelRu: 'Масштабное (200+ кв. м)', labelEn: 'Extra large (200+ m²)', multiplier: 2.2 },
    ],
    defaultValue: 'medium',
  },
  {
    id: 'density',
    labelRu: 'Плотность / стиль',
    labelEn: 'Style / density',
    type: 'select',
    options: [
      { value: 'minimal', labelRu: 'Минималистичный', labelEn: 'Minimal', multiplier: 0.8 },
      { value: 'standard', labelRu: 'Стандартный', labelEn: 'Standard', multiplier: 1.0 },
      { value: 'lush', labelRu: 'Пышный / роскошный', labelEn: 'Lush', multiplier: 1.35 },
    ],
    defaultValue: 'standard',
  },
]

// ---------------------------------------------------------------------------
// Balloon category field definitions
// ---------------------------------------------------------------------------

const balloonFields: CategoryField[] = [
  {
    id: 'eventType',
    labelRu: 'Тип мероприятия',
    labelEn: 'Event type',
    type: 'select',
    options: [
      { value: 'wedding', labelRu: 'Свадьба', labelEn: 'Wedding', multiplier: 1.3 },
      { value: 'birthday', labelRu: 'День рождения', labelEn: 'Birthday', multiplier: 1.0 },
      { value: 'corporate', labelRu: 'Корпоратив', labelEn: 'Corporate event', multiplier: 1.15 },
      { value: 'kids', labelRu: 'Детский праздник', labelEn: 'Kids party', multiplier: 0.9 },
      { value: 'other', labelRu: 'Другое', labelEn: 'Other', multiplier: 1.0 },
    ],
    defaultValue: 'birthday',
  },
  {
    id: 'scale',
    labelRu: 'Масштаб',
    labelEn: 'Scale',
    type: 'select',
    options: [
      { value: 'small', labelRu: 'Небольшое', labelEn: 'Small', multiplier: 0.7 },
      { value: 'medium', labelRu: 'Среднее', labelEn: 'Medium', multiplier: 1.0 },
      { value: 'large', labelRu: 'Большое', labelEn: 'Large', multiplier: 1.6 },
    ],
    defaultValue: 'medium',
  },
  {
    id: 'compositionLevel',
    labelRu: 'Сложность композиции',
    labelEn: 'Composition complexity',
    type: 'select',
    options: [
      { value: 'simple', labelRu: 'Простая (арки, гирлянды)', labelEn: 'Simple (arches, garlands)', multiplier: 0.85 },
      { value: 'medium', labelRu: 'Средняя (колонны, панно)', labelEn: 'Medium (columns, panels)', multiplier: 1.0 },
      { value: 'complex', labelRu: 'Сложная (инсталляции)', labelEn: 'Complex (installations)', multiplier: 1.4 },
    ],
    defaultValue: 'medium',
  },
  {
    id: 'extraHelium',
    labelRu: 'Гелиевые шары (дополнительно)',
    labelEn: 'Extra helium balloons',
    type: 'toggle',
    defaultValue: false,
  },
]

// ---------------------------------------------------------------------------
// Bouquet category field definitions
// ---------------------------------------------------------------------------

const bouquetFields: CategoryField[] = [
  {
    id: 'occasion',
    labelRu: 'Повод',
    labelEn: 'Occasion',
    type: 'select',
    options: [
      { value: 'birthday', labelRu: 'День рождения', labelEn: 'Birthday', multiplier: 1.0 },
      { value: 'wedding', labelRu: 'Свадьба', labelEn: 'Wedding', multiplier: 1.3 },
      { value: 'anniversary', labelRu: 'Годовщина', labelEn: 'Anniversary', multiplier: 1.1 },
      { value: 'corporate', labelRu: 'Корпоративный', labelEn: 'Corporate gift', multiplier: 1.05 },
      { value: 'other', labelRu: 'Другое', labelEn: 'Other', multiplier: 1.0 },
    ],
    defaultValue: 'birthday',
  },
  {
    id: 'bouquetSize',
    labelRu: 'Размер букета',
    labelEn: 'Bouquet size',
    type: 'select',
    options: [
      { value: 'small', labelRu: 'Небольшой (15–20 стеблей)', labelEn: 'Small (15–20 stems)', fixedPrice: 15_000 },
      { value: 'medium', labelRu: 'Средний (25–35 стеблей)', labelEn: 'Medium (25–35 stems)', fixedPrice: 22_000 },
      { value: 'large', labelRu: 'Большой (40–60 стеблей)', labelEn: 'Large (40–60 stems)', fixedPrice: 35_000 },
      { value: 'premium', labelRu: 'Премиальный (60+ стеблей)', labelEn: 'Premium (60+ stems)', fixedPrice: 55_000 },
    ],
    defaultValue: 'small',
  },
  {
    id: 'addBalloons',
    labelRu: 'Добавить шары к букету',
    labelEn: 'Add balloons to bouquet',
    type: 'toggle',
    defaultValue: false,
  },
  {
    id: 'urgency',
    labelRu: 'Срочность',
    labelEn: 'Urgency',
    type: 'select',
    options: [
      { value: 'standard', labelRu: 'Стандартная (1–2 дня)', labelEn: 'Standard (1–2 days)', multiplier: 1.0 },
      { value: 'same_day', labelRu: 'В день обращения', labelEn: 'Same day', multiplier: 1.2 },
      { value: 'express', labelRu: 'Экспресс (2–4 часа)', labelEn: 'Express (2–4 hours)', multiplier: 1.4 },
    ],
    defaultValue: 'standard',
  },
]

// ---------------------------------------------------------------------------
// General event category field definitions
// ---------------------------------------------------------------------------

const eventFields: CategoryField[] = [
  {
    id: 'eventType',
    labelRu: 'Тип мероприятия',
    labelEn: 'Event type',
    type: 'select',
    options: [
      { value: 'wedding', labelRu: 'Свадьба', labelEn: 'Wedding', multiplier: 1.5 },
      { value: 'corporate', labelRu: 'Корпоративное мероприятие', labelEn: 'Corporate event', multiplier: 1.3 },
      { value: 'birthday', labelRu: 'День рождения', labelEn: 'Birthday party', multiplier: 1.0 },
      { value: 'entrance', labelRu: 'Входная / арочная зона', labelEn: 'Entrance / arch zone', multiplier: 0.9 },
      { value: 'exhibition', labelRu: 'Выставка / презентация', labelEn: 'Exhibition / promo', multiplier: 1.2 },
      { value: 'gala', labelRu: 'Гала-вечер / торжественный зал', labelEn: 'Gala / banquet', multiplier: 1.6 },
      { value: 'other', labelRu: 'Другое', labelEn: 'Other', multiplier: 1.0 },
    ],
    defaultValue: 'wedding',
  },
  {
    id: 'zoneType',
    labelRu: 'Тип зоны',
    labelEn: 'Zone type',
    type: 'select',
    options: [
      { value: 'full_hall', labelRu: 'Весь зал', labelEn: 'Full hall', multiplier: 1.5 },
      { value: 'photo_zone', labelRu: 'Фотозона', labelEn: 'Photo zone', multiplier: 0.7 },
      { value: 'entrance', labelRu: 'Входная группа', labelEn: 'Entrance group', multiplier: 0.8 },
      { value: 'table_decor', labelRu: 'Столовая / банкетная зона', labelEn: 'Table / banquet area', multiplier: 1.0 },
      { value: 'stage', labelRu: 'Сцена / подиум', labelEn: 'Stage / podium', multiplier: 1.1 },
    ],
    defaultValue: 'full_hall',
  },
  {
    id: 'scale',
    labelRu: 'Масштаб',
    labelEn: 'Scale',
    type: 'select',
    options: [
      { value: 'small', labelRu: 'До 50 гостей', labelEn: 'Up to 50 guests', multiplier: 0.75 },
      { value: 'medium', labelRu: '50–150 гостей', labelEn: '50–150 guests', multiplier: 1.0 },
      { value: 'large', labelRu: '150–300 гостей', labelEn: '150–300 guests', multiplier: 1.5 },
      { value: 'xlarge', labelRu: '300+ гостей', labelEn: '300+ guests', multiplier: 2.0 },
    ],
    defaultValue: 'medium',
  },
  {
    id: 'urgency',
    labelRu: 'Срочность',
    labelEn: 'Urgency',
    type: 'select',
    options: [
      { value: 'standard', labelRu: 'Стандартная (от 3 дней)', labelEn: 'Standard (3+ days)', multiplier: 1.0 },
      { value: 'urgent', labelRu: 'Срочная (24 часа)', labelEn: 'Urgent (24 hours)', multiplier: 1.25 },
      { value: 'express', labelRu: 'Экспресс (менее 12 ч)', labelEn: 'Express (< 12 hours)', multiplier: 1.5 },
    ],
    defaultValue: 'standard',
  },
]

// ---------------------------------------------------------------------------
// Master category configs map — single source of truth
// ---------------------------------------------------------------------------

export const CATEGORY_CONFIGS: Record<CategoryId, CategoryConfig> = {
  floral: {
    id: 'floral',
    labelRu: 'Цветочное оформление',
    labelEn: 'Floral decoration',
    descriptionRu: 'Оформление живыми, искусственными или смешанными цветами',
    descriptionEn: 'Decoration with fresh, artificial, or mixed flowers',
    fields: floralFields,
    pricing: DEFAULT_PRICING.floral,
  },
  balloons: {
    id: 'balloons',
    labelRu: 'Воздушные шары',
    labelEn: 'Balloon decoration',
    descriptionRu: 'Арки, гирлянды, панно, инсталляции из шаров',
    descriptionEn: 'Arches, garlands, panels, and balloon installations',
    fields: balloonFields,
    pricing: DEFAULT_PRICING.balloons,
  },
  bouquet: {
    id: 'bouquet',
    labelRu: 'Срочный букет от 15 000 ₽',
    labelEn: 'Urgent bouquet from ₽15,000',
    descriptionRu: 'Букеты из свежих цветов с доставкой в день заказа',
    descriptionEn: 'Fresh flower bouquets with same-day delivery option',
    fields: bouquetFields,
    pricing: DEFAULT_PRICING.bouquet,
  },
  event: {
    id: 'event',
    labelRu: 'Оформление мероприятия',
    labelEn: 'Event decoration',
    descriptionRu: 'Свадьбы, корпоративы, входные группы — под ключ за 24 часа',
    descriptionEn: 'Weddings, corporate events, entrance zones — turnkey within 24 hours',
    fields: eventFields,
    pricing: DEFAULT_PRICING.event,
  },
}

// ---------------------------------------------------------------------------
// Convenience array of all category IDs in display order
// ---------------------------------------------------------------------------

export const CATEGORY_ORDER: CategoryId[] = ['floral', 'balloons', 'bouquet', 'event']
