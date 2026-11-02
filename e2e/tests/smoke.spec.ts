import { expect, test } from "../helpers/fixtures.js";

test("home page shows login link", async ({ page, header }) => {
  await page.goto("/");
  await expect(header.loginLink).toBeVisible();
});
