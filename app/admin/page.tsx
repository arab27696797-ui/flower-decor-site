// app/admin/page.tsx
// PRIMA Decor — Admin dashboard index page (/admin).
//
// Serves as the entry point for all admin activity.
// Renders a simple, staff-friendly overview of available admin sections.
// No metrics, no fake data, no broken links to unimplemented modules.
//
// Available sections are presented as primary action cards.
// Upcoming sections are listed separately with a clear "coming soon" label
// so staff understand they are not yet functional.
//
// This is a SERVER COMPONENT — no interactivity required on this page.

import Link from 'next/link'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AdminSectionCard = {
  href: string
  title: string
  description: string
  icon: string  // emoji — simple, no external dependency
  available: true
}

type AdminSectionUpcoming = {
  title: string
  description: string
  icon: string
  available: false
}

type AdminSection = AdminSectionCard | AdminSectionUpcoming

// ---------------------------------------------------------------------------
// Section definitions
// ---------------------------------------------------------------------------

const ADMIN_SECTIONS: AdminSection[] = [
  {
    href: '/admin/pricing',
    title: 'Цены калькулятора',
    description:
      'Измените базовые цены для всех категорий декора: цветы, шары, букеты, мероприятия. ' +
      'Настройте коэффициент наценки.',
    icon: '💰',
    available: true,
  },
  {
    href: '/admin/contacts',
    title: 'Контактная информация',
    description:
      'Обновите публичный номер телефона, Telegram, WhatsApp, email и ссылку на Instagram.',
    icon: '📞',
    available: true,
  },
  {
    title: 'Портфолио',
    description:
      'Загрузка фото и видео выполненных работ. Управление галереей на сайте.',
    icon: '🖼️',
    available: false,
  },
  {
    title: 'Входящие заявки',
    description:
      'Просмотр и обработка заявок, поступивших через форму на сайте.',
    icon: '📋',
    available: false,
  },
]

// ---------------------------------------------------------------------------
// Sub-components — defined inline (server component, no client hooks needed)
// ---------------------------------------------------------------------------

function AvailableCard({ section }: { section: AdminSectionCard }) {
  return (
    <Link
      href={section.href}
      className="
        group flex flex-col gap-3
        rounded-xl border border-brand-ink/8
        bg-white p-5 shadow-card
        hover:border-brand-forest/30 hover:shadow-md
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-brand-gold focus-visible:ring-offset-2
      "
    >
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="text-2xl leading-none"
        >
          {section.icon}
        </span>
        {/* Arrow indicator */}
        <span
          aria-hidden="true"
          className="
            mt-0.5 text-brand-ink/25
            group-hover:text-brand-forest
            transition-colors duration-200
          "
        >
          →
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="font-display text-display-md text-brand-ink group-hover:text-brand-forest transition-colors duration-200">
          {section.title}
        </h2>
        <p className="text-sm text-brand-ink/55 leading-relaxed">
          {section.description}
        </p>
      </div>

      <span className="
        mt-auto inline-flex w-fit items-center gap-1
        rounded-full bg-brand-forest/8 px-2.5 py-0.5
        text-xs font-semibold text-brand-forest
      ">
        Открыть
      </span>
    </Link>
  )
}

function UpcomingCard({ section }: { section: AdminSectionUpcoming }) {
  return (
    <div
      aria-label={`${section.title} — скоро`}
      className="
        flex flex-col gap-3
        rounded-xl border border-brand-ink/6
        bg-brand-cream/40 p-5
        opacity-70
      "
    >
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="text-2xl leading-none grayscale"
        >
          {section.icon}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="font-display text-display-md text-brand-ink/60">
          {section.title}
        </h2>
        <p className="text-sm text-brand-ink/40 leading-relaxed">
          {section.description}
        </p>
      </div>

      <span className="
        mt-auto inline-flex w-fit items-center gap-1
        rounded-full border border-brand-ink/12
        bg-white/60 px-2.5 py-0.5
        text-xs font-medium text-brand-ink/40
      ">
        Скоро
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function AdminIndexPage() {
  const availableSections = ADMIN_SECTIONS.filter(
    (s): s is AdminSectionCard => s.available === true
  )
  const upcomingSections = ADMIN_SECTIONS.filter(
    (s): s is AdminSectionUpcoming => s.available === false
  )

  return (
    <div className="max-w-4xl mx-auto space-y-10">

      {/* ---- Page header ---- */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-forest/60 mb-1">
          Панель управления
        </p>
        <h1 className="font-display text-display-lg text-brand-ink">
          PRIMA Decor Admin
        </h1>
        <p className="mt-2 text-sm text-brand-ink/55 max-w-prose">
          Добро пожаловать в панель управления сайтом. Используйте разделы ниже
          для обновления цен и контактной информации.
        </p>
      </header>

      {/* ---- Available sections ---- */}
      <section aria-labelledby="available-sections-heading">
        <h2
          id="available-sections-heading"
          className="sr-only"
        >
          Доступные разделы
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {availableSections.map((section) => (
            <AvailableCard key={section.href} section={section} />
          ))}
        </div>
      </section>

      {/* ---- Upcoming sections ---- */}
      {upcomingSections.length > 0 && (
        <section aria-labelledby="upcoming-sections-heading">
          <h2
            id="upcoming-sections-heading"
            className="
              text-xs font-semibold uppercase tracking-[0.18em]
              text-brand-ink/35 mb-3
            "
          >
            В разработке
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {upcomingSections.map((section) => (
              <UpcomingCard key={section.title} section={section} />
            ))}
          </div>
        </section>
      )}

      {/* ---- Help note ---- */}
      <footer className="
        rounded-xl border border-brand-ink/8
        bg-brand-cream/50 px-5 py-4
        text-sm text-brand-ink/50 leading-relaxed
      ">
        <strong className="text-brand-ink/70">Нужна помощь?</strong>{' '}
        Обратитесь к разработчику. Изменения в ценах и контактах хранятся
        временно (до перезапуска сервера) — до подключения базы данных.
      </footer>

    </div>
  )
}
