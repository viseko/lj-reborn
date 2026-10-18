import { apiFetch } from "@/shared/api/clients";
import { create } from "zustand";

export type User = {
  id: string;
  login: string;
};

type AuthStatus = "idle" | "authenticated" | "unauthenticated";

type UserStore = {
  user: User | null;
  status: AuthStatus;
  login: (login: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    login: string;
    username: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  initSession: (user: User | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  status: "idle",

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

  initSession: (user) => {
    set({ user, status: user ? "authenticated" : "unauthenticated" });
  },
}));
