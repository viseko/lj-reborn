import type { Page } from "@playwright/test";

import type { createUser } from "../helpers/user.js";
import { waitForHydration } from "../helpers/waitForHydration.js";

export function createRegisterPage(page: Page) {
  const main = page.getByRole("main");

  const loginInput = main.getByRole("textbox", { name: "Логин", exact: true });
  const usernameInput = main.getByRole("textbox", {
    name: "Отображаемое имя",
    exact: true,
  });
  const emailInput = main.getByRole("textbox", {
    name: "E-mail",
    exact: true,
  });
  const passwordInput = main.getByRole("textbox", {
    name: "Пароль",
    exact: true,
  });
  const passwordRepeatInput = main.getByRole("textbox", {
    name: "Повторите пароль",
    exact: true,
  });
  const submitButton = main.getByRole("button", {
    name: "Зарегистрироваться",
  });
  const error = main.getByRole("alert");

  return {
    main,
    loginInput,
    usernameInput,
    emailInput,
    passwordInput,
    passwordRepeatInput,
    submitButton,
    error,
    goto: async () => {
      await page.goto("/register");
      await waitForHydration(page);
    },
    register: async (user: ReturnType<typeof createUser>) => {
      await loginInput.fill(user.login);
      await usernameInput.fill(user.username);
      await emailInput.fill(user.email);
      await passwordInput.fill(user.password);
      await passwordRepeatInput.fill(user.password);
      await submitButton.click();
    },
  };
}
