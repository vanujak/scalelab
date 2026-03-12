import { apiJson } from "@/services/api";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  user: AuthUser;
  message: string;
};

export const authService = {
  register(payload: RegisterPayload) {
    return apiJson<AuthResponse>("/users/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  login(payload: LoginPayload) {
    return apiJson<AuthResponse>("/users/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  googleLogin() {
    return apiJson<AuthResponse>("/users/google", {
      method: "POST",
    });
  },
};
