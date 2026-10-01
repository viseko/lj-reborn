# LJ Reborn — дорожная карта

Формат работы: я объясняю и ревьюю, весь код и конфиги пишешь ты. Отмечай `[x]`, когда часть пройдена и отревьюена.

## Стек

- **Backend:** Fastify + TypeScript, Prisma, PostgreSQL 16, JWT (access в httpOnly-cookie + refresh), node-cron
- **Frontend:** Next.js 16 (App Router), React, Zustand, SCSS-модули, кастомный pointer-based DnD, тёмная/светлая темы
- **Качество:** Vitest, Playwright, ESLint (flat config), Stylelint, Prettier, автоформат при сохранении, husky + lint-staged + commitlint, Conventional Commits, GitHub Actions
- **Монорепо:** pnpm-воркспейсы, `backend/` и `frontend/`, общий `pnpm-lock.yaml` в корне

## Модули

### 0. Окружение

- [x] 0.1 PostgreSQL: служба 16 запущена, `psql` в PATH, роль `lj_app`, базы `lj_dev` и `lj_test`
- [x] 0.2 Git-репозиторий: `main`, `.gitignore`, `.gitattributes`, `.editorconfig`, первый коммит по конвенции
- [x] 0.3 pnpm-воркспейсы: корневой `package.json`, `pnpm-workspace.yaml`, пакеты `backend` и `frontend`
- [x] 0.4 Инструменты качества, по частям:
  - [x] 0.4.1 Prettier и настройки VS Code (format on save, рекомендуемые расширения)
  - [x] 0.4.2 ESLint (flat config) и typescript-eslint
  - [x] 0.4.3 Базовый tsconfig
  - Stylelint для SCSS отложен до модуля 5 (появится фронтенд)
- [x] 0.5 Хуки и коммиты: husky, lint-staged, commitlint

### 1. Каркас бэкенда

- [x] 1.1 Установка зависимостей (`fastify`, `pino`, `pino-pretty`, `dotenv`, `zod`, `tsx`, `vitest`) и структура `src/app.ts` + `src/server.ts`
- [x] 1.2 `.env` и конфиг: чтение переменных окружения, проверка через Zod
- [x] 1.3 Первый Fastify-сервер: `app.ts` собирает приложение, `server.ts` его запускает, health-роут
- [x] 1.4 Обработка ошибок: единый формат ошибок, `setErrorHandler`, `setNotFoundHandler`
- [x] 1.5 Vitest: первый тест через `fastify.inject`, скрипт `test`

### 2. SQL с нуля и Prisma

- [x] 2.1 SQL: таблицы и типы данных, `CREATE TABLE`, `PRIMARY KEY` (практика в `psql` на `lj_dev`)
- [x] 2.2 SQL: CRUD — `INSERT`/`SELECT`/`UPDATE`/`DELETE`, фильтры и сортировка
- [x] 2.3 SQL: связи между таблицами — `FOREIGN KEY`, `JOIN`
- [x] 2.4 SQL: индексы и `EXPLAIN` (кратко, для понимания зачем)
- [x] 2.5 Prisma: установка, `schema.prisma`, `DATABASE_URL` (dev/test), генерация клиента
- [x] 2.6 Prisma: модель `User`, первая миграция, первый запрос из Fastify-плагина + тест

### 3. Регистрация и логин

- [ ] Хеширование паролей, валидация входных данных
- [ ] JWT, httpOnly-cookie, refresh-ротация, выход
- [ ] Тесты (unit и интеграционные)

### 4. Восстановление пароля

- [ ] Одноразовые токены, письма (dev-почта)
- [ ] `node-cron`: очистка просроченных токенов и сессий

### 5. Каркас фронтенда

- [ ] Next.js App Router, структура, SCSS-модули
- [ ] Дизайн-система: токены, светлая/тёмная темы, кастомные инпуты и кнопки
- [ ] Стратегия рендеринга по типам страниц: публичные посты/профили — SSG/ISR, лента с подписками и приватные записи — SSR, формы/редактор/DnD — CSR; ревалидация постов on-demand (`revalidatePath`/`revalidateTag` в хендлерах создания/редактирования/удаления)

### 6. Страницы авторизации

- [ ] Формы регистрации, входа, восстановления
- [ ] Zustand, middleware, работа с cookie

### 7. E2E и CI/CD

- [ ] Playwright: сценарии авторизации
- [ ] GitHub Actions: lint, typecheck, тесты, e2e
- [ ] CD (цель выбираем позже)

## Потом (после авторизации)

Посты, комментарии, теги, друзья, ленты подписок, сообщества, приватные записи, pointer-based drag-n-drop.

## Решения

- Репозиторий на GitHub (публичный): `github.com/viseko/lj-reborn`, CI на GitHub Actions
- Деплой: фронтенд на Vercel; бэкенд (Fastify + `node-cron`) отдельным долгоживущим процессом (Render/Railway, позже возможно VPS); база во внешнем Postgres (например, Neon)
- Фронт и бэк на разных доменах: учесть в cookie (`SameSite`, `Domain`) и CORS в модуле 3
- Локально работаем с PostgreSQL 16 (единственная версия со службой); 14 и 17 не трогаем
