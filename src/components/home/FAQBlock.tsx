'use client';

import { useState } from 'react';
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';
import { ChevronDown } from 'lucide-react';

function parseFaq(content: string | undefined): { q: string; a: string }[] {
  if (!content?.trim()) return [];
  return content
    .split(/\r?\n/)
    .map((line) => {
      const i = line.indexOf('|');
      if (i >= 0) return { q: line.slice(0, i).trim(), a: line.slice(i + 1).trim() };
      return { q: line.trim(), a: '' };
    })
    .filter((item) => item.q);
}

export function FAQBlock() {
  const settings = useSiteSettings();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = parseFaq(settings.faqContent);
  if (items.length === 0) return null;

  return (
    <section className="container-page">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Часто задаваемые вопросы</h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between gap-3 py-4 px-4 text-left text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium">{item.q}</span>
              <ChevronDown className={`h-5 w-5 flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 text-sm text-slate-700 border-t border-slate-100 pt-2 whitespace-pre-line">
                {item.a}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
