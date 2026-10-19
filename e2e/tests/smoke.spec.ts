import { expect, test } from "@playwright/test";

test("home page shows login link", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", {
      name: "Войти",
    }),
  ).toBeVisible();
});
