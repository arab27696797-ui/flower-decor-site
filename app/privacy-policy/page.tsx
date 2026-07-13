// app/privacy-policy/page.tsx
// PRIMA Decor — Privacy Policy page.
// Legally-structured placeholder: covers all required sections under Russian 152-FZ.
// Unknown legal entity identifiers are clearly marked as [PLACEHOLDER] for lawyer review.
// This page is a SERVER COMPONENT — no 'use client' needed.
// Language: Russian primary (full text), English secondary (note + heading structure).
// Metadata exported for SEO compatibility with Next.js App Router.

import type { Metadata } from 'next'
import React from 'react'

// ---------------------------------------------------------------------------
// SEO Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Политика конфиденциальности — PRIMA Decor',
  description:
    'Политика обработки персональных данных PRIMA Decor. Информация о том, какие данные мы собираем, как используем и как вы можете ими управлять.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/privacy-policy',
  },
  openGraph: {
    title: 'Политика конфиденциальности — PRIMA Decor',
    description:
      'Политика обработки персональных данных PRIMA Decor. Узнайте, как мы используем ваши данные.',
    url: '/privacy-policy',
    siteName: 'PRIMA Decor',
    locale: 'ru_RU',
    type: 'website',
  },
}

// ---------------------------------------------------------------------------
// Section heading helper
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl font-semibold text-brand-ink mt-10 mb-3 leading-snug">
      {children}
    </h2>
  )
}

// ---------------------------------------------------------------------------
// Paragraph helper
// ---------------------------------------------------------------------------

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-brand-ink/70 leading-relaxed mb-3">
      {children}
    </p>
  )
}

// ---------------------------------------------------------------------------
// Placeholder notice component — visually distinct, easy to find and remove
// ---------------------------------------------------------------------------

