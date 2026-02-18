import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileCTA } from '@/components/layout/MobileCTA';
import { PageTransition } from '@/components/layout/PageTransition';
import { CookieConsent } from '@/components/CookieConsent';
import { YandexMetrika } from '@/components/YandexMetrika';
import { JsonLdOrganization } from '@/components/seo/JsonLdOrganization';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { SiteSettingsProvider } from '@/components/providers/SiteSettingsProvider';
import { getSiteSettings } from '@/lib/site-settings';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

const siteUrl = process.env.NEXTAUTH_URL || process.env.SITE_URL || 'https://uyutny-kvartal.ru';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Уютный Квартал — инвестиции в редевелопмент недвижимости в Москве',
    template: '%s | Уютный Квартал'
  },
  description:
    'Редевелопмент помещений в Москве: покупка, разделение на апартаменты, ремонт под ключ, управление арендой. Доходность от 15% годовых.',
  keywords: ['редевелопмент', 'инвестиции в недвижимость', 'Москва', 'апартаменты', 'доходность', 'Уютный Квартал'],
  icons: { icon: '/favicon.ico' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Уютный Квартал',
    url: siteUrl,
    title: 'Уютный Квартал — редевелопмент и управление недвижимостью в Москве',
    description: 'Доходные апартаменты от 15% годовых. Покупка, ремонт, аренда под ключ.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Уютный Квартал — редевелопмент недвижимости в Москве' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Уютный Квартал — редевелопмент в Москве',
    description: 'Доходные апартаменты от 15% годовых. Инвестиции в редевелопмент.'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await getSiteSettings();
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <JsonLdOrganization settings={siteSettings} />
      </head>
      <body className={inter.className}>
        {/* Фон на весь экран: картинка + светлый overlay (z-0 чтобы был под всем контентом) */}
        <div className="fixed inset-0 z-0 site-bg-image" aria-hidden />
        <div className="fixed inset-0 z-0 bg-slate-50/92" aria-hidden />
        <SessionProvider>
          <SiteSettingsProvider initial={siteSettings}>
            <div className="relative z-10 min-h-screen flex flex-col pb-16 md:pb-0">
              <Header />
              <main className="flex-1 py-6 md:py-10 px-0">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
              <MobileCTA />
              <CookieConsent />
              <YandexMetrika />
            </div>
          </SiteSettingsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

