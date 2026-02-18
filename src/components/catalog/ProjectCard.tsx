import Link from 'next/link';
import type { Project } from '@/types/project';
import { ProjectImage } from '@/components/ui/ProjectImage';

const statusLabel: Record<Project['status'], string> = {
  active: 'В продаже',
  sold: 'Реализован',
  renovation: 'Ремонт'
};

const statusColor: Record<Project['status'], string> = {
  active: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  sold: 'border-slate-300 bg-slate-100 text-slate-800',
  renovation: 'border-amber-300 bg-amber-50 text-amber-700'
};

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [before] = project.images;

  return (
    <Link
      href={`/projects/${project.id}`}
      className="card overflow-hidden flex flex-col hover:border-brand hover:shadow-md transition-all group"
    >
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <ProjectImage
          src={before}
          alt={project.address}
          fill
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs">
          <span className={`badge border ${statusColor[project.status]}`}>
            {statusLabel[project.status]}
          </span>
          <span className="badge border-white/80 bg-white/90 text-slate-700">
            {project.metro}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">
          {project.address}
        </h3>
        <p className="text-xs text-slate-800 line-clamp-2">
          {project.description}
        </p>

        <div className="mt-auto flex items-center justify-between text-xs">
          <div className="flex flex-col">
            <span className="text-slate-800">Цена входа</span>
            <span className="font-semibold text-slate-800">
              {project.price.toLocaleString('ru-RU')} ₽
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-slate-800">Доходность</span>
            <span className="font-semibold text-emerald-600">
              от {project.profit.toFixed(1)}% годовых
            </span>
          </div>
        </div>
        <p className="text-center mt-2">
          <span className="text-xs text-brand font-medium">Запросить консультацию →</span>
        </p>
      </div>
    </Link>
  );
}

