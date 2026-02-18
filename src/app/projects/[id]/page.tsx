import { notFound } from 'next/navigation';
import { BeforeAfterToggle } from '@/components/project/BeforeAfterToggle';
import { TelegramPublishButton } from '@/components/project/TelegramPublishButton';
import { ProjectEditForm } from '@/components/project/ProjectEditForm';
import { MapPin, Percent, Wallet, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { getProjectById } from '@/lib/projects';
import { getAgentById, getAgents } from '@/lib/agents';
import { getSiteSettings } from '@/lib/site-settings';
import { ProjectImage } from '@/components/ui/ProjectImage';

interface ProjectPageProps {
  params: { id: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const [project, siteSettings] = await Promise.all([
    getProjectById(params.id),
    getSiteSettings()
  ]);

  if (!project) {
    return notFound();
  }

  const [before, after] = project.images;
  const agent = project.agentId ? await getAgentById(project.agentId) : null;
  const agents = await getAgents();

  return (
    <div className="container-page space-y-6">
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/" className="text-slate-800 hover:text-brand transition-colors">
          Объекты
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-900 truncate max-w-[200px] sm:max-w-none">{project.address}</span>
      </nav>

      <ProjectEditForm project={project} agents={agents} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
        <div className="space-y-4">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            {project.address}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-800">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3 text-brand" />
              {project.metro}
            </span>
          </div>
          <BeforeAfterToggle before={before} after={after} address={project.address} />
          <div className="card p-4 text-sm text-slate-800 space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">Описание проекта</h2>
            <p>{project.description}</p>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <div className="card p-4 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Инвестиционные параметры
            </h2>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-brand" />
                  <span className="text-slate-800">Цена входа</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {project.price.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-emerald-500" />
                  <span className="text-slate-800">Целевая доходность</span>
                </div>
                <span className="font-semibold text-emerald-600">
                  от {project.profit.toFixed(1)}% годовых
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-800">
              Параметры сделки и структура участия согласуются индивидуально.
            </p>
            <TelegramPublishButton projectId={project.id} className="mt-3" />
          </div>

          <div className="card p-4 border-orange-100 bg-orange-50/50">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Связаться</h2>
            {agent ? (
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                  {agent.photo ? (
                    <ProjectImage src={agent.photo} alt={agent.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <span className="text-lg font-medium text-slate-600">{agent.name[0]}</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="font-medium text-slate-900">{agent.name}</p>
                  <p className="text-sm text-slate-800">{agent.phone}</p>
                  <a href={`tel:${agent.phone.replace(/\D/g, '')}`} className="btn-primary inline-flex text-xs py-2 px-3">
                    <Phone className="h-3 w-3 mr-1" />
                    Позвонить
                  </a>
                  {(agent.telegram || agent.whatsapp || agent.vk) && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-orange-200">
                      {agent.telegram && (
                        <a href={agent.telegram.startsWith('http') ? agent.telegram : `https://t.me/${agent.telegram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-600 hover:underline">
                          Telegram
                        </a>
                      )}
                      {agent.whatsapp && (
                        <a href={agent.whatsapp.startsWith('http') ? agent.whatsapp : `https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:underline">
                          WhatsApp
                        </a>
                      )}
                      {agent.vk && (
                        <a href={agent.vk.startsWith('http') ? agent.vk : `https://vk.com/${agent.vk}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                          ВКонтакте
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <a href={`tel:${siteSettings.phone.replace(/\D/g, '')}`} className="flex items-center gap-2 text-slate-900 hover:text-brand">
                  <Phone className="h-4 w-4" />
                  {siteSettings.phone}
                </a>
                <a href={`mailto:${siteSettings.email}`} className="flex items-center gap-2 text-slate-900 hover:text-brand">
                  <Mail className="h-4 w-4" />
                  {siteSettings.email}
                </a>
                <a href={`tel:${siteSettings.phone.replace(/\D/g, '')}`} className="btn-primary w-full inline-flex justify-center mt-2 text-sm py-2">
                  <Phone className="h-4 w-4 mr-2" />
                  Получить консультацию
                </a>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
