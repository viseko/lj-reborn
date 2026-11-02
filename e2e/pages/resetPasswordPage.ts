import type { Page } from "@playwright/test";

export function createResetPasswordPage(page: Page) {
  const main = page.getByRole("main");
  const passwordInput = main.getByRole("textbox", {
    name: "Пароль",
    exact: true,
  });
  const repeatPasswordInput = main.getByRole("textbox", {
    name: "Повторите пароль",
  });
  const submitButton = main.getByRole("button", { name: "Готово" });

  return {
    main,
    passwordInput,
    repeatPasswordInput,
    submit: async (newPassword: string) => {
      await passwordInput.fill(newPassword);
      await repeatPasswordInput.fill(newPassword);
      await submitButton.click();
    },
  };
}
