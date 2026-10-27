import { expect, test as base } from "@playwright/test";

import { createUser, registerViaAPI } from "./user.js";

type Fixtures = {
  loggedInUser: ReturnType<typeof createUser>;
};

export const test = base.extend<Fixtures>({
  loggedInUser: async ({ page }, use) => {
    // Перед тестом создаём и логиним юзера
    const user = createUser();
    const response = await registerViaAPI(page.request, user);
    expect(response.ok()).toBeTruthy();

    // Передаём юзера тесту. Тест выполняется внутри вызова
    await use(user);

    // После теста: здесь "уборка" не нужна - контекст вкладки закроется сам
  },
});

export { expect };
