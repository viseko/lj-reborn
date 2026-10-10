import { describe, it, expect } from "vitest";
import { generateResetToken, hashResetToken } from "./resetToken.js";

describe("reset token", () => {
  it("gerenates a raw token whose hash matches hashResetToken", () => {
    const { rawToken, tokenHash } = generateResetToken();

    expect(hashResetToken(rawToken)).toBe(tokenHash);
  });

  it("generates different tokens on each call", () => {
    const first = generateResetToken();
    const second = generateResetToken();

    expect(first.rawToken).not.toBe(second.rawToken);
  });

  it("hashes the same input deterministically", () => {
    expect(hashResetToken("same-input")).toBe(hashResetToken("same-input"));
  });
});
