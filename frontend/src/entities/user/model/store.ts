import { apiFetch } from "@/shared/api/clients";
import { create } from "zustand";

type User = {
  id: string;
  login: string;
  username: string;
};

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

type UserStore = {
  user: User | null;
  status: AuthStatus;
  fetchMe: () => Promise<void>;
  login: (login: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    login: string;
    username: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  status: "idle",
  fetchMe: async () => {
    set({ status: "loading" });
    try {
      const { user } = await apiFetch<{ user: User }>("/auth/me");
      set({ user, status: "authenticated" });
    } catch {
      set({ user: null, status: "unauthenticated" });
    }
  },

  login: async (login, password) => {
    const { user } = await apiFetch<{ user: User }>("/auth/login", {
      method: "POST",
      body: {
        login,
        password,
      },
    });
    set({ user, status: "authenticated" });
  },

  register: async (data) => {
    const { user } = await apiFetch<{ user: User }>("/auth/register", {
      method: "POST",
      body: data,
    });

    set({
      user,
      status: "authenticated",
    });
  },

  logout: async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    set({ user: null, status: "unauthenticated" });
  },
}));
