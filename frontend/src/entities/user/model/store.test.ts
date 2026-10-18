import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUserStore } from "./store";

function mockFetchOnce(body: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status < 400,
      status,
      json: () => Promise.resolve(body),
    }),
  );
}

describe("useUserStore", () => {
  beforeEach(() => {
    useUserStore.setState({ user: null, status: "idle" });
  });

  it("sets user and status on successful login", async () => {
    mockFetchOnce({ user: { login: "tester", username: "Tester" } });

    await useUserStore.getState().login("tester", "password123");

    expect(useUserStore.getState().user?.login).toBe("tester");
    expect(useUserStore.getState().status).toBe("authenticated");
  });

  it("initSession returns authenticated status if user exist", async () => {
    useUserStore.getState().initSession({ login: "tester", id: "user-1" });
    const user = useUserStore.getState().user;
    const status = useUserStore.getState().status;

    expect(user?.login).toBe("tester");
    expect(status).toBe("authenticated");
  });

  it("initSession returns unauthenticated status if user not exist", async () => {
    useUserStore.getState().initSession(null);
    const user = useUserStore.getState().user;
    const status = useUserStore.getState().status;

    expect(user).toBeNull();
    expect(status).toBe("unauthenticated");
  });
});
