'use client'

import { useState } from 'react'

type PricingResponse =
  | { ok: true; data: { finalPrice: number } }
  | { ok: false; error: string }

type LeadResponse =
  | { ok: true; data: { id: string } }
  | { ok: false; error: string; issues?: unknown }

export default function HomePage() {
  const [pricingLoading, setPricingLoading] = useState(false)
  const [pricingError, setPricingError] = useState<string | null>(null)
  const [finalPrice, setFinalPrice] = useState<number | null>(null)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [eventType, setEventType] = useState('')
  const [desiredDate, setDesiredDate] = useState('')
  const [comment, setComment] = useState('')

  const [leadLoading, setLeadLoading] = useState(false)
  const [leadError, setLeadError] = useState<string | null>(null)
  const [leadSuccess, setLeadSuccess] = useState(false)

  async function handleCalculatePrice(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPricingLoading(true)
    setPricingError(null)
    setFinalPrice(null)

    const formData = new FormData(e.currentTarget)
    const marketPrice = Number(formData.get('marketPrice') || 0)
    const flowerTypeCoef = Number(formData.get('flowerTypeCoef') || 1)
    const markupPercent = Number(formData.get('markupPercent') || 30)

    try {
      const res = await fetch('/api/pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          marketPrice,
          flowerTypeCoef,
          markupPercent,
        }),
      })

      const data = (await res.json()) as PricingResponse

      if (!res.ok || !data.ok) {
        setPricingError('Не удалось посчитать стоимость. Попробуйте ещё раз.')
        return
      }

      setFinalPrice(data.data.finalPrice)
    } catch {
      setPricingError('Произошла ошибка при запросе. Попробуйте ещё раз.')
    } finally {
      setPricingLoading(false)
    }
  }

  async function handleLeadSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLeadLoading(true)
    setLeadError(null)
    setLeadSuccess(false)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          eventType,
          desiredDate,
          comment: comment || undefined,
          // минимальный payload: пустой массив cartItems, чтобы пройти Zod
          cartItems: [],
          deviceType: 'unknown',
        }),
      })

      const data = (await res.json()) as LeadResponse

      if (!res.ok || !data.ok) {
        setLeadError('Не удалось отправить заявку. Попробуйте ещё раз.')
        return
      }

      setLeadSuccess(true)
      setName('')
      setPhone('')
      setEventType('')
      setDesiredDate('')
      setComment('')
    } catch {
      setLeadError('Произошла ошибка при отправке. Попробуйте ещё раз.')
    } finally {
      setLeadLoading(false)
    }
  }

  function scrollToSection(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="min-h-screen bg-brand-cream text-brand-ink">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-brand-ink/10 bg-brand-cream/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-forest/70">
              Premium Event Decor
            </span>
            <span className="text-sm font-semibold text-brand-ink">
              Цветы и шары для мероприятий в Москве
            </span>
          </div>

          <nav className="hidden items-center gap-5 text-sm font-medium text-brand-ink/80 sm:flex">
            <button
              type="button"
              onClick={() => scrollToSection('portfolio')}
              className="transition-colors duration-200 hover:text-brand-ink"
            >
              Портфолио
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('pricing')}
              className="transition-colors duration-200 hover:text-brand-ink"
            >
              Цены
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('lead-form')}
              className="transition-colors duration-200 hover:text-brand-ink"
            >
              Заявка
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contacts')}
              className="rounded-full border border-brand-forest/60 bg-brand-forest px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-sm transition-colors hover:bg-brand-forest/90"
            >
              Оставить заявку
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        {/* Hero */}
        <section className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
          <div>
            <h1 className="text-3xl font-semibold leading-tight text-brand-ink sm:text-4xl md:text-5xl">
              Премиальный декор мероприятий
              <span className="block text-brand-forest">в Москве и области</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-brand-ink/80 sm:text-base">
              Комплексное оформление цветами и воздушными шарами для свадеб, дней рождения,
              детских праздников и корпоративов. Без шаблонов, с аккуратным монтажом и
              понятной стоимостью.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollToSection('pricing')}
                className="inline-flex min-h-11 items-center justify-center rounded-card bg-brand-forest px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-forest/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream"
              >
                Рассчитать стоимость
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('lead-form')}
                className="inline-flex min-h-11 items-center justify-center rounded-card border border-brand-forest/40 bg-brand-gold/10 px-5 py-3 text-sm font-semibold text-brand-ink transition-colors duration-200 hover:bg-brand-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream"
              >
                Оставить заявку
              </button>
            </div>

            <dl className="mt-6 grid gap-4 text-sm text-brand-ink/75 sm:grid-cols-3">
              <div>
                <dt className="font-semibold text-brand-ink">Город</dt>
                <dd className="mt-1">Москва и ближайшее Подмосковье</dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-ink">Форматы</dt>
                <dd className="mt-1">Свадьбы, дни рождения, корпоративы</dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-ink">Материалы</dt>
                <dd className="mt-1">Живые и искусственные цветы, шары</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-card border border-brand-ink/10 bg-white/90 p-4 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-forest/70">
              Как это работает
            </p>
            <ol className="mt-3 space-y-3 text-sm leading-6 text-brand-ink/80">
              <li>
                <span className="font-semibold text-brand-ink">1. Опишите задачу.</span>{' '}
                Кратко расскажите про формат мероприятия, площадку и желаемый стиль.
              </li>
              <li>
                <span className="font-semibold text-brand-ink">2. Получите расчёт.</span>{' '}
                Мы посчитаем стоимость по вашим вводным и предложим несколько вариантов.
              </li>
              <li>
                <span className="font-semibold text-brand-ink">3. Утверждение макета.</span>{' '}
                Согласуем схему расстановки декора и финальный бюджет.
              </li>
              <li>
                <span className="font-semibold text-brand-ink">4. Монтаж в день события.</span>{' '}
                Приезжаем вовремя, аккуратно собираем конструкции и забираем каркас после.
              </li>
            </ol>
          </div>
        </section>

        {/* Portfolio placeholder (можно подключить позже к API) */}
        <section id="portfolio" className="border-t border-brand-ink/10 pt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-forest/70">
                Наши работы
              </p>
              <h2 className="mt-2 text-xl font-semibold leading-tight text-brand-ink">
                Портфолио по типам событий
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-ink/75">
                Здесь будут примеры оформлений для свадеб, дней рождения, детских праздников и
                корпоративов. Сейчас блок подключен как placeholder, чтобы не блокировать запуск
                сайта.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-card border border-dashed border-brand-ink/15 bg-white/70 p-4 text-sm text-brand-ink/65">
            Портфолио подключим к базе через готовую модель <code>PortfolioImage</code>, как только
            вы загрузите первые фотографии в админке.
          </div>
        </section>

        {/* Pricing calculator */}
        <section id="pricing" className="border-t border-brand-ink/10 pt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-forest/70">
                Ориентировочная стоимость
              </p>
              <h2 className="mt-2 text-xl font-semibold leading-tight text-brand-ink">
                Калькулятор декора
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-ink/75">
                Введите ориентировочный бюджет на материалы, выберите тип оформления и наценку —
                калькулятор покажет примерную конечную стоимость.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCalculatePrice}
            className="mt-4 grid gap-4 rounded-card border border-brand-ink/10 bg-white/90 p-4 shadow-card md:grid-cols-3 md:gap-5 md:p-5"
          >
            <div>
              <label
                htmlFor="marketPrice"
                className="text-sm font-medium leading-6 text-brand-ink"
              >
                Бюджет на материалы, ₽
              </label>
              <input
                id="marketPrice"
                name="marketPrice"
                type="number"
                min={0}
                defaultValue={15000}
                required
                className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-3 py-2 text-sm text-brand-ink shadow-sm placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              />
            </div>

            <div>
              <label
                htmlFor="flowerTypeCoef"
                className="text-sm font-medium leading-6 text-brand-ink"
              >
                Тип оформления
              </label>
              <select
                id="flowerTypeCoef"
                name="flowerTypeCoef"
                defaultValue="1"
                className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-3 py-2 text-sm text-brand-ink shadow-sm focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              >
                <option value="1">Живые цветы</option>
                <option value="0.6">Искусственные цветы / микс</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="markupPercent"
                className="text-sm font-medium leading-6 text-brand-ink"
              >
                Наценка, %
              </label>
              <input
                id="markupPercent"
                name="markupPercent"
                type="number"
                min={0}
                max={200}
                defaultValue={30}
                required
                className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-3 py-2 text-sm text-brand-ink shadow-sm placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              />
            </div>

            <div className="md:col-span-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={pricingLoading}
                className="inline-flex min-h-11 items-center justify-center rounded-card bg-brand-forest px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-forest/90 disabled:cursor-not-allowed disabled:bg-brand-forest/60"
              >
                {pricingLoading ? 'Считаем...' : 'Посчитать стоимость'}
              </button>

              {finalPrice !== null && (
                <p className="text-sm font-medium text-brand-ink">
                  Ориентировочная стоимость: {' '}
                  <span className="font-semibold">
                    {finalPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </p>
              )}

              {pricingError && (
                <p className="text-sm text-red-700">{pricingError}</p>
              )}
            </div>
          </form>
        </section>

        {/* Lead form */}
        <section id="lead-form" className="border-t border-brand-ink/10 pt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-forest/70">
                Оставить заявку
              </p>
              <h2 className="mt-2 text-xl font-semibold leading-tight text-brand-ink">
                Расскажите о своём мероприятии
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-ink/75">
                Мы свяжемся с вами в мессенджере или по телефону, уточним детали и предложим
                несколько вариантов оформления с ориентировочной сметой.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleLeadSubmit}
            className="mt-4 grid gap-4 rounded-card border border-brand-ink/10 bg-white/90 p-4 shadow-card md:grid-cols-2 md:gap-5 md:p-5"
          >
            <div>
              <label htmlFor="name" className="text-sm font-medium leading-6 text-brand-ink">
                Имя
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-3 py-2 text-sm text-brand-ink shadow-sm placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-sm font-medium leading-6 text-brand-ink">
                Телефон / мессенджер
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-3 py-2 text-sm text-brand-ink shadow-sm placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              />
            </div>

            <div>
              <label htmlFor="eventType" className="text-sm font-medium leading-6 text-brand-ink">
                Тип события
              </label>
              <input
                id="eventType"
                name="eventType"
                type="text"
                required
                placeholder="Свадьба, день рождения, корпоратив..."
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-3 py-2 text-sm text-brand-ink shadow-sm placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              />
            </div>

            <div>
              <label
                htmlFor="desiredDate"
                className="text-sm font-medium leading-6 text-brand-ink"
              >
                Дата мероприятия
              </label>
              <input
                id="desiredDate"
                name="desiredDate"
                type="date"
                required
                value={desiredDate}
                onChange={(e) => setDesiredDate(e.target.value)}
                className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-3 py-2 text-sm text-brand-ink shadow-sm focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="comment" className="text-sm font-medium leading-6 text-brand-ink">
                Комментарий
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={3}
                placeholder="Площадка, пожелания по цветам, бюджет и любые другие детали."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-2 w-full rounded-card border border-brand-ink/10 bg-white px-3 py-2 text-sm text-brand-ink shadow-sm placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={leadLoading}
                className="inline-flex min-h-11 items-center justify-center rounded-card bg-brand-forest px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-forest/90 disabled:cursor-not-allowed disabled:bg-brand-forest/60"
              >
                {leadLoading ? 'Отправляем...' : 'Отправить заявку'}
              </button>

              <p className="text-xs leading-5 text-brand-ink/60">
                Нажимая кнопку, вы соглашаетесь на обработку данных и получение ответа по указанным
                контактам.
              </p>
            </div>

            {leadSuccess && (
              <p className="md:col-span-2 rounded-card border border-brand-forest/40 bg-brand-forest/10 px-3 py-2 text-sm text-brand-forest">
                Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.
              </p>
            )}

            {leadError && (
              <p className="md:col-span-2 text-sm text-red-700">{leadError}</p>
            )}
          </form>
        </section>

        {/* Contacts / Footer */}
        <section
          id="contacts"
          className="border-t border-brand-ink/10 pb-10 pt-8 text-sm leading-6 text-brand-ink/80"
        >
          <h2 className="text-base font-semibold text-brand-ink">Контакты</h2>
          <p className="mt-2">
            Телефон / мессенджер:{' '}
            <span className="font-medium">+7&nbsp;___&nbsp;___&nbsp;__&nbsp;__</span>
            {' '}(подставьте ваш рабочий номер)
          </p>
          <p className="mt-1">
            E-mail:{' '}
            <span className="font-medium">info@example.com</span>
            {' '}(замените на ваш реальный адрес)
          </p>
          <p className="mt-3 text-xs text-brand-ink/60">
            Сайт на стадии MVP: функционал калькулятора и формы уже подключён к backend. Когда вы
            будете готовы, сюда можно добавить ссылки на соцсети и публичную оферту.
          </p>
        </section>
      </div>
    </main>
  )
}
