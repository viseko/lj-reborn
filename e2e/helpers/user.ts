import { type APIRequestContext } from "@playwright/test";

import { BACKEND_URL } from "./env.js";

export const TEST_PASSWORD = "12345678";

export function createUser() {
  const suffix = Date.now().toString(32);
  const id = crypto.randomUUID().slice(0, 8);
  const unique = suffix + id;

  return {
    login: `u-${unique}`,
    password: TEST_PASSWORD,
    email: `test-${unique}@test.ru`,
    username: "test user",
  };
}

export function registerViaAPI(
  request: APIRequestContext,
  user: ReturnType<typeof createUser>,
) {
  return request.post(`${BACKEND_URL}/auth/register`, {
    data: user,
  });
}
