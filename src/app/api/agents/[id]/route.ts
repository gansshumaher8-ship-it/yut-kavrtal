import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import type { Agent } from '@/types/agent';
import { readAgents, writeAgents } from '@/lib/agents';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Требуется авторизация' }, { status: 401 });
  }

  const role = (session as any).role;
  const sessionAgentId = (session as any).agentId;
  const isOwnAgent = role === 'agent' && sessionAgentId === params.id;

  if (role !== 'admin' && !isOwnAgent) {
    return NextResponse.json({ message: 'Нет прав на редактирование этого агента' }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Partial<Agent>;
    const agents = await readAgents();
    const idx = agents.findIndex((a) => a.id === params.id);
    if (idx < 0) {
      return NextResponse.json({ message: 'Агент не найден' }, { status: 404 });
    }

    if (isOwnAgent) {
      agents[idx] = {
        ...agents[idx],
        telegram: body.telegram !== undefined ? (body.telegram?.trim() || undefined) : agents[idx].telegram,
        whatsapp: body.whatsapp !== undefined ? (body.whatsapp?.trim() || undefined) : agents[idx].whatsapp,
        vk: body.vk !== undefined ? (body.vk?.trim() || undefined) : agents[idx].vk
      };
    } else {
      agents[idx] = {
        ...agents[idx],
        name: body.name?.trim() ?? agents[idx].name,
        phone: body.phone?.trim() ?? agents[idx].phone,
        email: body.email?.trim() || undefined,
        photo: body.photo ?? agents[idx].photo,
        telegram: body.telegram !== undefined ? (body.telegram?.trim() || undefined) : agents[idx].telegram,
        whatsapp: body.whatsapp !== undefined ? (body.whatsapp?.trim() || undefined) : agents[idx].whatsapp,
        vk: body.vk !== undefined ? (body.vk?.trim() || undefined) : agents[idx].vk
      };
    }
    await writeAgents(agents);
    return NextResponse.json(agents[idx], { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('PUT /api/agents/[id] error', error);
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
  if ((session as any).role !== 'admin') {
    return NextResponse.json({ message: 'Только администратор может удалять агентов' }, { status: 403 });
  }
  try {
    const agents = await readAgents();
    const filtered = agents.filter((a) => a.id !== params.id);
    if (filtered.length === agents.length) {
      return NextResponse.json({ message: 'Агент не найден' }, { status: 404 });
    }
    await writeAgents(filtered);
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('DELETE /api/agents/[id] error', error);
    return NextResponse.json({ message: 'Ошибка удаления' }, { status: 500 });
  }
}
