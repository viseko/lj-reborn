// Cобирает приложение: создаёт инстанс Fastify, регистрирует плагины и маршруты.
// Экспортирует готовое приложение, но не запускает его слушать сеть.

import Fastify from "fastify";
import { env } from "./env.js";
import prismaPlugin from "./plugins/prisma.js";
import jwtPlugin from "./plugins/jwt.js";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { authRoutes } from "./auth/routes.js";

import { ZodError } from "zod";
import { Prisma } from "./generated/prisma/client.js";

export function buildApp() {
  // Инициализация
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport:
        env.NODE_ENV === "production"
          ? undefined
          : {
              target: "pino-pretty",
            },
    },
  });

  app.register(cors, {
    origin: env.NODE_ENV === "development" ? true : env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  });
  app.register(jwtPlugin);
  app.register(prismaPlugin);
  app.register(cookie);
  app.register(authRoutes, {
    prefix: "/auth",
  });

  // Эндпойнты
  app.get("/health", async () => ({ status: "ok" }));

  app.get("/users/count", async (request) => {
    const count = await request.server.prisma.user.count();

    return { count };
  });

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
    //  * ловим ошибки валидации
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      });
    }

    // * ловим ошибки записи в БД
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return reply.status(409).send({
        error: {
          code: "CONFLICT",
          message: "Login or email already exists",
        },
      });
    }

    // * ловим общие ошибки
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
