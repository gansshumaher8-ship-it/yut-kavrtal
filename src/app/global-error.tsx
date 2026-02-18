'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * { box-sizing: border-box; }
          body { margin: 0; font-family: system-ui, sans-serif; background: #f8fafc; color: #334155; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; }
          .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1.5rem; max-width: 28rem; text-align: center; }
          h1 { font-size: 1.125rem; font-weight: 600; margin: 0 0 0.5rem 0; color: #0f172a; }
          p { font-size: 0.875rem; color: #64748b; margin: 0 0 1rem 0; }
          a, button { display: inline-block; padding: 0.5rem 1rem; font-size: 0.875rem; border-radius: 9999px; text-decoration: none; margin: 0 0.25rem; cursor: pointer; border: none; }
          .btn-primary { background: #ea580c; color: #fff; }
          .btn-primary:hover { background: #c2410c; }
          .btn-secondary { background: #fff; color: #334155; border: 1px solid #cbd5e1; }
          .btn-secondary:hover { background: #f1f5f9; }
        `}</style>
      </head>
      <body>
        <div className="card">
          <h1>Ошибка приложения</h1>
          <p>Произошла непредвиденная ошибка. Обновите страницу или перейдите на главную.</p>
          <button type="button" onClick={reset} className="btn-primary">
            Повторить
          </button>
          <a href="/" className="btn-secondary">
            На главную
          </a>
        </div>
      </body>
    </html>
  );
}
