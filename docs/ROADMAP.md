# LJ Reborn — дорожная карта

Формат работы: я объясняю и ревьюю, весь код и конфиги пишешь ты. Отмечай `[x]`, когда часть пройдена и отревьюена.

## Стек

- **Backend:** Fastify + TypeScript, Prisma, PostgreSQL 16, JWT (access в httpOnly-cookie + refresh), node-cron
- **Frontend:** Next.js 16 (App Router), React, Zustand, SCSS-модули, кастомный pointer-based DnD, тёмная/светлая темы, методология Feature-Sliced Design, Storybook для компонентов
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

- [x] 3.1 Валидация: Zod-схемы регистрации и логина (email, `login`, `username`, пароль)
- [x] 3.2 Хеширование паролей (argon2), хранение только хеша
- [x] 3.3 CORS (`@fastify/cors`): origin из env, `credentials` — подготовка к cross-origin cookie (фронт и бэк на разных доменах)
- [x] 3.4 JWT-утилиты: подпись/проверка access и refresh токенов, секреты в env
- [x] 3.5 Модель `RefreshToken`/сессии в Prisma + миграция (нужна для ротации и инвалидации)
- [x] 3.6 Эндпоинты `register`/`login`/`refresh`/`logout` + httpOnly-cookie, по частям:
  - [x] 3.6.1 `@fastify/cookie`: плагин, опции (`httpOnly`, `secure`, `sameSite`), префикс маршрутов `/auth`
  - [x] 3.6.2 `POST /auth/register`
  - [x] 3.6.3 `POST /auth/login`
  - [x] 3.6.4 `POST /auth/refresh` (с ротацией)
  - [x] 3.6.5 `POST /auth/logout`
- [x] 3.7 Тесты: unit (хеширование, JWT-утилиты) + интеграционные (полный флоу через `fastify.inject` и `lj_test`)

### 4. Восстановление пароля

- [x] 4.1 Модель `PasswordResetToken` в Prisma + миграция (одноразовый токен: случайная строка + хеш в базе, не JWT — другая механика, не как у refresh)
- [x] 4.2 Dev-отправка писем: выбор инструмента (например, nodemailer + локальный перехватчик типа Mailpit, без реальной почты)
- [x] 4.3 `POST /auth/forgot-password` — по `login` или `email`, генерация токена, «отправка» письма со ссылкой
- [x] 4.4 `POST /auth/reset-password` — по токену + новый пароль: проверка токена, смена пароля, инвалидация токена, отзыв всех refresh-сессий пользователя
- [x] 4.5 `node-cron`: периодическая очистка просроченных `PasswordResetToken` и отозванных/просроченных `RefreshToken`
- [x] 4.6 Тесты: unit + интеграционные (по аналогии с 3.7)

### 5. Каркас фронтенда

- [x] 5.1 Next.js App Router: создание проекта в монорепо, базовая структура под Feature-Sliced Design (слои `src/{app,pages,widgets,features,entities,shared}`, роутинг Next.js — `app/` на корне пакета, пустой `pages/` для отличия от легаси Pages Router, по официальному гайду FSD+Next.js)
- [x] 5.2 SCSS-модули: настройка, соглашения, Stylelint (отложен с модуля 0.4)
- [x] 5.3 Дизайн-токены: цвета, типографика, spacing — CSS-переменные (брейкпоинты — SCSS-переменные, т.к. custom properties не работают внутри `@media`); CSS reset; шрифт Manrope через `next/font/google`
- [x] 5.4 Тёмная/светлая тема: написано с нуля (`data-theme` на `<html>`, блокирующий скрипт в `public/theme-init.js` против FOUC, Zustand-стор, `suppressHydrationWarning`); позже переделать на `next-themes` для сравнения подходов
- [x] 5.5 Кастомные компоненты: `Button` (варианты, hover/focus-visible/disabled) и `Input` (опциональный `label`, `aria-invalid`/`aria-describedby` для ошибок, `useId` для связки label↔input) на токенах; Storybook настроен (токены/шрифт/обе темы через тулбар)
- [x] 5.6 Стратегия рендеринга по типам страниц: публичные посты/профили — SSG/ISR, лента с подписками и приватные записи — SSR, формы/редактор/DnD — CSR; ревалидация постов on-demand (`revalidatePath`/`revalidateTag` в хендлерах создания/редактирования/удаления)

