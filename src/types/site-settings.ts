export interface SiteSettings {
  /** Название компании */
  name: string;
  /** ИНН */
  inn: string;
  /** КПП */
  kpp?: string;
  /** ОГРН */
  ogrn?: string;
  /** Юридический адрес */
  address: string;
  /** Телефон */
  phone: string;
  /** Email */
  email: string;
  /** Банк (наименование) */
  bankName?: string;
  /** БИК */
  bik?: string;
  /** Расчётный счёт */
  bankAccount?: string;
  /** Корр. счёт */
  corrAccount?: string;
  /** Блок «О нас» в шапке (кратко) — не используется, оставлено для совместимости */
  aboutShort?: string;
  /** Текст страницы «О компании» — редактируется в админке по согласованию с руководством */
  aboutPageContent?: string;
  /** Текст в подвале (дисклеймер) */
  footerDisclaimer?: string;
  /** Ссылка на политику конфиденциальности */
  policyUrl?: string;
  /** Ссылка на оферту */
  offerUrl?: string;
  /** Блок доверия: количество объектов (например "5+") */
  trustObjects?: string;
  /** Блок доверия: лет на рынке (например "8") */
  trustYears?: string;
  /** Блок доверия: объём (например "500+ млн ₽") */
  trustAmount?: string;
  /** Этапы работы: каждая строка — один этап */
  howWeWorkSteps?: string;
  /** FAQ: пары "Вопрос|Ответ" по одной на строку */
  faqContent?: string;
  /** Кейсы: каждая строка — один блок "Заголовок|Текст" */
  caseStudies?: string;
  /** Отзывы: каждая строка — один блок "Заголовок|Текст" (показываются внизу страницы) */
  reviewsContent?: string;
  /** Текст плашки cookie (если пусто — плашка не показывается) */
  cookieConsentText?: string;
  /** ID счётчика Яндекс.Метрики (например 12345678) */
  yandexMetrikaId?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  name: 'ООО «РУНЕД»',
  inn: '7734497068',
  address: 'г. Москва, ул. Бурденко, д. 14',
  phone: '+7 (495) 123-45-67',
  email: 'info@uyutny-kvartal.ru',
  aboutShort: '8 лет на рынке. Множество успешных кейсов.',
  footerDisclaimer: 'Информация не является публичной офертой. Расчёты доходности носят ориентировочный характер и не гарантируют получение аналогичных результатов в будущем.'
};
