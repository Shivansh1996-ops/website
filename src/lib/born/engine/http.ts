/** Prefer Vite proxy in dev; fall back to public endpoints in production. */
export async function fetchJson<T>(paths: string[], init?: RequestInit): Promise<T> {
  let lastError: unknown;
  for (const path of paths) {
    try {
      const res = await fetch(path, init);
      if (!res.ok) {
        lastError = new Error(`${path} → ${res.status}`);
        continue;
      }
      return (await res.json()) as T;
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("All fetch endpoints failed");
}
