import type { FastifyInstance } from "fastify";
import { forgotPasswordSchema, loginSchema, registerSchema } from "./schemas.js";
import { clearAuthCookies, issueTokenPair, setAuthCookies, unauthorized } from "./tokens.js";
import { DUMMY_PASSWORD_HASH, hashPassword, verifyPassword } from "./password.js";
import { generateReserToken } from "./resetToken.js";
import { PASSWORD_RESET_TOKEN_TTL_MINUTES } from "./constants.js";
import { env } from "../env.js";
import { sendPasswordResetEmail } from "./email.js";

interface TokenPayload {
  sub: string;
  jti?: string;
}

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const passwordHash = await hashPassword(body.password);

    const user = await app.prisma.user.create({
      data: {
        email: body.email,
        login: body.login,
        username: body.username,
        passwordHash,
      },
    });

    const { accessToken, refreshToken } = await issueTokenPair(app, user.id);

    setAuthCookies(reply, accessToken, refreshToken)
      .status(201)
      .send({
        user: {
          id: user.id,
          login: user.login,
          username: user.username,
        },
      });
  });

  app.post("/login", async (request, reply) => {
    const body = loginSchema.parse(request.body);

    const user = await app.prisma.user.findUnique({
      where: {
        login: body.login,
      },
    });

    const passwordHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
    const isValid = await verifyPassword(passwordHash, body.password);

    if (!user || !isValid) {
      return reply.status(401).send({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid login or password",
        },
      });
    }

    const { accessToken, refreshToken } = await issueTokenPair(app, user.id);

    setAuthCookies(reply, accessToken, refreshToken)
      .status(200)
      .send({
        user: {
          id: user.id,
          login: user.login,
          username: user.username,
        },
      });
  });

  app.post("/refresh", async (request, reply) => {
    // 1. Достаём refresh-токен из куков
    const token = request.cookies["refresh_token"];

    if (!token) {
      return unauthorized(reply);
    }

    // 2. Проверяем подпись и срок JWT
    let payload: TokenPayload;

    try {
      payload = app.jwt.refresh.verify<TokenPayload>(token);
    } catch {
      return unauthorized(reply);
    }

    // 3. Ищем запись в базе по jti
    const tokenRecord = payload.jti
      ? await app.prisma.refreshToken.findUnique({
          where: {
            id: payload.jti,
          },
        })
      : null;

    // 4. Разбираем два плохих исхода
    // - "уже отозван" - признак кражи, отзываем все сессии юзера
    if (tokenRecord?.revokedAt) {
      await app.prisma.refreshToken.updateMany({
        where: {
          userId: tokenRecord.userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      return unauthorized(reply);
    }

    // - нет записи или истекло - отказ, без массового отзыва
    if (!tokenRecord || tokenRecord?.expiresAt < new Date()) {
      return unauthorized(reply);
    }

    // 5. Всё ок, отзываем старую запись, выдаём новую пару
    // * доп проверка на одновременный запрос
    try {
      await app.prisma.refreshToken.update({
        where: {
          id: tokenRecord.id,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    } catch {
      return unauthorized(reply, "Refresh token already used");
    }

    const { accessToken, refreshToken } = await issueTokenPair(app, tokenRecord.userId);

    setAuthCookies(reply, accessToken, refreshToken).status(200).send({
      success: true,
    });
  });

  app.post("/logout", async (request, reply) => {
    const token = request.cookies["refresh_token"];

    if (token) {
      try {
        const payload = app.jwt.refresh.verify<TokenPayload>(token);

        if (payload.jti) {
          await app.prisma.refreshToken.update({
            where: {
              id: payload.jti,
              revokedAt: null,
            },
            data: {
              revokedAt: new Date(),
            },
          });
        }
      } catch {
        // токен невалиден, просрочен или отозван - не беда
      }
    }

    return clearAuthCookies(reply).status(200).send({
      success: true,
    });
  });

  app.post("/forgot-password", async (request, reply) => {
    const body = forgotPasswordSchema.parse(request.body);

    const user = await app.prisma.user.findFirst({
      where: {
        OR: [
          { email: body.identifier },
          {
            login: body.identifier,
          },
        ],
      },
    });

    if (user) {
      const { rawToken, tokenHash } = generateReserToken();
      const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MINUTES * 60 * 1000);

      await app.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });

      const resetLink = `${env.CORS_ORIGIN}/reset-password?token=${rawToken}`;

      await sendPasswordResetEmail(request.log, user.email, resetLink);
    }

    return reply.status(200).send({
      message: "If an account with that email or login exists, a reset link has been sent.",
    });
  });
}
