import { randomBytes, createHash } from "node:crypto";

export function generateResetToken() {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(rawToken);

  return { rawToken, tokenHash };
}

// Отдельно, т.к. понадобится для проверки токена от юзера
export function hashResetToken(rawToken: string) {
  return createHash("sha256").update(rawToken).digest("hex");
}
