'use client';

import Link from 'next/link';
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';
import { PanelLeft } from 'lucide-react';

export function Footer() {
  const settings = useSiteSettings();
  const phoneHref = `tel:${settings.phone.replace(/\D/g, '')}`;
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="container-page py-6 flex flex-col gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 justify-between text-slate-900">
          <span>{settings.name}</span>
          <span>ИНН {settings.inn}</span>
          <a href="https://yandex.ru/maps/-/CPUtj2lN" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">{settings.address}</a>
          <span className="flex items-center gap-2">
            <a href={phoneHref} className="text-slate-900 hover:text-brand transition-colors">{settings.phone}</a>
            <a href={`mailto:${settings.email}`} className="text-slate-900 hover:text-brand transition-colors">{settings.email}</a>
          </span>
        </div>
        {(settings.policyUrl || settings.offerUrl) && (
          <div className="flex flex-wrap gap-4 text-slate-700">
            {settings.policyUrl && (
              <Link href={settings.policyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                Политика конфиденциальности
              </Link>
            )}
            {settings.offerUrl && (
              <Link href={settings.offerUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                Публичная оферта
              </Link>
            )}
          </div>
        )}
        {settings.footerDisclaimer && (
          <p className="text-[11px] text-slate-800">
            {settings.footerDisclaimer}
          </p>
        )}
        <div className="pt-3 border-t border-slate-200 text-slate-600">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 hover:text-brand transition-colors">
            <PanelLeft className="h-3.5 w-3.5" />
            Панель агента
          </Link>
        </div>
      </div>
    </footer>
  );
}

