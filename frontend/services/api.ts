export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function apiGet<T>(path: string): Promise<T> {
  return apiJson<T>(path, { method: "GET", cache: "no-store" });
}

export async function apiJson<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: init.cache ?? "no-store",
  });

  const data = (await response.json().catch(() => null)) as { message?: string } | null;

  if (!response.ok) {
    throw new Error(data?.message ?? `API request failed: ${response.status}`);
  }

  return data as T;
}
