import { describe, it, expect, beforeEach } from "vitest";
import { buildApp } from "../app.js";
import { cleanupExpiredTokens } from "./cleanup.js";

describe("cleanupExpiredTokens", () => {
  let app: ReturnType<typeof buildApp>;

  beforeEach(async () => {
    app = buildApp();
    await app.ready();
    await app.prisma.user.deleteMany({});
  });

  it("deletes long-revoked tokens but keeps recently revoked ones", async () => {
    const user = await app.prisma.user.create({
      data: {
        email: "cleanup@test.com",
        login: "cleanupuser",
        username: "CleanupUser",
        passwordHash: "irrelevant",
      },
    });

    const old = await app.prisma.refreshToken.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() - 1000),
        revokedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    });

    const fresh = await app.prisma.refreshToken.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() - 1000),
        revokedAt: new Date(),
      },
    });

    const result = await cleanupExpiredTokens(app);
    expect(result.refreshDeleted).toBe(1);

    expect(await app.prisma.refreshToken.findUnique({ where: { id: old.id } })).toBeNull();
    expect(await app.prisma.refreshToken.findUnique({ where: { id: fresh.id } })).not.toBeNull();
  });
});
