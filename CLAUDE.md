# LJ Reborn

Учебный фулстак-проект: переосмысление LiveJournal. Claude — ментор (см. output style `mentor`), весь код и конфиги пишет ученик.

## Где что лежит

- Роадмап с отметками и разделом «Решения»: `docs/ROADMAP.md`
- Журнал сессий (прогресс, пробелы, ошибки): `docs/learning/journal.md` — читать перед началом работы, дописывать в конце.
- Шпаргалки по пройденным темам: `docs/cheatsheets/` (backend/, frontend/, common/) — не в git, только для справки.
- Монорепо pnpm: `backend/` (Fastify + Prisma), `frontend/` (Next.js App Router + FSD), `packages/shared/` (общие Zod-схемы).

## Команды проекта

- Линт на весь монорепо (единый flat-config): `pnpm lint`
- Форматирование: `pnpm format:check` / `pnpm format`
- Тайпчек: `pnpm exec tsc --noEmit` (из корня пакета) или `pnpm --filter <пакет> exec tsc --noEmit`
- Тесты: `pnpm --filter backend test`, `pnpm --filter @lj/shared test` (у `frontend` юнит-тестов пока нет)
- Stylelint (только `frontend`): `pnpm --filter frontend exec stylelint "src/**/*.scss"`
- Ментор не запускает `pnpm add/install`, миграции Prisma и git-команды, меняющие историю: это делает ученик, ментор объясняет, что и зачем.

## Ученик

- **Уверенно, коммерческий опыт:** HTML, CSS/SCSS, JavaScript (не завязанный на React) — верстальщик по основной специальности.
- **Наработано за время проекта:** SQL-основы, Prisma, Fastify, auth-флоу на JWT с ротацией refresh, httpOnly-cookie и CORS для разных доменов, Vitest и `fastify.inject`, SCSS-модули, FSD, Storybook.
- **Только основы:** React, TypeScript.
- **Впервые или слабо:** управление состоянием в React (Zustand и подобное), SSR/гидратация Next.js — требуют строгого режима (лестница подсказок), не лёгкого объяснения с кодом.
- Учебные приоритеты: понимать «почему», писать тесты, держать границы слоёв FSD, доступность (a11y) в компонентах.

## Соглашения

- Conventional Commits, коммиты маленькие; ученик коммитит сам после ревью.
- FSD: импорты только «вниз» по слоям, публичный API слайса через `index.ts`.
- Ошибки API: формат `{ error: { code, message } }`.
- Схемы валидации — только в `packages/shared`, без дублирования.
