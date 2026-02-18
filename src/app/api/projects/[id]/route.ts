import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { readProjects, writeProjects } from '@/lib/projects';
import type { Project } from '@/types/project';

type IncomingProject = Partial<Omit<Project, 'id'>>;

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Требуется авторизация' }, { status: 401 });
  }
  const role = (session as any).role;
  if (role !== 'admin' && role !== 'agent') {
    return NextResponse.json({ message: 'Доступ запрещён' }, { status: 403 });
  }

  try {
    const body = (await request.json()) as IncomingProject & { agentId?: string };
    const { address, metro, price, profit, status, description, images, agentId } = body;

    const projects = await readProjects();
    const index = projects.findIndex((p) => p.id === params.id);
    if (index === -1) {
      return NextResponse.json({ message: 'Объект не найден' }, { status: 404 });
    }

    const current = projects[index];
    const updated: Project = {
      ...current,
      address: address ?? current.address,
      metro: metro ?? current.metro,
      price: typeof price === 'number' ? price : current.price,
      profit: typeof profit === 'number' ? profit : current.profit,
      status: status && ['active', 'sold', 'renovation'].includes(status) ? status : current.status,
      description: description ?? current.description,
      images: Array.isArray(images) && images.length >= 2 ? images : current.images,
      agentId: agentId !== undefined ? (agentId || undefined) : current.agentId
    };

    if (!updated.address || !updated.metro || !updated.description) {
      return NextResponse.json({ message: 'Неверные данные' }, { status: 400 });
    }

    projects[index] = updated;
    await writeProjects(projects);

    return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('PUT /api/projects/[id] error', error);
    return NextResponse.json({ message: 'Ошибка обновления' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Требуется авторизация' }, { status: 401 });
  }
  const role = (session as any).role;
  if (role !== 'admin' && role !== 'agent') {
    return NextResponse.json({ message: 'Доступ запрещён' }, { status: 403 });
  }

  try {
    const projects = await readProjects();
    const filtered = projects.filter((p) => p.id !== params.id);
    if (filtered.length === projects.length) {
      return NextResponse.json(
        { message: 'Проект не найден' },
        { status: 404 }
      );
    }
    await writeProjects(filtered);
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('DELETE /api/projects/[id] error', error);
    return NextResponse.json({ message: 'Ошибка удаления' }, { status: 500 });
  }
}
