'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { Home, LineChart, KeyRound, Menu, X, LogOut, Info, Phone } from 'lucide-react';
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';
import { CallbackModal } from '@/components/CallbackModal';

const navLinks = [
  { href: '/', icon: Home, label: 'Объекты' },
  { href: '/about', icon: Info, label: 'О компании' },
  { href: '/owners', icon: KeyRound, label: 'Собственникам' },
  { href: '/investors', icon: LineChart, label: 'Инвестору' }
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const { data: session, status } = useSession();
  const settings = useSiteSettings();

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container-page flex items-center justify-between py-3 md:py-4 gap-4">
        <Link href="/" className="flex items-center gap-2 md:gap-3 min-w-0 flex-shrink-0">
          <Image
            src="/logo.png"
            alt=""
            width={120}
            height={48}
            className="h-9 w-auto md:h-11 object-contain"
            priority
          />
          <span className="brand-shimmer text-base md:text-lg whitespace-nowrap">
            Уютный Квартал
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 lg:gap-5 text-sm flex-1 justify-end">
          {navLinks.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className="inline-flex items-center gap-1 text-slate-800 hover:text-brand transition-colors">
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <a href={`tel:${settings.phone.replace(/\D/g, '')}`} className="inline-flex items-center gap-1 text-slate-800 hover:text-brand transition-colors whitespace-nowrap">
            <Phone className="h-4 w-4" />
            {settings.phone}
          </a>
          <button type="button" onClick={() => setCallbackOpen(true)} className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-slate-800 hover:border-brand hover:bg-orange-50 transition-colors whitespace-nowrap">
            Заказать звонок
          </button>
          {(session?.user?.name) && (
            <span className="text-slate-600 text-xs hidden lg:inline">{session.user.name}</span>
          )}
          {status === 'authenticated' && (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-red-600 transition-colors"
              title="Выйти"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </button>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden p-2 -mr-2 text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <CallbackModal open={callbackOpen} onClose={() => setCallbackOpen(false)} />
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="container-page py-3 flex flex-col gap-1">
            <a href={`tel:${settings.phone.replace(/\D/g, '')}`} className="flex items-center gap-2 py-3 px-3 rounded-lg text-slate-900 hover:bg-orange-50 hover:text-brand">
              <Phone className="h-4 w-4" />
              {settings.phone}
            </a>
            <button type="button" onClick={() => { setMobileOpen(false); setCallbackOpen(true); }} className="flex items-center gap-2 py-3 px-3 rounded-lg text-slate-900 hover:bg-orange-50 hover:text-brand text-left w-full">
              Заказать звонок
            </button>
            {navLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 py-3 px-3 rounded-lg text-slate-900 hover:bg-orange-50 hover:text-brand"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            {status === 'authenticated' && (
              <button
                type="button"
                onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }); }}
                className="flex items-center gap-2 py-3 px-3 rounded-lg text-slate-900 hover:bg-red-50 hover:text-red-600 text-left w-full"
              >
                <LogOut className="h-4 w-4" />
                Выйти
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
