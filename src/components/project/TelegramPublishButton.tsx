'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Send } from 'lucide-react';

interface TelegramPublishButtonProps {
  projectId: string;
  className?: string;
  variant?: 'default' | 'compact';
}

export function TelegramPublishButton({ projectId, className = '', variant = 'default' }: TelegramPublishButtonProps) {
  const { data: session, status } = useSession();
  const role = (session as any)?.role;
  const canPublish = status === 'authenticated' && (role === 'admin' || role === 'agent');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);

  async function handlePublish() {
    setLoading(true);
    setMessage(null);
    setError(false);

    try {
      const res = await fetch('/api/telegram/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data.message || 'Ошибка публикации');
        setError(true);
        return;
      }

      setMessage('Объект опубликован в Telegram');
    } catch {
      setMessage('Не удалось опубликовать. Попробуйте позже.');
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (!canPublish) return null;

  return (
    <div className={`space-y-1 ${className}`}>
      <button
        type="button"
        onClick={handlePublish}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-800 hover:bg-sky-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="h-4 w-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {variant === 'compact' ? 'В Telegram' : 'Опубликовать в Telegram'}
      </button>
      {message && (
        <p className={`text-xs ${error ? 'text-red-600' : 'text-emerald-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
