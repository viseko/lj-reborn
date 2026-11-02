import { expect, test } from "../helpers/fixtures.js";

test("login form is empty after logout", async ({
  registeredUser,
  header,
  loginPage,
}) => {
  // Логинимся
  await loginPage.goto();
  await loginPage.login(registeredUser.login, registeredUser.password);

  // * проверяем, что вход удался
  await expect(header.user(registeredUser.login)).toBeVisible();

  // Логаутимся
  await header.logout();
  await expect(header.loginLink).toBeVisible();

  // Переходим на страницу входа и проверяем, что поля формы пустые
  await header.loginLink.click();
  await expect(loginPage.loginInput).toHaveValue("");
  await expect(loginPage.passwordInput).toHaveValue("");
});
