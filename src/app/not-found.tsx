import Link from 'next/link';
import { Home } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';

export default function NotFound() {
  return (
    <div className="container-page min-h-[50vh] flex flex-col items-center justify-center text-center py-12">
      <p className="text-6xl font-bold text-slate-300 mb-4">404</p>
      <h1 className="text-xl font-semibold text-slate-900 mb-2">Страница не найдена</h1>
      <p className="text-slate-800 mb-6 max-w-md">
        Запрашиваемая страница не существует или была удалена.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          <Home className="h-4 w-4" />
          На главную
        </Link>
        <BackButton />
      </div>
    </div>
  );
}
