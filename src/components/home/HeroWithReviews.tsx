'use client';

import Link from 'next/link';
import type { SiteSettings } from '@/types/site-settings';
import { ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';

type Props = { settings: SiteSettings; projectsCount: number };

export function HeroWithReviews({ settings, projectsCount }: Props) {
  const hasTrust = settings.trustObjects || settings.trustYears || settings.trustAmount;

  return (
    <section className="min-h-screen flex flex-col pt-6 pb-8 md:pt-10 md:pb-12">
      <div className="container-page flex-1 flex flex-col justify-center">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Доходность от 15% годовых — проверенная модель
              </div>
              <div className="space-y-3">
                <h1 className="text-2xl md:text-4xl font-semibold text-slate-900">
                  Превращаем пустые помещения в{' '}
                  <span className="text-brand">доходные апартаменты</span>
                </h1>
                <p className="text-sm text-slate-800 max-w-xl">
                  «Уютный Квартал» покупает крупные помещения в Москве, делит их на студии
                  и апартаменты, делает ремонт под ключ и выводит объекты на стабильный
                  арендный поток. Вы получаете готовый продукт с предсказуемой доходностью.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/investors" className="btn-primary shadow-lg">
                  Рассчитать доходность
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
                <p className="text-xs text-slate-800">
                  Сопровождаем от покупки до управления арендой
                </p>
              </div>
              <div className="grid gap-3 text-xs md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-sm">
                  <p className="text-slate-800">Старт входа</p>
                  <p className="text-sm font-semibold text-slate-900">от 3 млн ₽</p>
                  <p className="text-slate-800">Доля в проекте или отдельный лот</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-sm">
                  <p className="text-slate-800">Доходность</p>
                  <p className="text-sm font-semibold text-emerald-600">от 15% годовых</p>
                  <p className="text-slate-800">Рост стоимости + арендный поток</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 shadow-sm">
                  <div className="inline-flex items-center gap-1 text-slate-700">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                    Юридическое сопровождение
                  </div>
                  <p className="text-slate-800">Вся сделка и эксплуатация — под нашим контролем</p>
                </div>
              </div>
              {hasTrust && (
                <div className="grid grid-cols-3 gap-3 text-center">
                  {settings.trustObjects && (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="text-lg font-semibold text-slate-900">{settings.trustObjects}</p>
                      <p className="text-xs text-slate-800">объектов</p>
                    </div>
                  )}
                  {settings.trustYears && (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="text-lg font-semibold text-slate-900">{settings.trustYears}</p>
                      <p className="text-xs text-slate-800">лет на рынке</p>
                    </div>
                  )}
                  {settings.trustAmount && (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="text-lg font-semibold text-slate-900">{settings.trustAmount}</p>
                      <p className="text-xs text-slate-800">объём сделок</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="card p-5 space-y-4 border-orange-100 bg-gradient-to-br from-orange-50 to-white">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-800">Портфель «Уютный Квартал»</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {projectsCount} {projectsCount === 1 ? 'проект' : projectsCount < 5 ? 'проекта' : 'проектов'} в работе
                  </p>
                </div>
                <span className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs text-slate-800 inline-flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  Москва
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl bg-white border border-slate-100 p-3 space-y-1">
                  <p className="text-slate-800">Средняя доходность</p>
                  <p className="text-sm font-semibold text-emerald-600">16–18% годовых</p>
                </div>
                <div className="rounded-xl bg-white border border-slate-100 p-3 space-y-1">
                  <p className="text-slate-800">Горизонт</p>
                  <p className="text-sm font-semibold text-slate-800">8–18 месяцев</p>
                </div>
                <div className="rounded-xl bg-white border border-slate-100 p-3 space-y-1">
                  <p className="text-slate-800">Формат</p>
                  <p className="text-sm font-semibold text-slate-800">студии и апартаменты</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-800">
                Показатели основаны на реализованных проектах. Не являются гарантией будущей доходности.
              </p>
            </div>
          </div>
      </div>
    </section>
  );
}
