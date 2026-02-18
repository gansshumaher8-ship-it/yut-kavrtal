import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/site-settings';

const siteUrl = process.env.NEXTAUTH_URL || process.env.SITE_URL || 'https://uyutny-kvartal.ru';

export const metadata: Metadata = {
  title: 'О компании',
  description:
    'Информация о компании Уютный Квартал: редевелопмент и управление недвижимостью в Москве. Опыт, кейсы, команда.',
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: 'О компании | Уютный Квартал',
    description: 'Информация о компании: редевелопмент помещений в Москве, управление недвижимостью.',
    url: `${siteUrl}/about`
  }
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const content = settings.aboutPageContent?.trim() || '';

  return (
    <div className="container-page py-6 md:py-10">
      <div className="max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6">
          О компании
        </h1>
        {content ? (
          <div className="text-slate-800 text-sm md:text-base leading-relaxed space-y-4 max-w-none">
            {content.split('\n').map((line, i) => (
              <p key={i} className="m-0">{line || '\u00A0'}</p>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 text-sm md:text-base">
            Раздел заполняется. Текст можно добавить в панели администратора в блоке «Данные сайта» — поле «Текст страницы «О компании»».
          </p>
        )}
      </div>
    </div>
  );
}
