# Структура проекта «Уютный Квартал»

## Корневая папка
```
cursor/
├── public/                 # Статические файлы
│   └── uploads/            # Загруженные фото (агенты, объекты)
│       └── .gitkeep
├── src/
│   ├── app/                # Next.js App Router
│   ├── components/         # React-компоненты
│   ├── data/               # JSON-база (projects.json, agents.json)
│   ├── lib/                # Утилиты и хелперы
│   └── types/              # TypeScript-типы
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── STRUCTURE.md
```

## src/app/ — страницы и API
| Путь | Описание |
|------|----------|
| `page.tsx` | Главная |
| `layout.tsx` | Общий layout |
| `globals.css` | Глобальные стили |
| `projects/[id]/page.tsx` | Карточка объекта |
| `investors/page.tsx` | Инвестору (калькулятор, график) |
| `owners/page.tsx` | Собственникам (сдача в аренду) |
| `dashboard/page.tsx` | Панель агента |
| `admin/page.tsx` | Панель администратора |
| `api/projects/route.ts` | GET/POST проектов |
| `api/projects/[id]/route.ts` | DELETE проекта |
| `api/agents/route.ts` | GET/POST агентов |
| `api/agents/[id]/route.ts` | PUT/DELETE агента |
| `api/upload/route.ts` | Загрузка файлов |
| `api/auth/[...nextauth]/route.ts` | NextAuth (вход/выход) |
| `api/auth/seed/route.ts` | Создание первого админа (GET — проверка, POST — создание) |

## src/components/
| Папка/файл | Описание |
|------------|----------|
| `layout/Header.tsx` | Хедер, навигация, мобильное меню |
| `layout/Footer.tsx` | Футер, реквизиты, ссылка на админку |
| `layout/MobileCTA.tsx` | Фиксированная кнопка «Позвонить» на мобильных |
| `catalog/Catalog.tsx` | Сетка каталога |
| `catalog/CatalogWithFilter.tsx` | Каталог с фильтром по статусу |
| `catalog/ProjectCard.tsx` | Карточка объекта в каталоге |
| `project/BeforeAfterToggle.tsx` | Слайдер «До / После» |
| `investor/Calculator.tsx` | Калькулятор доходности |
| `investor/GrowthChart.tsx` | График роста (Recharts) |
| `ui/Slider.tsx` | Ползунок |
| `ui/ProjectImage.tsx` | Изображение с fallback |
| `ui/BackButton.tsx` | Кнопка «Назад» (для 404) |
| `providers/SessionProvider.tsx` | Обёртка NextAuth SessionProvider |

## src/data/
| Файл | Описание |
|------|----------|
| `projects.json` | Объекты недвижимости |
| `agents.json` | Агенты |
| `users.json` | Пользователи (логины для входа в панели) |

## src/lib/
| Файл | Описание |
|------|----------|
| `projects.ts` | Чтение/запись projects.json |
| `agents.ts` | Чтение/запись agents.json |
| `users.ts` | Чтение/запись users.json (логины для админа и агентов) |
| `contacts.ts` | Контактные данные компании |
| `auth.ts` | Хеширование и проверка паролей |
| `auth-options.ts` | Конфигурация NextAuth (Credentials, JWT, callbacks) |

## src/types/
| Файл | Описание |
|------|----------|
| `project.ts` | Project, ProjectStatus |
| `agent.ts` | Agent |
| `user.ts` | User, UserRole (для аутентификации) |

## Аутентификация
- **Вход:** `/login` (логин + пароль из `users.json`).
- **Первый запуск:** `/setup` — создание первого пользователя с ролью `admin`.
- **Защита:** middleware проверяет JWT; `/dashboard` — любой авторизованный, `/admin` — только `role === 'admin'`.
- Переменные: `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (см. `.env.example`).

## Команды
```bash
npm install    # Установка зависимостей
npm run dev    # Запуск dev-сервера (localhost:3000)
npm run build  # Сборка
npm run start  # Запуск production
```
