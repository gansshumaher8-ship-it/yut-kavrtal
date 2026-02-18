# Архитектура: Интеграция Telegram

## 1. Описание задачи

Ссылка на ТЗ: `docs/tz.md`

Резюме: Добавить публикацию объектов недвижимости в Telegram-канал и настройку Bot Token/Channel ID в админ-панели.

---

## 2. Функциональная архитектура

### Компонент: Telegram Publisher

**Назначение:** Отправка сообщений о объектах в Telegram-канал.

**Функции:**
- `publishProjectToTelegram(project, channelId, botToken)` — формирует и отправляет сообщение
  - Входные данные: project (address, metro, price, profit, id), channelId, botToken
  - Выходные данные: success boolean, error?: string
  - Связанные UC: UC-01

**Зависимости:** Telegram Bot API (HTTPS)

### Компонент: Settings Store

**Назначение:** Хранение настроек Telegram (Bot Token, Channel ID).

**Функции:**
- `getTelegramSettings()` — чтение настроек
- `saveTelegramSettings(token, channelId)` — сохранение
- Связанные UC: UC-02

**Зависимости:** Файловая система (JSON) или переменные окружения

---

## 3. Системная архитектура

**Стиль:** Слоистая, монолит (Next.js App).

**Компоненты:**
- `src/lib/telegram.ts` — утилита отправки в Telegram
- `src/app/api/telegram/publish/route.ts` — API для публикации (POST)
- `src/app/api/settings/telegram/route.ts` — API для чтения/записи настроек (GET/PUT)
- `src/data/settings.json` — настройки (channelId; token — только в env)

**Модель данных:**
- `settings.json`: `{ telegramChannelId?: string }`
- `TELEGRAM_BOT_TOKEN` — env (никогда не в JSON)

---

## 4. Стек технологий

- Next.js 14 (App Router)
- TypeScript
- Telegram Bot API (fetch)
- JSON (настройки)
