import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

import {
  BACKEND_PORT,
  BACKEND_URL,
  FRONTEND_PORT,
  FRONTEND_URL,
  MAILPIT_URL,
} from "./helpers/env.js";

// Локально адрес БД берётся из e2e/.env;
// В CI файла нет, переменные задаёт сам пайплайн
if (existsSync(".env")) {
  process.loadEnvFile();
}

// Без этой проверки бекенд молча возьмёт dev-путь к БД из backend-пакета
const databaseURL = process.env.DATABASE_URL_E2E;
if (!databaseURL) {
  throw new Error(
    "Не задан DATABASE_URL_E2E (e2e/.env или переменная окружения в CI)",
  );
}

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: FRONTEND_URL,
  },
  projects: [
    {
      name: "chromium",
      use: devices["Desktop Chrome"],
    },
  ],
  webServer: [
    {
      // бекенд: без watch - в тестах перезапуск по изменению файлов не нужен
      command: "pnpm --filter @lj/backend exec tsx src/server.ts",
      url: `${BACKEND_URL}/health`,
      env: {
        PORT: BACKEND_PORT,
        DATABASE_URL: databaseURL,
        CORS_ORIGIN: FRONTEND_URL,
        SMTP_HOST: "localhost",
      },
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      // фронтенд: продакшен-сборка; NEXT_PUBLIC_API вшивается в код при build
      command: `pnpm --filter @lj/frontend build && pnpm --filter @lj/frontend start -p ${FRONTEND_PORT}`,
      url: FRONTEND_URL,
      env: {
        NEXT_PUBLIC_API_URL: BACKEND_URL,
      },
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: "mailpit",
      url: MAILPIT_URL,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