### 6. Страницы авторизации

- [x] 6.1 Общий пакет `packages/shared`: Zod-схемы валидации вынесены из `backend`, подключены в `backend` и `frontend` как единый источник истины
- [x] 6.2 API-клиент на фронте: обёртка над `fetch`, базовый URL из env, `credentials: "include"` для cross-origin cookie, единая обработка ошибок формата `{error:{code,message}}`
- [x] 6.3 Auth Zustand-стор (`entities/user`): состояние пользователя (не токен — он в httpOnly cookie, стор держит только данные профиля), статус-машина `idle/loading/authenticated/unauthenticated`, actions `login`/`register`/`logout`/`fetchMe`. Потребовало незапланированного дополнения бэкенда — `GET /auth/me` (восстановление сессии при обновлении страницы: JS не может прочитать httpOnly cookie напрямую, нужен эндпоинт, который сам проверит её на сервере и вернёт текущего пользователя)
- [x] 6.4 Страница регистрации (`features/auth/register-form` + `src/pages/register` + `app/register`): форма на `Input`/`Button`, объектный `useState` под значения полей, клиентская валидация через `registerSchema.safeParse` из `@lj/shared` (+ ручная сверка повтора пароля), ошибки с бэкенда через `ApiError`, редирект через `useRouter` из `next/navigation`. Заодно: `clsx` для условных классов, показ/скрытие пароля в `Input` (`lucide-react`), `noValidate` на форме (своя валидация вместо нативной), русские сообщения в Zod-схемах, фикс алиаса `@/*` в `vitest.config.ts` (`resolve.tsconfigPaths`)
- [x] 6.5 Страница входа: форма, редирект после успеха
- [x] 6.6 Восстановление пароля: `forgot-password` и `reset-password` — два экрана/формы
- [x] 6.7 Логаут + защита маршрутов: Next.js middleware, редиректы для авторизованных/неавторизованных
- [x] 6.8 Серверный `Header`, по частям:
  - [x] 6.8.1 Асимметричная подпись access-токена (Ed25519/EdDSA вместо HS256): приватный ключ только у бэкенда, фронт получает публичный — проверяет, но не может подделать; `login` в payload (в `/auth/refresh` берётся через `include` + `select`); схема payload в `@lj/shared`
  - [x] 6.8.2 `getSessionUser()` в `entities/user/api` (отдельный серверный вход `entities/user/server.ts` + `server-only`): `cookies()` → `jwtVerify` из `jose` с белым списком алгоритмов → `safeParse` payload; ключ импортируется лениво один раз (`??=` на промисе); нет сессии → `null`, нет ключа → громкая ошибка
  - [x] 6.8.3 Разделение `Header`: `Header` (сервер) → `Suspense` → `HeaderAuth` (сервер, `async`, `getSessionUser()`) → `HeaderAuthClient` (клиент, проп `initialUser`). Первый кадр из пропа, пока стор `idle`; засев стора action'ом `initSession` в `useEffect` (только в браузере — singleton-стор на сервере общий для всех запросов, писать в него при SSR нельзя); `SessionInit` удалён
  - [x] 6.8.4 `COOKIE_DOMAIN` для `access_token` на бэкенде (необязательная env, локально не задаётся — `localhost` не поддерживает `Domain`); тот же `domain` в `clearCookie`, иначе браузер не найдёт cookie для удаления (cookie = имя + домен + путь)
