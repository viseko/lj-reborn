import { expect, test as base } from "@playwright/test";

import { createForgotPage } from "../pages/forgotPage.js";
import { createHeader } from "../pages/header.js";
import { createLoginPage } from "../pages/loginPage.js";
import { createRegisterPage } from "../pages/registerPage.js";
import { createResetPasswordPage } from "../pages/resetPasswordPage.js";
import { createUser, registerViaAPI } from "./user.js";

type Fixtures = {
  loggedInUser: ReturnType<typeof createUser>;
  registeredUser: ReturnType<typeof createUser>;
  header: ReturnType<typeof createHeader>;
  loginPage: ReturnType<typeof createLoginPage>;
  registerPage: ReturnType<typeof createRegisterPage>;
  forgotPage: ReturnType<typeof createForgotPage>;
  resetPasswordPage: ReturnType<typeof createResetPasswordPage>;
};

export const test = base.extend<Fixtures>({
  loggedInUser: async ({ page }, use) => {
    const user = createUser();
    const response = await registerViaAPI(page.request, user);
    expect(response.ok()).toBeTruthy();

    await use(user);
  },
  // Вариант для сценария "пользователь существует, но браузер гость"
  registeredUser: async ({ request }, use) => {
    const user = createUser();
    const response = await registerViaAPI(request, user);
    expect(response.ok()).toBeTruthy();

    await use(user);
  },

  // Шапка страницы
  header: async ({ page }, use) => use(createHeader(page)),
  // Страницы авторизации
  loginPage: async ({ page }, use) => use(createLoginPage(page)),
  registerPage: async ({ page }, use) => use(createRegisterPage(page)),
  forgotPage: async ({ page }, use) => use(createForgotPage(page)),
  resetPasswordPage: async ({ page }, use) =>
    use(createResetPasswordPage(page)),
});

export { expect };
