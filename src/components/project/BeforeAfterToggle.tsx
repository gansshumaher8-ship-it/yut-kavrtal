'use client';

import { useState } from 'react';
import { Sparkles, Wrench } from 'lucide-react';
import { ProjectImage } from '@/components/ui/ProjectImage';

interface BeforeAfterToggleProps {
  before: string;
  after: string;
  address: string;
}

type Mode = 'before' | 'after';

export function BeforeAfterToggle({
  before,
  after,
  address
}: BeforeAfterToggleProps) {
  const [mode, setMode] = useState<Mode>('after');
  const currentSrc = mode === 'before' ? before : after;

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-1 text-xs text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Редевелопмент &laquo;под ключ&raquo;
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2 py-1 text-xs text-slate-800">
          <Sparkles className="h-3 w-3 text-brand" />
          До / После
        </div>
      </div>

      <div className="px-4 pt-4 flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => setMode('before')}
          className={`flex-1 inline-flex items-center justify-center gap-1 rounded-full px-3 py-1.5 border text-xs transition-colors ${
            mode === 'before'
              ? 'bg-slate-200 border-slate-400 text-slate-800'
              : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
          }`}
        >
          <Wrench className="h-3 w-3" />
          До ремонта
        </button>
        <button
          type="button"
          onClick={() => setMode('after')}
          className={`flex-1 inline-flex items-center justify-center gap-1 rounded-full px-3 py-1.5 border text-xs transition-colors ${
            mode === 'after'
              ? 'bg-brand border-brand text-white'
              : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-brand'
          }`}
        >
          <Sparkles className="h-3 w-3" />
          Готовый объект
        </button>
      </div>

      <div className="relative mt-4 h-72 w-full overflow-hidden bg-slate-100">
        <ProjectImage
          key={mode}
          src={currentSrc}
          alt={`${address} — ${mode === 'before' ? 'до ремонта' : 'после ремонта'}`}
          fill
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 flex flex-col gap-1 text-xs">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-slate-800">
            {mode === 'before' ? 'Состояние до редевелопмента' : 'Готовый продукт'}
          </span>
          <span className="text-[11px] text-white drop-shadow">{address}</span>
        </div>
      </div>
    </div>
  );
}