- [x] 6.9 Автообновление access-токена без моргания (stale-while-revalidate): cookie `access_token` живёт срок refresh (конверт), сам токен — 15 минут (письмо); `getSessionUser()` принимает просроченный токен с верной подписью (`errors.JWTExpired.payload` — подпись проверяется до сроков) и возвращает `{ user, expired }`; клиент при `expired` тихо вызывает `/auth/refresh` (`refreshSession` в сторе → `refreshTokens` в `shared/api` с дедупликацией через `??=` на промисе — защита от StrictMode и параллельных вызовов); неудачный refresh стирает cookie на бэке (кроме ветки «already used» — там новые cookie уже поставил параллельный запрос). Повтор в `apiFetch` на 401 отложен до первых защищённых эндпоинтов (см. «Потом»)

### 7. E2E и CI/CD

- [ ] Playwright: сценарии авторизации
- [ ] GitHub Actions: lint, typecheck, тесты, e2e
- [ ] CD (цель выбираем позже)

## Потом (после авторизации)

Посты, комментарии, теги, друзья, ленты подписок, сообщества, приватные записи, pointer-based drag-n-drop.

Первая задача при появлении защищённых эндпоинтов (из 6.9): `apiFetch` на 401 → `refreshTokens()` → один повтор запроса; не применять к `/auth/*` (там 401 = «неверный пароль», не «токен истёк»); механизм уведомления стора о неудачном refresh из `shared` (колбэк/событие — `shared` не импортирует `entities`). Плюс открытый вопрос: две вкладки со старым refresh после ротации попадают в ветку массового отзыва — нужна координация между вкладками (например, `BroadcastChannel`/`navigator.locks`) или окно терпимости на бэке.

## Решения

- Репозиторий на GitHub (публичный): `github.com/viseko/lj-reborn`, CI на GitHub Actions
- Деплой: фронтенд на Vercel; бэкенд (Fastify + `node-cron`) отдельным долгоживущим процессом (Render/Railway, позже возможно VPS); база во внешнем Postgres (например, Neon)
- Фронт и бэк на разных доменах: учесть в cookie (`SameSite`, `Domain`) и CORS в модуле 3
- Домены в проде: `site.com` (фронт) и `api.site.com` (бэк) — поддомены одного домена, один "сайт" для `SameSite=Lax`. К деплою: `access_token` ставить с `domain: ".site.com"` (через env, например `COOKIE_DOMAIN`, локально без него), иначе middleware и серверные компоненты Next.js не увидят сессию; `refresh_token` оставить привязанным к `api.site.com` (фронтенду он не нужен). Прокси через `rewrites` при такой схеме не нужен
- Хедер без моргания: клиентские варианты (пустой слот, плавное появление) отвергнуты — до ответа `/auth/me` в первом кадре либо неверный блок, либо пустота. Решение — серверный рендер состояния авторизации в `Header` (пункт 6.8). Локально работает сразу (cookie привязаны к домену, не к порту — `localhost:3000` видит cookie от `localhost:4000`); в проде требует `COOKIE_DOMAIN` (см. выше)
- Переключатель темы без моргания: разметка кнопки не зависит от темы (обе иконки всегда в DOM, нейтральный `aria-label`), видимую иконку выбирает CSS по `[data-theme]` на `<html>`, который ставит блокирующий `theme-init.js` до отрисовки — нет ни mismatch, ни задержки до гидратации
- Локально работаем с PostgreSQL 16 (единственная версия со службой); 14 и 17 не трогаем
- Рендеринг по типам страниц (решено в 5.6, реальных страниц с данными ещё нет — применится по мере появления): публичные посты/профили — SSG/ISR (SEO, кеш, `revalidatePath`/`revalidateTag` on-demand при создании/изменении/удалении); лента с подписками и приватные записи — SSR (персонализация, нельзя кешировать статически); формы/редактор/DnD — CSR (чистая интерактивность, SEO не нужен)
