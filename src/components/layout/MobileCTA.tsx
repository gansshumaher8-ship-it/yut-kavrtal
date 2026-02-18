'use client';

import { Phone } from 'lucide-react';
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';

export function MobileCTA() {
  const settings = useSiteSettings();
  const tel = settings.phone.replace(/\D/g, '');

  return (
    <a
      href={`tel:${tel}`}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex items-center justify-center gap-2 min-h-[52px] py-3 px-4 bg-brand text-white font-medium shadow-lg safe-area-pb"
      aria-label="Позвонить"
    >
      <Phone className="h-5 w-5 flex-shrink-0" />
      <span className="leading-none align-middle">{settings.phone}</span>
    </a>
  );
}
