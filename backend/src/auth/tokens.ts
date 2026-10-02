import type { FastifyInstance } from "fastify";
import { REFRESH_TOKEN_TTL_DAYS } from "./constants.js";

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
