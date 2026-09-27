// Cобирает приложение: создаёт инстанс Fastify, регистрирует плагины и маршруты.
// Экспортирует готовое приложение, но не запускает его слушать сеть.

import Fastify from "fastify";
import { env } from "./env";

export function buildApp() {
  const app = Fastify({
    logger: {
      level: env.logLevel,
      transport:
        env.nodeEnv === "production"
          ? undefined
          : {
              target: "pino-pretty",
            },
    },
  });

  app.get("/health", async () => ({ status: "ok" }));

  return app;
}
