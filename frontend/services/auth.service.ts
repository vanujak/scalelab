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

type AuthResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
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
};
