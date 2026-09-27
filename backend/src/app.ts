// Cобирает приложение: создаёт инстанс Fastify, регистрирует плагины и маршруты.
// Экспортирует готовое приложение, но не запускает его слушать сеть.

import Fastify from "fastify";
import { env } from "./env";

export function buildApp() {
  // Инициализация
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

  // Эндпойнты
  app.get("/health", async () => ({ status: "ok" }));

  // Ловля ошибок
  // * 404
  app.setNotFoundHandler((request, reply) => {
    const { method, url } = request;

    reply.status(404).send({
      error: {
        code: "NOT_FOUND",
        message: `Route ${method} ${url} not found`,
      },
    });
  });

  // * исключения внутри обработчика маршрута
  app.setErrorHandler((error, request, reply) => {
    const statusCode =
      error instanceof Error && "statusCode" in error && typeof error.statusCode === "number"
        ? error.statusCode
        : undefined;

    if (statusCode && statusCode < 500) {
      return reply.status(statusCode).send({
        error: {
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Bad request",
        },
      });
    }

    request.log.error(error);

    reply.status(500).send({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      },
    });
  });

  return app;
}
