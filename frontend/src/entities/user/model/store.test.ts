import { beforeEach, describe, it, expect, vi } from "vitest";
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

  it("sets unauthenticated when fetchMe fails", async () => {
    mockFetchOnce({ error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, 401);

    await useUserStore.getState().fetchMe();
    expect(useUserStore.getState().user).toBeNull();
    expect(useUserStore.getState().status).toBe("unauthenticated");
  });
});
