export const metadata = {
  title: 'Политика конфиденциальности — Si-Si',
  description:
    'Политика конфиденциальности и обработки персональных данных. ' +
    'Оператор: ООО «АЛЬЯНС ПЛЮС», ИНН 9724001157.',
}

export default function PrivacyPolicyPage() {
  const lastUpdated = '17 июля 2026 года'

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-parchment sm:text-4xl">
        Политика конфиденциальности
      </h1>

      <p className="mt-4 text-sm text-brand-stone">
        Дата обновления: {lastUpdated}
      </p>

      {/* Operator — legal entity details (152-ФЗ) */}
      <div className="mt-8 rounded-card border border-brand-midnight-border bg-brand-midnight-soft p-6">
        <h2 className="font-display text-xl font-semibold text-brand-parchment">
          Оператор персональных данных
        </h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <dt className="shrink-0 text-brand-stone">Наименование:</dt>
            <dd className="font-medium text-brand-parchment">
              Общество с ограниченной ответственностью «АЛЬЯНС ПЛЮС» (ООО «АЛЬЯНС ПЛЮС»)
            </dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <dt className="shrink-0 text-brand-stone">ИНН:</dt>
            <dd className="font-medium text-brand-parchment">9724001157</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <dt className="shrink-0 text-brand-stone">ОГРН:</dt>
            <dd className="font-medium text-brand-parchment">1207700000100</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <dt className="shrink-0 text-brand-stone">Адрес:</dt>
            <dd className="font-medium text-brand-parchment">
              115409, г. Москва, Каширское ш., д. 48, к. 2, помещение 2П
            </dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <dt className="shrink-0 text-brand-stone">Телефон:</dt>
            <dd className="font-medium">
              <a href="tel:+74957921898" className="text-brand-gold transition-colors hover:text-brand-gold-light">
                +7 (495) 792-18-98
              </a>
            </dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <dt className="shrink-0 text-brand-stone">E-mail:</dt>
            <dd className="font-medium">
              <a href="mailto:sisidekor860@mail.ru" className="text-brand-gold transition-colors hover:text-brand-gold-light">
                sisidekor860@mail.ru
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 max-w-none space-y-6 text-sm leading-relaxed text-brand-stone">
        <p>
          Мы уважаем вашу конфиденциальность и обрабатываем персональные данные
          только в объёме, необходимом для обработки заявок, обратной связи и
          оказания услуг, в соответствии с Федеральным законом от 27.07.2006
          № 152-ФЗ «О персональных данных».
        </p>

        <section>
          <h2 className="mb-2 font-display text-xl font-semibold text-brand-parchment">
            Какие данные мы собираем
          </h2>
          <p>
            Мы можем собирать имя, номер телефона, детали заявки, комментарии,
            технические данные о посещении сайта, а также UTM-метки, если они
            передаются в адресной строке.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-xl font-semibold text-brand-parchment">
            Как используются данные
          </h2>
          <p>
            Данные используются для связи с вами, подготовки предложения,
            внутреннего учёта заявок, улучшения качества сервиса и обработки
            запросов, отправленных через сайт.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-xl font-semibold text-brand-parchment">
            Передача третьим лицам
          </h2>
          <p>
            Мы не продаём персональные данные. Информация может передаваться только
            техническим сервисам, которые необходимы для работы сайта и приёма
            заявок, включая хостинг, базу данных и средства доставки уведомлений.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-xl font-semibold text-brand-parchment">
            Хранение данных
          </h2>
          <p>
            Мы принимаем разумные организационные и технические меры для защиты
            данных от утраты, неправомерного доступа, изменения или раскрытия.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-xl font-semibold text-brand-parchment">
            Связь с нами
          </h2>
          <p>
            По вопросам обработки персональных данных, а также для отзыва согласия
            на обработку вы можете обратиться по телефону{' '}
            <a href="tel:+74957921898" className="text-brand-gold transition-colors hover:text-brand-gold-light">
              +7 (495) 792-18-98
            </a>{' '}
            или по адресу{' '}
            <a href="mailto:sisidekor860@mail.ru" className="text-brand-gold transition-colors hover:text-brand-gold-light">
              sisidekor860@mail.ru
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
