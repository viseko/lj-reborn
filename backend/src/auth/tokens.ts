import type { FastifyInstance, FastifyReply } from "fastify";
import { env } from "../env.js";
import { ACCESS_TOKEN_TTL_MINUTES, REFRESH_TOKEN_TTL_DAYS } from "./constants.js";

export async function issueTokenPair(app: FastifyInstance, userId: string) {
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  const refreshTokenRecord = await app.prisma.refreshToken.create({
    data: {
      userId,
      expiresAt,
    },
  });

  const accessToken = app.jwt.access.sign({
    sub: userId,
  });

  const refreshToken = app.jwt.refresh.sign({
    sub: userId,
    jti: refreshTokenRecord.id,
  });

  return {
    accessToken,
    refreshToken,
    refreshTokenExpiresAt: expiresAt,
  };
}

export function setAuthCookies(reply: FastifyReply, accessToken: string, refreshToken: string) {
  return reply
    .setCookie("access_token", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_TOKEN_TTL_MINUTES * 60,
    })
    .setCookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/auth",
      maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60,
    });
}

export function clearAuthCookies(reply: FastifyReply) {
  return reply
    .clearCookie("access_token", {
      path: "/",
    })
    .clearCookie("refresh_token", {
      path: "/auth",
    });
}

export function unauthorized(reply: FastifyReply, message = "Invalid or expired refresh token") {
  return reply.status(401).send({
    error: {
      code: "UNAUTHORIZED",
      message,
    },
  });
}
