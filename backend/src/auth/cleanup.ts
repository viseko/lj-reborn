import type { FastifyInstance } from "fastify";
import { CLEANUP_GRACE_PERIOD_DAYS } from "./constants.js";

export async function cleanupExpiredTokens(app: FastifyInstance) {
  const cutoff = new Date(Date.now() - CLEANUP_GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);

  const [refreshResult, resetResult] = await Promise.all([
    app.prisma.refreshToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: cutoff } }, { revokedAt: { lt: cutoff } }],
      },
    }),
    app.prisma.passwordResetToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: cutoff } }, { usedAt: { lt: cutoff } }],
      },
    }),
  ]);

  return {
    refreshDeleted: refreshResult.count,
    resetDeleted: resetResult.count,
  };
}
