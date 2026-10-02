import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./password.js";

const password = "123456789";

describe("password test", () => {
  it("wrong password", async () => {
    const hash = await hashPassword("88888888");
    const result = await verifyPassword(hash, password);

    expect(result).toBe(false);
  });

  it("right password", async () => {
    const hash = await hashPassword(password);
    const result = await verifyPassword(hash, password);

    expect(result).toBe(true);
  });

  it("hash not equal origin password", async () => {
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
  });
});
