export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function apiGet<T>(path: string): Promise<T> {
  return apiJson<T>(path, { method: "GET", cache: "no-store" });
}

export async function apiJson<T>(path: string, init: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
      cache: init.cache ?? "no-store",
    });
  } catch {
    throw new Error(
      `Unable to reach the API at ${API_BASE_URL}. Start the backend server or update NEXT_PUBLIC_API_BASE_URL.`,
    );
  }

  const data = (await response.json().catch(() => null)) as
    | { message?: string | string[] }
    | null;
  const message =
    Array.isArray(data?.message) ? data.message.join(", ") : data?.message;

  if (!response.ok) {
    throw new Error(message ?? `API request failed: ${response.status}`);
  }

  return data as T;
}
