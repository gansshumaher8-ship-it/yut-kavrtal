import type { Project } from '@/types/project';
import { ProjectCard } from './ProjectCard';

interface CatalogProps {
  projects: Project[];
}

export function Catalog({ projects }: CatalogProps) {
  return (
    <section className="container-page mt-10 space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Текущие проекты
          </h2>
          <p className="text-sm text-slate-800">
            Объекты редевелопмента с целевой доходностью от 15% годовых
          </p>
        </div>
        <span className="text-xs text-slate-800">
          Всего объектов: {projects.length}
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
