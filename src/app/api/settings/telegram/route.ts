import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { readSettings, writeSettings } from '@/lib/settings';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Требуется авторизация' }, { status: 401 });
  }

  const role = (session as any).role;
  if (role !== 'admin') {
    return NextResponse.json({ message: 'Доступ только для администратора' }, { status: 403 });
  }

  const settings = await readSettings();
  const hasToken = !!process.env.TELEGRAM_BOT_TOKEN;

  return NextResponse.json({
    telegramChannelId: settings.telegramChannelId || '',
    hasToken
  });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Требуется авторизация' }, { status: 401 });
  }

  const role = (session as any).role;
  if (role !== 'admin') {
    return NextResponse.json({ message: 'Доступ только для администратора' }, { status: 403 });
  }

  let body: { telegramChannelId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Неверный формат запроса' }, { status: 400 });
  }

  const channelId = typeof body.telegramChannelId === 'string'
    ? body.telegramChannelId.trim()
    : '';

  await writeSettings({ telegramChannelId: channelId || undefined });

  return NextResponse.json({ success: true, message: 'Настройки сохранены' });
}
