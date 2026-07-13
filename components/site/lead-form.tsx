'use client'

import { useState } from 'react'
import { useScrollReveal } from '../../hooks/use-scroll-reveal'
import type { DecorType } from './decor-calculator'

type LeadFormProps = {
  calculatorResult: {
    budget: number
    decorType: DecorType
    markup: number
    price: number
  } | null
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

export function LeadForm({ calculatorResult }: LeadFormProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [eventType, setEventType] = useState('')
  const [date, setDate] = useState('')
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState<SubmitStatus>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const cartItems = calculatorResult
      ? [
          {
            id: crypto.randomUUID(),
            productId: 'calculator-estimate',
            label:
              calculatorResult.decorType === 'live'
                ? 'Оформление живыми цветами'
                : 'Оформление искусственными цветами',
            calcType: 'decor',
            category: calculatorResult.decorType,
            quantity: 1,
            unitPrice: calculatorResult.price,
            isArtificial: calculatorResult.decorType === 'artificial',
          },
        ]
      : [
          {
            id: crypto.randomUUID(),
            productId: 'manual-request',
            label: 'Заявка без расчёта в калькуляторе',
            calcType: 'decor',
            category: 'general',
            quantity: 1,
            unitPrice: 0,
            isArtificial: false,
          },
        ]

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          eventType,
          desiredDate: date,
          comment,
          cartItems,
          deviceType: 'desktop',
        }),
      })

      const json = await res.json()

      if (json.ok) {
        setStatus('success')
        setName('')
        setPhone('')
        setEventType('')
        setDate('')
        setComment('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="lead-form"
      className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14"
    >
      <div
        ref={ref}
        className={`space-y-3 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="text-display-md font-semibold text-brand-ink">
          Расскажите о своём мероприятии
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-brand-ink/80 md:text-base">
          Мы свяжемся с вами в мессенджере или по телефону, уточним детали и
          предложим варианты оформления с ориентировочной сметой.
        </p>
      </div>

      <form
        className="mt-6 space-y-4 rounded-card border border-brand-ink/10 bg-white/95 p-5 shadow-card"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-ink">Имя</label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-card border border-brand-ink/20 bg-white px-3 py-2.5 text-sm text-brand-ink shadow-sm transition-colors duration-200 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-ink">
            Телефон / мессенджер
          </label>
          <input
            required
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-card border border-brand-ink/20 bg-white px-3 py-2.5 text-sm text-brand-ink shadow-sm transition-colors duration-200 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-ink">
            Тип события
          </label>
          <input
            required
            type="text"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            placeholder="Свадьба, день рождения, корпоратив"
            className="w-full rounded-card border border-brand-ink/20 bg-white px-3 py-2.5 text-sm text-brand-ink shadow-sm transition-colors duration-200 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-ink">
            Дата мероприятия
          </label>
          <input
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-card border border-brand-ink/20 bg-white px-3 py-2.5 text-sm text-brand-ink shadow-sm transition-colors duration-200 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-ink">
            Комментарий
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Площадка, пожелания по цветам, бюджет и любые другие детали."
            className="w-full rounded-card border border-brand-ink/20 bg-white px-3 py-2.5 text-sm text-brand-ink shadow-sm transition-colors duration-200 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center rounded-card bg-brand-forest px-5 py-2.5 text-sm font-medium text-white shadow-card transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {status === 'loading' ? 'Отправляем…' : 'Отправить заявку'}
        </button>

        {status === 'success' ? (
          <p className="text-sm font-medium text-brand-forest">
            Заявка отправлена. Мы свяжемся с вами в ближайшее время.
          </p>
        ) : null}

        {status === 'error' ? (
          <p className="text-sm font-medium text-red-700">
            Не удалось отправить заявку. Проверьте поля и попробуйте снова.
          </p>
        ) : null}

        <p className="mt-2 text-xs leading-5 text-brand-ink/65">
          Нажимая кнопку, вы соглашаетесь на обработку данных и получение
          ответа по указанным контактам.
        </p>
      </form>
    </section>
  )
}
