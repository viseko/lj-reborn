import { expect, test } from "../helpers/fixtures.js";
import { waitForHydration } from "../helpers/waitForHydration.js";

test("login form is empty after logout", async ({ page, registeredUser }) => {
  // Логинимся
  await page.goto("/login");
  await waitForHydration(page);
  await page.getByLabel("Логин").fill(registeredUser.login);
  await page
    .getByLabel("Пароль", { exact: true })
    .fill(registeredUser.password);
  await page
    .getByRole("main")
    .getByRole("button", {
      name: "Войти",
    })
    .click();

  // * проверяем, что вход удался
  await expect(
    page.getByRole("banner").getByText(registeredUser.login),
  ).toBeVisible();

  // Логаутимся
  const btnLogin = page.getByRole("banner").getByRole("link", {
    name: "Войти",
  });

  await page.getByRole("banner").getByRole("button", { name: "Выйти" }).click();
  await expect(btnLogin).toBeVisible();

  // Переходим на страницу входа и проверяем, что поля формы пустые
  await btnLogin.click();
  await expect(page.getByLabel("Логин")).toHaveValue("");
  await expect(page.getByLabel("Пароль", { exact: true })).toHaveValue("");
});
