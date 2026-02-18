'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';

const STORAGE_KEY = 'cookie_consent_accepted';

export function CookieConsent() {
  const settings = useSiteSettings();
  const [accepted, setAccepted] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setAccepted(!!stored);
    } catch {
      setAccepted(true);
    }
  }, []);

  function handleAccept() {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {}
    setAccepted(true);
  }

  if (!mounted || accepted || !settings.cookieConsentText?.trim()) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-6 bg-slate-900/95 text-white shadow-lg">
      <div className="container-page flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-slate-200 flex-1">
          {settings.cookieConsentText}
          {settings.policyUrl && (
            <>
              {' '}
              <Link href={settings.policyUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                Политика конфиденциальности
              </Link>
            </>
          )}
        </p>
        <button
          type="button"
          onClick={handleAccept}
          className="flex-shrink-0 rounded-full bg-white text-slate-900 px-4 py-2 text-sm font-medium hover:bg-slate-100 transition-colors"
        >
          Принять
        </button>
      </div>
    </div>
  );
}
