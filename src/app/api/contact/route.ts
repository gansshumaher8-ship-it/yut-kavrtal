import { NextRequest, NextResponse } from 'next/server';
import { readSettings } from '@/lib/settings';
import { sendTextToTelegram } from '@/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name ?? '').trim();
    const phone = String(body.phone ?? '').trim();
    const message = String(body.message ?? '').trim();
    const type = String(body.type ?? 'contact').trim(); // contact | callback

    if (!name || !phone) {
      return NextResponse.json({ message: 'Укажите имя и телефон' }, { status: 400 });
    }

    const settings = await readSettings();
    const channelId = settings.telegramChannelId;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    const label = type === 'callback' ? 'Заказ звонка' : 'Заявка с сайта';
    const text = [
      `📩 ${label}`,
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      message ? `Сообщение: ${message}` : ''
    ].filter(Boolean).join('\n');

    if (channelId && botToken) {
      const result = await sendTextToTelegram(text, channelId, botToken);
      if (!result.success) {
        console.error('Telegram send error:', result.error);
      }
    }

    return NextResponse.json({ success: true, message: 'Заявка отправлена' });
  } catch (e) {
    console.error('POST /api/contact error', e);
    return NextResponse.json({ message: 'Ошибка отправки' }, { status: 500 });
  }
}
