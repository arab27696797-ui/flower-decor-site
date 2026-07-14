type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = []

  const pushValue = (value: ClassValue): void => {
    if (!value) return

    if (Array.isArray(value)) {
      for (const item of value) {
        pushValue(item)
      }
      return
    }

    if (typeof value === 'string' || typeof value === 'number') {
      classes.push(String(value))
    }
  }

  for (const input of inputs) {
    pushValue(input)
  }

  return classes.join(' ')
}

export function formatPrice(value: number, locale: string = 'ru-RU'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function roundToHundreds(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.ceil(value / 100) * 100
}
