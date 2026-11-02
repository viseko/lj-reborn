import { expect, test } from "../helpers/fixtures.js";
import { createUser } from "../helpers/user.js";

test("user registration", async ({ page, registerPage, header }) => {
  const user = createUser();
  await registerPage.goto();
  await registerPage.register(user);

  await expect(page).toHaveURL("/");
  await expect(header.user(user.login)).toBeVisible();
});

test("user login", async ({ page, registeredUser, loginPage, header }) => {
  await loginPage.goto();
  await loginPage.login(registeredUser.login, registeredUser.password);

  await expect(page).toHaveURL("/");
  await expect(header.user(registeredUser.login)).toBeVisible();
});

test("wrong password", async ({ page, registeredUser, loginPage }) => {
  const wrongPassword = registeredUser.password + "!";

  await loginPage.goto();
  await loginPage.login(registeredUser.login, wrongPassword);

  await expect(loginPage.error).toHaveText("Неверный логин или пароль");
  await expect(page).toHaveURL("/login");
});

test("empty form", async ({ page, loginPage }) => {
  await loginPage.goto();
  await loginPage.login("", "");

  await loginPage.expectInputErrors();
  await expect(page).toHaveURL("/login");
});
