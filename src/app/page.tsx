import type { Metadata } from 'next';
import { CatalogWithFilter } from '@/components/catalog/CatalogWithFilter';
import { ContactForm } from '@/components/home/ContactForm';
import { FAQBlock } from '@/components/home/FAQBlock';
import { AnimateOnScroll } from '@/components/home/AnimateOnScroll';
import { HeroWithReviews } from '@/components/home/HeroWithReviews';
import { getProjects } from '@/lib/projects';
import { getSiteSettings } from '@/lib/site-settings';
import { ArrowRight, ShieldCheck, TrendingUp, KeyRound } from 'lucide-react';
import Link from 'next/link';

const siteUrl = process.env.NEXTAUTH_URL || process.env.SITE_URL || 'https://uyutny-kvartal.ru';

export const metadata: Metadata = {
  title: 'Уютный Квартал — инвестиции в редевелопмент недвижимости в Москве',
  description:
    'Превращаем пустые помещения в доходные апартаменты. Покупка, ремонт под ключ, управление арендой. Доходность от 15% годовых. Старт входа от 3 млн ₽.',
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'Уютный Квартал — редевелопмент в Москве',
    description: 'Доходные апартаменты от 15% годовых. Инвестиции в редевелопмент.',
    url: siteUrl
  }
};

export default async function HomePage() {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);

  return (
    <AnimateOnScroll>
      <div className="space-y-12">
        <HeroWithReviews settings={settings} projectsCount={projects.length} />

        {settings.howWeWorkSteps?.trim() && (
          <section data-animate className="container-page">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Как мы работаем</h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {settings.howWeWorkSteps.trim().split(/\r?\n/).filter(Boolean).map((line, i) => {
              const sep = line.indexOf('|');
              const title = sep >= 0 ? line.slice(0, sep).trim() : line.trim();
              const description = sep >= 0 ? line.slice(sep + 1).trim() : '';
              return (
                <li key={i} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-brand font-semibold flex items-center justify-center text-sm">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">{title}</p>
                    {description && <p className="text-sm text-slate-700 mt-1">{description}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
        )}

        <section data-animate className="container-page flex flex-col sm:flex-row gap-4">
        <Link
          href="/owners"
          className="flex-1 block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-orange-200 hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-brand group-hover:bg-orange-200 transition-colors">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-slate-800 group-hover:text-brand transition-colors">
                Собственникам недвижимости
              </p>
              <p className="text-sm text-slate-800">
                Сдайте квартиру или апартаменты под управление «Уютный Квартал» — поиск жильцов, заселение и сопровождение мы берём на себя.
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand ml-auto flex-shrink-0 transition-colors" />
          </div>
        </Link>
        <a
          href={`tel:${settings.phone.replace(/\D/g, '')}`}
          className="flex-shrink-0 flex items-center justify-center gap-2 rounded-2xl border-2 border-brand bg-brand text-white p-4 hover:bg-orange-600 hover:border-orange-600 transition-all duration-300 font-medium"
        >
          <span className="hidden sm:inline">Позвонить</span>
          {settings.phone}
        </a>
        </section>

        <section data-animate>
          <CatalogWithFilter projects={projects} />
        </section>

        <section data-animate className="container-page grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Связаться с нами</h2>
          <ContactForm />
        </div>
        <FAQBlock />
        </section>

        {settings.caseStudies?.trim() && (
          <section data-animate className="container-page">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Кейсы</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {settings.caseStudies.trim().split(/\r?\n/).filter(Boolean).map((line, i) => {
              const sep = line.indexOf('|');
              const title = sep >= 0 ? line.slice(0, sep).trim() : line.trim();
              const text = sep >= 0 ? line.slice(sep + 1).trim() : '';
              return (
                <li key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="font-medium text-slate-900">{title}</p>
                  {text && <p className="text-sm text-slate-700 mt-2">{text}</p>}
                </li>
              );
            })}
          </ul>
        </section>
        )}
      </div>
    </AnimateOnScroll>
  );
}
