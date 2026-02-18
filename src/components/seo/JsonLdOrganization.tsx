import type { SiteSettings } from '@/types/site-settings';

const siteUrl = process.env.NEXTAUTH_URL || process.env.SITE_URL || 'https://uyutny-kvartal.ru';

export function JsonLdOrganization({ settings }: { settings: SiteSettings }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.name,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Редевелопмент помещений в Москве: покупка, разделение на апартаменты, ремонт под ключ, управление арендой. Доходность от 15% годовых.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: 'Москва',
      addressCountry: 'RU'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.phone,
      email: settings.email,
      contactType: 'customer service',
      areaServed: 'RU'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
