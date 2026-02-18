'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Loader2, Building2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const form = e.currentTarget;
    const login = (form.elements.namedItem('login') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const res = await signIn('credentials', {
      login,
      password,
      redirect: false
    });

    setLoading(false);
    if (res?.error) {
      setError('Неверный логин или пароль');
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-brand">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Вход</h1>
            <p className="text-sm text-slate-800">Панель агента</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-900">Логин</span>
            <input
              name="login"
              type="text"
              autoComplete="username"
              className="input-field mt-1"
              placeholder="Телефон или email"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-900">Пароль</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className="input-field mt-1"
              required
            />
          </label>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <button type="submit" className="btn-primary w-full inline-flex justify-center" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Войти'}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-800 text-center">
          Доступ только для сотрудников компании
        </p>
      </div>
    </div>
  );
}
