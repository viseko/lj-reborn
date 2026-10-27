import { expect, type Page } from "@playwright/test";

export const waitForHydration = (page: Page) => {
  return expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
};
