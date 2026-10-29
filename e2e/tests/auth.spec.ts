import { expect, test } from "../helpers/fixtures.js";
import { createUser } from "../helpers/user.js";

test("user registration", async ({ page }) => {
  const user = createUser();
  await page.goto("/register");

  await page.getByLabel("Логин").fill(user.login);
  await page.getByLabel("Отображаемое имя").fill(user.username);
  await page.getByLabel("E-mail").fill(user.email);
  await page
    .getByLabel("Пароль", {
      exact: true,
    })
    .fill(user.password);
  await page.getByLabel("Повторите пароль").fill(user.password);

  await page
    .getByRole("main")
    .getByRole("button", { name: "Зарегистрироваться" })
    .click();

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("banner").getByText(user.login)).toBeVisible();
});

test("user login", async ({ page, registeredUser }) => {
  await page.goto("/login");

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

  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("banner").getByText(registeredUser.login),
  ).toBeVisible();
});

test("wrong password", async ({ page, registeredUser }) => {
  await page.goto("/login");

  await page.getByLabel("Логин").fill(registeredUser.login);
  await page
    .getByLabel("Пароль", { exact: true })
    .fill(registeredUser.password + "!");

  await page
    .getByRole("main")
    .getByRole("button", {
      name: "Войти",
    })
    .click();

  await expect(page.getByRole("main").getByRole("alert")).toHaveText(
    "Неверный логин или пароль",
  );

  await expect(page).toHaveURL("/login");
});

test("empty form", async ({ page }) => {
  await page.goto("/login");

  await page
    .getByRole("main")
    .getByRole("button", {
      name: "Войти",
    })
    .click();

  const login = page.getByLabel("Логин");
  const password = page.getByLabel("Пароль", { exact: true });

  // Поля помечены как невалидные
  await expect(login).toHaveAttribute("aria-invalid", "true");
  await expect(password).toHaveAttribute("aria-invalid", "true");
  // * и у них есть описания ошибки
  await expect(login).toHaveAccessibleDescription(/.+/);
  await expect(password).toHaveAccessibleDescription(/.+/);

  await expect(page).toHaveURL("/login");
});
