import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXTAUTH_URL || process.env.SITE_URL || 'https://uyutny-kvartal.ru';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin', '/dashboard', '/login', '/setup', '/api/'] }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
