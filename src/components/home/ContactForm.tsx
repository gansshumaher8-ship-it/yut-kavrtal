'use client';

import { useState, FormEvent } from 'react';
import { Loader2 } from 'lucide-react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
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
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim() || undefined
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || 'Ошибка отправки');
        return;
      }
      setSent(true);
      setName('');
      setPhone('');
      setMessage('');
    } catch {
      setError('Ошибка отправки');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <p className="text-emerald-600 font-medium">
          Заявка отправлена. Мы свяжемся с вами в ближайшее время.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Напишите нам</h3>
      <label className="block">
        <span className="text-sm text-slate-700">Имя</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field mt-1 w-full"
          placeholder="Иван"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm text-slate-700">Телефон</span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field mt-1 w-full"
          placeholder="+7 (999) 123-45-67"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm text-slate-700">Сообщение</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input-field mt-1 w-full min-h-[80px]"
          placeholder="Ваш вопрос или комментарий"
          rows={3}
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full inline-flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Отправить заявку
      </button>
    </form>
  );
}
