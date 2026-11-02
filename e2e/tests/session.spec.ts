import { ACCESS_TOKEN_TTL_SECONDS, FRONTEND_URL } from "../helpers/env.js";
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

test("logged-in user is redirected from /login to home", async ({
  page,
  loggedInUser,
}) => {
  const response = await page.goto("/login");
  const request = response!.request();

  await expect(page).toHaveURL("/");

  expect(request.redirectedFrom()?.url()).toBe(`${FRONTEND_URL}/login`);
  await expect(
    page.getByRole("banner").getByText(loggedInUser.login),
  ).toBeVisible();
});

test("server HTML contains logged-in header", async ({
  page,
  loggedInUser,
}) => {
  const response = await page.request.get("/");
  const text = await response.text();

  expect(response.ok()).toBeTruthy();
  expect(text).toContain(`>${loggedInUser.login}<`);
  expect(text).not.toContain('href="/login"');
});

test("expired access token is refreshed silently", async ({
  page,
  loggedInUser,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("banner").getByText(loggedInUser.login),
  ).toBeVisible();

  // Ждём дольше срока жизни access-токена
  const delay = (ACCESS_TOKEN_TTL_SECONDS + 1) * 1000;
  await page.waitForTimeout(delay);

  // Слушаем и коллекционируем запросы на обновление токена
  const refreshRequests: string[] = [];
  page.on("request", (req) => {
    if (req.url().endsWith("/auth/refresh")) {
      refreshRequests.push(req.url());
    }
  });

  // Ждём ответа /auth/refresh
  const refreshDone = page.waitForResponse((res) =>
    res.url().endsWith("/auth/refresh"),
  );
  await page.reload();
  const refreshRes = await refreshDone;

  // Проверка запросов
  expect(refreshRequests).toHaveLength(1);
  expect(refreshRes.ok()).toBeTruthy();

  await expect(
    page.getByRole("banner").getByText(loggedInUser.login),
  ).toBeVisible();
});
