import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "./schemas.js";

const validUserData = {
  email: "test@example.com",
  login: "tester",
  username: "Test User",
  password: "123456789",
};

describe("register test", () => {
  it("short login", () => {
    const result = registerSchema.safeParse({
      ...validUserData,
      login: "ab",
    });

    expect(result.success).toBe(false);
  });

  it("bad email", () => {
    const result = registerSchema.safeParse({
      ...validUserData,
      email: "@bademail.com",
    });

    expect(result.success).toBe(false);
  });

  it("short password", () => {
    const result = registerSchema.safeParse({
      ...validUserData,
      password: "12",
    });

    expect(result.success).toBe(false);
  });

  it("valid data", () => {
    const result = registerSchema.safeParse(validUserData);
    expect(result.success).toBe(true);
  });
});

describe("login test", () => {
  it("bad login", () => {
    const result = loginSchema.safeParse({
      login: "7",
      password: validUserData.password,
    });

    expect(result.success).toBe(false);
  });

  it("bad password", () => {
    const result = loginSchema.safeParse({
      login: validUserData.login,
      password: ":)",
    });

    expect(result.success).toBe(false);
  });

  it("valid login", () => {
    const result = loginSchema.safeParse({
      login: validUserData.login,
      password: validUserData.password,
    });

    expect(result.success).toBe(true);
  });
});
