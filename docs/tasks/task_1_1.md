# Задача 1.1: Утилита Telegram и API publish

## Связь с юзер-кейсами
- UC-01: Публикация объекта в Telegram-канал

## Цель
Создать `src/lib/telegram.ts` и API `POST /api/telegram/publish` для отправки сообщения об объекте в канал.

## Описание изменений

### Новые файлы
- `src/lib/telegram.ts` — функция `publishProjectToChannel(project, channelId, botToken)`
- `src/app/api/telegram/publish/route.ts` — POST: принимает projectId, проверяет сессию, вызывает publish

### Логика
- Формат сообщения: `{адрес}\n{метро}\nЦена: {price} ₽\nДоходность: {profit}%\n{ссылка}`

## Критерии приёмки
- [ ] Утилита отправляет сообщение через Bot API
- [ ] API возвращает 401 без авторизации
- [ ] API возвращает 400 при отсутствии настроек
