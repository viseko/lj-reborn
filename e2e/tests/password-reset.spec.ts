import { expect, test } from "../helpers/fixtures.js";
import { getResetLink } from "../helpers/mailpit.js";
import { waitForHydration } from "../helpers/waitForHydration.js";

test("user can reset password via email link", async ({
  page,
  registeredUser,
  request,
}) => {
  const newPassword = registeredUser.password + "!";

  await page.goto("/login");
  await waitForHydration(page);

  await page
    .getByRole("link", {
      name: "Забыли пароль?",
    })
    .click();

  await expect(page).toHaveURL("/forgot");

  await page.getByLabel("Логин или email").fill(registeredUser.email);
  await page
    .getByRole("button", {
      name: "Восстановить",
    })
    .click();

  await expect(
    page.getByText(
      "Если такой email зарегистрирован, на него отправлена ссылка для сброса пароля.",
    ),
  ).toBeVisible();

  const resetLink = await getResetLink(request, registeredUser.email);

  await page.goto(resetLink);
  await waitForHydration(page);

  await expect(page).toHaveURL(/\/reset-password\?token=/);
  await page
    .getByRole("textbox", { name: "Пароль", exact: true })
    .fill(newPassword);
  await page
    .getByRole("textbox", { name: "Повторите пароль" })
    .fill(newPassword);

  await page.getByRole("button", { name: "Готово" }).click();

  await expect(page).toHaveURL("/login");

  await page.getByRole("textbox", { name: "Логин" }).fill(registeredUser.login);
  await page
    .getByRole("textbox", { name: "Пароль", exact: true })
    .fill(newPassword);

  await page.getByRole("button", { name: "Войти" }).click();

  await expect(
    page.getByRole("banner").getByText(registeredUser.login),
  ).toBeVisible();
});
