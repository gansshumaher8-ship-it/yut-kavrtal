/**
 * Утилита публикации объектов в Telegram-канал через Bot API.
 */

export interface TelegramPublishResult {
  success: boolean;
  error?: string;
}

export interface ProjectForTelegram {
  id: string;
  address: string;
  metro: string;
  price: number;
  profit: number;
}

const TELEGRAM_API = 'https://api.telegram.org/bot';

/**
 * Формирует текст сообщения для публикации в канал.
 */
function formatMessage(project: ProjectForTelegram, baseUrl: string): string {
  const link = `${baseUrl}/projects/${project.id}`;
  return [
    `🏠 ${project.address}`,
    `📍 Метро: ${project.metro}`,
    `💰 Цена входа: ${project.price.toLocaleString('ru-RU')} ₽`,
    `📈 Доходность: ${project.profit.toFixed(1)}% годовых`,
    '',
    `Подробнее: ${link}`
  ].join('\n');
}

/**
 * Отправляет сообщение об объекте в Telegram-канал.
 */
export async function publishProjectToChannel(
  project: ProjectForTelegram,
  channelId: string,
  botToken: string,
  baseUrl: string
): Promise<TelegramPublishResult> {
  if (!botToken || !channelId) {
    return { success: false, error: 'Telegram не настроен' };
  }

  const text = formatMessage(project, baseUrl);
  const url = `${TELEGRAM_API}${botToken}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: channelId,
        text,
        parse_mode: undefined,
        disable_web_page_preview: false
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errMsg = data.description || `HTTP ${res.status}`;
      return { success: false, error: errMsg };
    }

    if (!data.ok) {
      return { success: false, error: data.description || 'Ошибка Telegram API' };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return { success: false, error: message };
  }
}

/**
 * Отправляет произвольное текстовое сообщение в чат/канал (для заявок с сайта).
 */
export async function sendTextToTelegram(
  text: string,
  chatId: string,
  botToken: string
): Promise<TelegramPublishResult> {
  if (!botToken || !chatId) {
    return { success: false, error: 'Telegram не настроен' };
  }
  const url = `${TELEGRAM_API}${botToken}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      return { success: false, error: data.description || `HTTP ${res.status}` };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Неизвестная ошибка' };
  }
}
