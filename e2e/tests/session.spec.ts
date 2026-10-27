import { expect, test } from "../helpers/fixtures.js";
import { waitForHydration } from "../helpers/waitForHydration.js";

test("reload keeps user logged in", async ({ page, loggedInUser }) => {
  await page.goto("/");

  await expect(
    page.getByRole("banner").getByText(loggedInUser.login),
  ).toBeVisible();

  await page.reload();

  await expect(
    page.getByRole("banner").getByText(loggedInUser.login),
  ).toBeVisible();
});

test("logout switches the app to guest mode", async ({
  page,
  loggedInUser,
}) => {
  await page.goto("/");
  await waitForHydration(page);
  await page.getByRole("banner").getByRole("button", { name: "Выйти" }).click();

  const checkHeaderStatus = async () => {
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Войти" }),
    ).toBeVisible();

    await expect(
      page.getByRole("banner").getByRole("button", { name: "Выйти" }),
    ).not.toBeVisible();

    await expect(
      page.getByRole("banner").getByText(loggedInUser.login),
    ).not.toBeVisible();
  };

  await checkHeaderStatus();

  await page.reload();

  await checkHeaderStatus();
});
