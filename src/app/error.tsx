'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-6 text-center">
        <h1 className="text-lg font-semibold text-slate-900 mb-2">Что-то пошло не так</h1>
        <p className="text-sm text-slate-600 mb-4">
          Ошибка при загрузке страницы. Попробуйте обновить страницу или вернуться на главную.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            Повторить
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