function PlaceholderNotice({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="
        inline-block rounded bg-amber-50 border border-amber-200
        px-1.5 py-0.5 text-xs font-medium text-amber-700
        leading-normal
      "
      title="Требует замены юристом / Requires legal review"
    >
      {children}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PrivacyPolicyPage() {
  const lastUpdated = '1 января 2025 года' // Update when real legal text is confirmed

  return (
    <main
      id="main-content"
      className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20"
    >
      <article aria-labelledby="privacy-heading">

        {/* ---- Draft notice --------------------------------------------- */}
        <div
          role="note"
          aria-label="Черновик документа"
          className="
            mb-8 rounded-xl border border-amber-200
            bg-amber-50 px-5 py-4
          "
        >
          <p className="text-xs font-semibold text-amber-700 mb-1">
            ⚠ Предварительная версия документа
          </p>
          <p className="text-xs text-amber-600 leading-relaxed">
            Данная страница содержит структуру политики конфиденциальности.
            Окончательный юридический текст должен быть согласован с юристом
            и приведён в соответствие с 152-ФЗ «О персональных данных».
            Поля, отмеченные как{' '}
            <PlaceholderNotice>[ЗАПОЛНИТЬ]</PlaceholderNotice>{' '}
            требуют замены реальными данными.
          </p>
        </div>

        {/* ---- H1 ------------------------------------------------------- */}
        <h1
          id="privacy-heading"
          className="font-display text-display-md text-brand-ink leading-tight"
        >
          Политика конфиденциальности и обработки персональных данных
        </h1>

        <p className="mt-2 mb-8 text-sm text-brand-ink/45">
          Последнее обновление: {lastUpdated}
        </p>

        {/* ---- 1. Оператор --------------------------------------------- */}
        <SectionHeading>1. Кто обрабатывает данные</SectionHeading>
        <P>
          Оператором персональных данных является{' '}
          <PlaceholderNotice>[Полное юридическое наименование организации или ФИО ИП]</PlaceholderNotice>
          , далее — «PRIMA Decor», «мы», «оператор».
        </P>
        <P>
          ИНН: <PlaceholderNotice>[ИНН]</PlaceholderNotice>.{' '}
          ОГРН / ОГРНИП: <PlaceholderNotice>[ОГРН / ОГРНИП]</PlaceholderNotice>.{' '}
          Адрес: <PlaceholderNotice>[Юридический адрес]</PlaceholderNotice>.
        </P>
        <P>
          Контакт по вопросам персональных данных:{' '}
          <a
            href="mailto:info@primadecor.ru"
            className="text-brand-forest underline underline-offset-2 hover:text-brand-forest/80"
          >
            info@primadecor.ru
          </a>
          {' '}или по телефону{' '}
          <a
            href="tel:+79990000000"
            className="text-brand-forest underline underline-offset-2 hover:text-brand-forest/80"
          >
            +7 (999) 000-00-00
          </a>
          {' '}<PlaceholderNotice>[заменить на реальный номер]</PlaceholderNotice>.
        </P>

        {/* ---- 2. Какие данные собираем --------------------------------- */}
        <SectionHeading>2. Какие данные мы собираем</SectionHeading>
        <P>
          При использовании сайта и подаче заявки мы можем собирать следующие
          категории персональных данных:
        </P>
        <ul className="list-disc list-inside text-sm text-brand-ink/70 leading-relaxed mb-3 space-y-1 pl-1">
          <li>Имя и фамилия (при указании в форме заявки).</li>
          <li>Номер телефона.</li>
          <li>Адрес или наименование объекта оформления.</li>
          <li>Пожелания и комментарии, указанные в форме.</li>
          <li>
            Технические данные: IP-адрес, тип браузера, cookies, страницы просмотра
            (в обезличенном виде, для аналитики).
          </li>
        </ul>
        <P>
          Мы не собираем специальные категории персональных данных
          (сведения о состоянии здоровья, биометрию, данные о судимостях и т.д.).
        </P>

        {/* ---- 3. Для чего используются данные -------------------------- */}
        <SectionHeading>3. Для чего используются данные</SectionHeading>
        <P>Персональные данные обрабатываются исключительно в следующих целях:</P>
        <ul className="list-disc list-inside text-sm text-brand-ink/70 leading-relaxed mb-3 space-y-1 pl-1">
          <li>Обработка заявок на оформление мероприятий и расчёт стоимости услуг.</li>
          <li>Связь с клиентом по оставленной заявке (телефон, мессенджер).</li>
          <li>Уточнение деталей заказа и согласование условий сотрудничества.</li>
          <li>
            Улучшение работы сайта на основе обезличенной аналитики
            (счётчики посещаемости, статистика взаимодействий).
          </li>
        </ul>
        <P>
          Мы не продаём и не передаём персональные данные третьим лицам в коммерческих целях.
        </P>

        {/* ---- 4. Как обрабатываются заявки ------------------------------ */}
        <SectionHeading>4. Как обрабатываются заявки с сайта</SectionHeading>
        <P>
          При отправке формы обратной связи введённые вами данные (имя, телефон,
          адрес объекта, пожелания и выбранные услуги) передаются сотруднику PRIMA Decor
          через защищённый канал уведомлений.
        </P>
        <P>
          Данные не используются для автоматизированного принятия решений
          и не передаются в рекламные сети.
        </P>
        <P>
          Сайт <strong>не принимает оплату</strong>. Все расчёты, представленные
          на сайте, носят информационный и ориентировочный характер и не являются
          публичной офертой.
        </P>

        {/* ---- 5. Cookies и аналитика ----------------------------------- */}
        <SectionHeading>5. Файлы cookie и веб-аналитика</SectionHeading>
        <P>
          Сайт использует файлы cookie — небольшие текстовые файлы, которые
          сохраняются в вашем браузере. Мы используем cookie для:
        </P>
        <ul className="list-disc list-inside text-sm text-brand-ink/70 leading-relaxed mb-3 space-y-1 pl-1">
          <li>Обеспечения корректной работы сайта (функциональные cookie).</li>
          <li>
            Сбора обезличенной статистики посещений{' '}
            <PlaceholderNotice>[указать систему аналитики, например: Яндекс.Метрика]</PlaceholderNotice>.
          </li>
        </ul>
        <P>
          Продолжая использовать сайт после отображения баннера согласия,
          вы соглашаетесь с использованием cookie в соответствии с настоящей политикой.
          Вы можете отключить cookie в настройках вашего браузера, однако это может
          повлиять на функциональность сайта.
        </P>

        {/* ---- 6. Хранение и защита ------------------------------------- */}
        <SectionHeading>6. Хранение и защита данных</SectionHeading>
        <P>
          Мы принимаем технические и организационные меры для защиты персональных
          данных от несанкционированного доступа, изменения, раскрытия или уничтожения.
        </P>
        <P>
          Данные хранятся в течение срока, необходимого для выполнения целей
          обработки, или до отзыва согласия субъектом данных, но не более{' '}
          <PlaceholderNotice>[указать срок, например: 3 лет]</PlaceholderNotice>
          {' '}с момента получения заявки.
        </P>

        {/* ---- 7. Права субъекта данных --------------------------------- */}
        <SectionHeading>7. Ваши права</SectionHeading>
        <P>
          В соответствии с Федеральным законом №152-ФЗ «О персональных данных»
          вы имеете право:
        </P>
        <ul className="list-disc list-inside text-sm text-brand-ink/70 leading-relaxed mb-3 space-y-1 pl-1">
          <li>Получить информацию об обработке ваших персональных данных.</li>
          <li>Потребовать уточнения, блокирования или уничтожения ваших данных.</li>
          <li>Отозвать ранее данное согласие на обработку данных.</li>
          <li>Обжаловать действия оператора в Роскомнадзор.</li>
        </ul>
        <P>
          Для реализации своих прав обратитесь к нам по электронной почте{' '}
          <a
            href="mailto:info@primadecor.ru"
            className="text-brand-forest underline underline-offset-2 hover:text-brand-forest/80"
          >
            info@primadecor.ru
          </a>
          {' '}или по телефону, указанному в разделе «Контакты» сайта.
        </P>

        {/* ---- 8. Изменения политики ------------------------------------ */}
        <SectionHeading>8. Изменения политики</SectionHeading>
        <P>
          Мы оставляем за собой право вносить изменения в настоящую политику.
          Актуальная версия всегда доступна по адресу{' '}
          <a
            href="/privacy-policy"
            className="text-brand-forest underline underline-offset-2 hover:text-brand-forest/80"
          >
            primadecor.ru/privacy-policy
          </a>
          .
        </P>

        {/* ---- English note --------------------------------------------- */}
        <div
          role="note"
          aria-label="English note"
          className="
            mt-12 rounded-xl border border-brand-ink/8
            bg-brand-cream px-5 py-4
          "
        >
          <p className="text-xs font-semibold text-brand-ink/60 mb-1">
            English
          </p>
          <p className="text-xs text-brand-ink/50 leading-relaxed">
            This Privacy Policy is provided in 
