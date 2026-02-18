import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import type { Agent } from '@/types/agent';
import { readAgents, writeAgents, ensureDataDir } from '@/lib/agents';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Требуется авторизация' }, { status: 401 });
  }
  try {
    const agents = await readAgents();
    return NextResponse.json(agents, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('GET /api/agents error', error);
    return NextResponse.json({ message: 'Ошибка загрузки' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Требуется авторизация' }, { status: 401 });
  }
  if ((session as any).role !== 'admin') {
    return NextResponse.json({ message: 'Только администратор может добавлять агентов' }, { status: 403 });
  }
  try {
    await ensureDataDir();
    const body = (await request.json()) as Partial<Agent>;
    const { name, phone, email, photo, telegram, whatsapp, vk } = body;
    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ message: 'Укажите имя и телефон' }, { status: 400 });
    }
    const agents = await readAgents();
    const id = (globalThis as any).crypto?.randomUUID?.() ?? `agent-${Date.now()}`;
    const newAgent: Agent = {
      id,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || undefined,
      photo: photo || undefined,
      telegram: telegram?.trim() || undefined,
      whatsapp: whatsapp?.trim() || undefined,
      vk: vk?.trim() || undefined
    };
    agents.push(newAgent);
    await writeAgents(agents);
    return NextResponse.json(newAgent, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('POST /api/agents error', error);
    return NextResponse.json({ message: 'Ошибка сохранения' }, { status: 500 });
  }
}
