'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { SiteSettings } from '@/types/site-settings';

const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({
  initial,
  children
}: {
  initial: SiteSettings;
  children: ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={initial}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettings {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    return {
      name: 'ООО «РУНЕД»',
      inn: '7734497068',
      address: 'г. Москва, ул. Бурденко, д. 14',
      phone: '+7 (495) 123-45-67',
      email: 'info@uyutny-kvartal.ru',
      aboutShort: '8 лет на рынке. Множество успешных кейсов.',
      footerDisclaimer: 'Информация не является публичной офертой.'
    };
  }
  return ctx;
}
