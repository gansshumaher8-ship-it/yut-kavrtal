import type { Metadata } from 'next';

const siteUrl = process.env.NEXTAUTH_URL || process.env.SITE_URL || 'https://uyutny-kvartal.ru';

export const metadata: Metadata = {
  title: 'Собственникам — сдать квартиру под управление',
  description:
    'Сдача квартиры или апартаментов под управление в Москве. Поиск жильцов, заселение, сопровождение — полностью на нас. Уютный Квартал.',
  keywords: ['сдать квартиру', 'управление недвижимостью', 'аренда под ключ', 'Москва'],
  alternates: { canonical: `${siteUrl}/owners` },
  openGraph: {
    title: 'Собственникам | Уютный Квартал',
    description: 'Сдача квартиры под управление. Поиск жильцов, заселение, сопровождение.',
    url: `${siteUrl}/owners`
  }
};

export default function OwnersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
