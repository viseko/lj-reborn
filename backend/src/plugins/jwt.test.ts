import { describe, it, expect } from "vitest";
import { buildApp } from "../app.js";

const userId = "user-id-123";

describe("jwt plugin", () => {
  it("signs and verifies an access token", async () => {
    const app = buildApp();
    await app.ready();

    const token = app.jwt.access.sign({
      sub: userId,
    });

    const decoded = app.jwt.access.verify<{ sub: string }>(token);

    expect(decoded.sub).toBe(userId);
  });

  it("rejects and access token verified with the refresh secret", async () => {
    const app = buildApp();
    await app.ready();

    const token = app.jwt.access.sign({
      sub: userId,
    });

    expect(() => app.jwt.refresh.verify(token)).toThrow();
  });
});
