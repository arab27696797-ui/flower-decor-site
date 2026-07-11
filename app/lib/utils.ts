export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function formatPrice(value: number, locale = 'ru-RU', currency = 'RUB') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function roundToHundreds(value: number) {
  return Math.round(value / 100) * 100
}
