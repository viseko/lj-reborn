import { expect, test } from "../helpers/fixtures.js";
import { getResetLink } from "../helpers/mailpit.js";
import { waitForHydration } from "../helpers/waitForHydration.js";

test("user can reset password via email link", async ({
  page,
  registeredUser,
  request,
  header,
  loginPage,
  forgotPage,
  resetPasswordPage,
}) => {
  const newPassword = registeredUser.password + "!";

  await loginPage.goto();
  await loginPage.forgotLink.click();

  await expect(page).toHaveURL("/forgot");
  await forgotPage.submit(registeredUser.email);
  await expect(forgotPage.sentMessage).toBeVisible();

  const resetLink = await getResetLink(request, registeredUser.email);
  await page.goto(resetLink);
  await waitForHydration(page);

  await expect(page).toHaveURL(/\/reset-password\?token=/);
  await resetPasswordPage.submit(newPassword);

  await expect(page).toHaveURL("/login");
  await loginPage.login(registeredUser.login, newPassword);

  await expect(header.user(registeredUser.login)).toBeVisible();
});
