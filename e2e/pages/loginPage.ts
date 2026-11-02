import { expect, type Page } from "@playwright/test";

import { waitForHydration } from "../helpers/waitForHydration.js";

export function createLoginPage(page: Page) {
  const main = page.getByRole("main");
  const loginInput = main.getByRole("textbox", { name: "Логин", exact: true });
  const passwordInput = main.getByRole("textbox", {
    name: "Пароль",
    exact: true,
  });
  const submitButton = main.getByRole("button", {
    name: "Войти",
  });
  const forgotLink = main.getByRole("link", {
    name: "Забыли пароль?",
  });
  const error = main.getByRole("alert");

  return {
    main,
    loginInput,
    passwordInput,
    submitButton,
    forgotLink,
    error,
    goto: async () => {
      await page.goto("/login");
      await waitForHydration(page);
    },
    login: async (login: string, password: string) => {
      await loginInput.fill(login);
      await passwordInput.fill(password);
      await submitButton.click();
    },
    expectInputErrors: async () => {
      // Поля помечены как невалидные
      await expect(loginInput).toHaveAttribute("aria-invalid", "true");
      await expect(passwordInput).toHaveAttribute("aria-invalid", "true");
      // * и у них есть описания ошибки
      await expect(loginInput).toHaveAccessibleDescription(/.+/);
      await expect(passwordInput).toHaveAccessibleDescription(/.+/);
    },
  };
}
