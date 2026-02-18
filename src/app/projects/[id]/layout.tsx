import { getProjectById } from '@/lib/projects';
import type { Metadata } from 'next';

const baseUrl = process.env.NEXTAUTH_URL || process.env.SITE_URL || 'https://uyutny-kvartal.ru';

type Props = { params: { id: string }; children: React.ReactNode };

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const project = await getProjectById(params.id);
  if (!project)
    return { title: 'Объект не найден', robots: { index: false, follow: false } };
  const title = `${project.address}`;
  const description = `Инвестиционный проект: ${project.address}, метро ${project.metro}. Доходность от ${project.profit}% годовых. Цена входа ${project.price.toLocaleString('ru-RU')} ₽. Редевелопмент, Уютный Квартал.`;
  const url = `${baseUrl}/projects/${project.id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | Уютный Квартал`,
      description,
      url,
      type: 'website'
    }
  };
}

export default function ProjectLayout({ children }: Props) {
  return children;
}
