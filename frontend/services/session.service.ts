import type { AuthUser } from "@/services/auth.service";

const AUTH_STORAGE_KEY = "scalelab.auth-user";

function hasStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export const sessionService = {
  getUser(): AuthUser | null {
    if (!hasStorage()) {
      return null;
    }

    const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  },
  setUser(user: AuthUser) {
    if (!hasStorage()) {
      return;
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  },
  clearUser() {
    if (!hasStorage()) {
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};
