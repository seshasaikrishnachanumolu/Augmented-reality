import { create } from "zustand";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  hasChecked: boolean;

  checkSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
}

async function parseJsonSafe(response: Response): Promise<Record<string, unknown>> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  hasChecked: false,

  checkSession: async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await parseJsonSafe(response);
      set({ user: (data.user as AuthUser | null) ?? null, hasChecked: true });
    } catch {
      set({ user: null, hasChecked: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await parseJsonSafe(response);
      if (!response.ok) {
        return { ok: false, error: (data.error as string) ?? "Something went wrong." };
      }
      set({ user: data.user as AuthUser });
      return { ok: true };
    } catch {
      return { ok: false, error: "Couldn't reach the server. Please try again." };
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await parseJsonSafe(response);
      if (!response.ok) {
        return { ok: false, error: (data.error as string) ?? "Something went wrong." };
      }
      set({ user: data.user as AuthUser });
      return { ok: true };
    } catch {
      return { ok: false, error: "Couldn't reach the server. Please try again." };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      set({ user: null });
    }
  },
}));
