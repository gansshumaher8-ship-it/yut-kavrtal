import type { Metadata } from 'next';

const siteUrl = process.env.NEXTAUTH_URL || process.env.SITE_URL || 'https://uyutny-kvartal.ru';

export const metadata: Metadata = {
  title: 'Инвестору',
  description:
    'Инвестиции в редевелопмент недвижимости в Москве: доходность от 15% годовых. Калькулятор доходности, стратегии аренды и перепродажи. Старт от 3 млн ₽.',
  keywords: ['инвестиции в недвижимость', 'доходность', 'редевелопмент', 'калькулятор доходности', 'Москва'],
  alternates: { canonical: `${siteUrl}/investors` },
  openGraph: {
    title: 'Инвестору | Уютный Квартал',
    description: 'Инвестиции в редевелопмент: доходность от 15% годовых. Калькулятор, стратегии.',
    url: `${siteUrl}/investors`
  }
};

export default function InvestorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
