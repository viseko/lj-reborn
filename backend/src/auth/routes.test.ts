import { describe, it, expect, beforeEach } from "vitest";
import { buildApp } from "../app.js";
import { generateResetToken } from "./resetToken.js";

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
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
} as const;

function registerTestUser(app: ReturnType<typeof buildApp>) {
  return app.inject({
    method: "POST",
    url: endpoints.register,
    payload: userData,
  });
}

function loginTestUser(app: ReturnType<typeof buildApp>, password: string = userData.password) {
  return app.inject({
    method: "POST",
    url: endpoints.login,
    payload: {
      login: userData.login,
      password,
    },
  });
}

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
    const response = await registerTestUser(app);

    expect(response.statusCode).toBe(201);
    expect(response.json().user.login).toBe(userData.login);
    expect(response.cookies.some((c) => c.name === "access_token")).toBe(true);
    expect(response.cookies.some((c) => c.name === "refresh_token")).toBe(true);
  });

  it("rejects duplicate emaill on register", async () => {
    await registerTestUser(app);

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
    await registerTestUser(app);

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
    await registerTestUser(app);

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
    await registerTestUser(app);

    const loginRes = await loginTestUser(app);

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
    await registerTestUser(app);

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

describe("forgot password and reset password", () => {
  let app: ReturnType<typeof buildApp>;

  beforeEach(async () => {
    app = buildApp();
    await app.ready();
    await app.prisma.user.deleteMany({});
  });

  it("create a reset token when the identifier matches a user", async () => {
    await registerTestUser(app);

    const response = await app.inject({
      method: "POST",
      url: endpoints.forgotPassword,
      payload: {
        identifier: userData.login,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(await app.prisma.passwordResetToken.count()).toBe(1);
  });

  it("returns the same response and creates no token for an unknown identifier", async () => {
    const response = await app.inject({
      method: "POST",
      url: endpoints.forgotPassword,
      payload: {
        identifier: "nosuchidentifier",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(await app.prisma.passwordResetToken.count()).toBe(0);
  });

  it("resets the password and revokes existing sessions", async () => {
    await registerTestUser(app);
    const loginRes = await loginTestUser(app);

    expect(loginRes.statusCode).toBe(200);

    const user = await app.prisma.user.findUniqueOrThrow({
      where: {
        login: userData.login,
      },
    });

    const { rawToken, tokenHash } = generateResetToken();

    await app.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        tokenHash,
      },
    });

    const newPassword = "someNewPassword";

    const resetRes = await app.inject({
      method: "POST",
      url: endpoints.resetPassword,
      payload: {
        token: rawToken,
        newPassword,
      },
    });

    expect(resetRes.statusCode).toBe(200);

    const oldPasswordLogin = await loginTestUser(app);
    expect(oldPasswordLogin.statusCode).toBe(401);

    const newPasswordLogin = await loginTestUser(app, newPassword);
    expect(newPasswordLogin.statusCode).toBe(200);

    const sessionBeforeReset = await app.prisma.refreshToken.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    expect(sessionBeforeReset?.revokedAt).not.toBeNull();
  });

  it("rejects reuse of an already-used reset token", async () => {
    await registerTestUser(app);
    const user = await app.prisma.user.findUniqueOrThrow({
      where: {
        login: userData.login,
      },
    });

    const { rawToken, tokenHash } = generateResetToken();
    await app.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    await app.inject({
      method: "POST",
      url: endpoints.resetPassword,
      payload: {
        token: rawToken,
        newPassword: "newPassword_1",
      },
    });

    const secondAttempt = await app.inject({
      method: "POST",
      url: endpoints.resetPassword,
      payload: {
        token: rawToken,
        newPassword: "newPassword_2",
      },
    });

    expect(secondAttempt.statusCode).toBe(401);
  });
});
