'use client';

import { useState } from 'react';
import type { Project } from '@/types/project';
import { ProjectCard } from './ProjectCard';
import { Filter } from 'lucide-react';

type StatusFilter = 'all' | Project['status'];

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'В продаже' },
  { value: 'renovation', label: 'Ремонт' },
  { value: 'sold', label: 'Реализованы' }
];

interface CatalogWithFilterProps {
  projects: Project[];
}

export function CatalogWithFilter({ projects }: CatalogWithFilterProps) {
  const [status, setStatus] = useState<StatusFilter>('all');

  const filtered =
    status === 'all' ? projects : projects.filter((p) => p.status === status);

  return (
    <section className="container-page mt-10 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Текущие проекты
          </h2>
          <p className="text-sm text-slate-800">
            Объекты редевелопмента с целевой доходностью от 15% годовых
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-xs text-slate-800">
            <Filter className="h-3 w-3" />
            Статус:
          </span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-brand"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-800">
            Найдено: {filtered.length}
          </span>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-8 text-slate-800">
          По выбранному фильтру объектов нет.
        </p>
      )}
    </section>
  );
}
