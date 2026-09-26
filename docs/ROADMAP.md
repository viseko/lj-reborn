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
- [ ] 0.2 Git-репозиторий: `main`, `.gitignore`, `.gitattributes`, `.editorconfig`, первый коммит по конвенции
- [ ] 0.3 pnpm-воркспейсы: корневой `package.json`, `pnpm-workspace.yaml`, пакеты `backend` и `frontend`
- [ ] 0.4 Инструменты качества: TypeScript base config, ESLint, Prettier, Stylelint, настройки VS Code (format on save)
- [ ] 0.5 Хуки и коммиты: husky, lint-staged, commitlint

### 1. Каркас бэкенда

- [ ] Fastify, плагины, конфиг и валидация env, обработка ошибок
- [ ] Vitest и первый тест через `fastify.inject`

### 2. SQL с нуля и Prisma

- [ ] Основы SQL: таблицы, типы, ключи, SELECT/INSERT/UPDATE/DELETE, JOIN, индексы
- [ ] Prisma: схема `User`, миграции, клиент, тестовая БД

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

- Репозиторий на GitHub, CI на GitHub Actions
- Деплой: фронтенд на Vercel; бэкенд (Fastify + `node-cron`) отдельным долгоживущим процессом (Render/Railway, позже возможно VPS); база во внешнем Postgres (например, Neon)
- Фронт и бэк на разных доменах: учесть в cookie (`SameSite`, `Domain`) и CORS в модуле 3
- Локально работаем с PostgreSQL 16 (единственная версия со службой); 14 и 17 не трогаем
