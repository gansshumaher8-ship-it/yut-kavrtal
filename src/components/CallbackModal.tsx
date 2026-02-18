'use client';

import { useState, FormEvent } from 'react';
import { X, Loader2 } from 'lucide-react';

export function CallbackModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim()) {
      setError('Укажите имя и телефон');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), type: 'callback' })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || 'Ошибка отправки');
        return;
      }
      setSent(true);
      setName('');
      setPhone('');
      setTimeout(() => { setSent(false); onClose(); }, 2000);
    } catch {
      setError('Ошибка отправки');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6" role="dialog" aria-labelledby="callback-title">
        <div className="flex items-center justify-between mb-4">
          <h2 id="callback-title" className="text-lg font-semibold text-slate-900">Заказать звонок</h2>
          <button type="button" onClick={onClose} className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100" aria-label="Закрыть">
            <X className="h-5 w-5" />
          </button>
        </div>
        {sent ? (
          <p className="text-emerald-600 font-medium">Заявка отправлена. Мы перезвоним вам в ближайшее время.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm text-slate-700">Имя</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field mt-1 w-full" placeholder="Иван" required />
            </label>
            <label className="block">
              <span className="text-sm text-slate-700">Телефон</span>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field mt-1 w-full" placeholder="+7 (999) 123-45-67" required />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1 inline-flex items-center justify-center gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Отправить
              </button>
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-full border border-slate-300 text-slate-800 hover:bg-slate-50 text-sm">
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
