import type { FastifyBaseLogger } from "fastify";

export async function sendPasswordResetEmail(
  logger: FastifyBaseLogger,
  to: string,
  resetLink: string,
) {
  logger.info(
    {
      to,
      resetLink,
    },
    "Password reset email (dev mode, not actually sent)",
  );
}
