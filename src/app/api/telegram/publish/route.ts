import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getProjectById } from '@/lib/projects';
import { readSettings } from '@/lib/settings';
import { publishProjectToChannel } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Требуется авторизация' }, { status: 401 });
  }

  const role = (session as any).role;
  if (role !== 'admin' && role !== 'agent') {
    return NextResponse.json({ message: 'Доступ запрещён' }, { status: 403 });
  }

  let body: { projectId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Неверный формат запроса' }, { status: 400 });
  }

  const projectId = body.projectId;
  if (!projectId || typeof projectId !== 'string') {
    return NextResponse.json({ message: 'Укажите projectId' }, { status: 400 });
  }

  const project = await getProjectById(projectId);
  if (!project) {
    return NextResponse.json({ message: 'Объект не найден' }, { status: 404 });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const settings = await readSettings();
  const channelId = settings.telegramChannelId || process.env.TELEGRAM_CHANNEL_ID;

  if (!botToken || !channelId) {
    return NextResponse.json(
      { message: 'Публикация в Telegram не настроена. Обратитесь к администратору.' },
      { status: 400 }
    );
  }

  const baseUrl = process.env.NEXTAUTH_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const result = await publishProjectToChannel(
    {
      id: project.id,
      address: project.address,
      metro: project.metro,
      price: project.price,
      profit: project.profit
    },
    channelId,
    botToken,
    baseUrl
  );

  if (!result.success) {
    return NextResponse.json(
      { message: result.error || 'Не удалось опубликовать. Попробуйте позже.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: 'Объект опубликован' });
}
