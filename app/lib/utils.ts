import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  return Math.ceil(value / 100) * 100
}
