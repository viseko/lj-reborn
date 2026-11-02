import { type Page } from "@playwright/test";

export function createForgotPage(page: Page) {
  const main = page.getByRole("main");
  const input = main.getByRole("textbox", { name: "Логин или email" });
  const submitButton = main.getByRole("button", {
    name: "Восстановить",
  });
  const sentMessage = main.getByText(
    "Если такой email зарегистрирован, на него отправлена ссылка для сброса пароля.",
  );

  return {
    main,
    input,
    sentMessage,
    submit: async (loginOrEmail: string) => {
      await input.fill(loginOrEmail);
      await submitButton.click();
    },
  };
}
