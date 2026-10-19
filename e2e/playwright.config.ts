import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

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
    baseURL: "http://localhost:3100",
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
      url: "http://localhost:3101/health",
      env: {
        PORT: "3101",
        DATABASE_URL: databaseURL,
        CORS_ORIGIN: "http://localhost:3100",
      },
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      // фронтенд: продакшен-сборка; NEXT_PUBLIC_API вшивается в код при build
      command:
        "pnpm --filter @lj/frontend build && pnpm --filter frontend start -p 3100",
      url: "http://localhost:3100",
      env: {
        NEXT_PUBLIC_API_URL: "http://localhost:3101",
      },
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
