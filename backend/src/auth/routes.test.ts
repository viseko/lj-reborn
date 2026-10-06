import { describe, it, expect, beforeEach } from "vitest";
import { buildApp } from "../app.js";

const userData = {
  email: "register@test.com",
  login: "registeruser",
  username: "RegisterUser",
  password: "password123",
} as const;

const endpoints = {
  register: "/auth/register",
  login: "/auth/login",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
} as const;

describe("auth routes", () => {
  let app: ReturnType<typeof buildApp>;

  // Очищаем все строки User перед тестами
  // * beforeEach вместо beforeAll - чтобы тесты не зависели от порядка выполнения
  beforeEach(async () => {
    app = buildApp();
    await app.ready();
    await app.prisma.user.deleteMany({});
  });

  it("registers a new user and sets both cookies", async () => {
    const response = await app.inject({
      method: "POST",
      url: endpoints.register,
      payload: userData,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json().user.login).toBe(userData.login);
    expect(response.cookies.some((c) => c.name === "access_token")).toBe(true);
    expect(response.cookies.some((c) => c.name === "refresh_token")).toBe(true);
  });

  it("rejects duplicate emaill on register", async () => {
    await app.inject({
      method: "POST",
      url: endpoints.register,
      payload: userData,
    });

    const secondResponse = await app.inject({
      method: "POST",
      url: endpoints.register,
      payload: {
        ...userData,
        login: "anotherlogin",
      },
    });

    expect(secondResponse.statusCode).toBe(409);
  });

  it("login in with correct creentials", async () => {
    await app.inject({
      method: "POST",
      url: endpoints.register,
      payload: userData,
    });

    const response = await app.inject({
      method: "POST",
      url: endpoints.login,
      payload: {
        login: userData.login,
        password: userData.password,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().user.login).toBe(userData.login);
  });

  it("rejects login with wrong password", async () => {
    await app.inject({
      method: "POST",
      url: endpoints.register,
      payload: userData,
    });

    const response = await app.inject({
      method: "POST",
      url: endpoints.login,
      payload: {
        login: userData.login,
        password: "wrongpassword",
      },
    });

    expect(response.statusCode).toBe(401);
  });

  it("rotates tokens in refresh and detects reuse of the old one", async () => {
    await app.inject({
      method: "POST",
      url: endpoints.register,
      payload: userData,
    });

    const loginRes = await app.inject({
      method: "POST",
      url: endpoints.login,
      payload: {
        login: userData.login,
        password: userData.password,
      },
    });

    const oldRefresh = loginRes.cookies.find((c) => c.name === "refresh_token")!.value;

    const refreshRes = await app.inject({
      method: "POST",
      url: endpoints.refresh,
      cookies: {
        refresh_token: oldRefresh,
      },
    });
    expect(refreshRes.statusCode).toBe(200);

    const newRefresh = refreshRes.cookies.find((c) => c.name === "refresh_token")!.value;

    expect(newRefresh).not.toBe(oldRefresh);

    const reuseRes = await app.inject({
      method: "POST",
      url: endpoints.refresh,
      cookies: {
        refresh_token: oldRefresh,
      },
    });
    expect(reuseRes.statusCode).toBe(401);

    const afrterReuseRes = await app.inject({
      method: "POST",
      url: endpoints.refresh,
      cookies: {
        refresh_token: newRefresh,
      },
    });
    expect(afrterReuseRes.statusCode).toBe(401);
  });

  it("logs out and clears both cookies", async () => {
    await app.inject({
      method: "POST",
      url: endpoints.register,
      payload: userData,
    });

    const logingRes = await app.inject({
      method: "POST",
      url: endpoints.login,
      payload: {
        login: userData.login,
        password: userData.password,
      },
    });

    const refreshCookie = logingRes.cookies.find((c) => c.name === "refresh_token")!.value;

    const logoutRes = await app.inject({
      method: "POST",
      url: endpoints.logout,
      cookies: {
        refresh_token: refreshCookie,
      },
    });

    expect(logoutRes.statusCode).toBe(200);
    expect(logoutRes.cookies.find((c) => c.name === "access_token")?.maxAge).toBe(0);
    expect(logoutRes.cookies.find((c) => c.name === "refresh_token")?.maxAge).toBe(0);
  });
});
