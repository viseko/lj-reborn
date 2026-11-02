import { expect, type Page } from "@playwright/test";

export function createHeader(page: Page) {
  const header = page.getByRole("banner");
  const loginLink = header.getByRole("link", { name: "Войти" });
  const logoutButton = header.getByRole("button", { name: "Выйти" });
  const user = (login: string) => header.getByText(login);

  return {
    header,
    loginLink,
    logoutButton,
    user,
    logout: () => logoutButton.click(),
    expectGuestHeader: async (login: string) => {
      await expect(loginLink).toBeVisible();
      await expect(logoutButton).not.toBeVisible();
      await expect(user(login)).not.toBeVisible();
    },
  };
}
