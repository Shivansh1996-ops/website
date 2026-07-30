/** Lightweight in-memory + localStorage cache for API responses */
const memory = new Map<string, { at: number; data: unknown }>();
const TTL_MS = 1000 * 60 * 60; // 1 hour

export function cacheGet<T>(key: string): T | null {
  const hit = memory.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data as T;
  try {
    const raw = localStorage.getItem(`born_cache:${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { at: number; data: T };
    if (Date.now() - parsed.at < TTL_MS) {
      memory.set(key, parsed);
      return parsed.data;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function cacheSet<T>(key: string, data: T) {
  const entry = { at: Date.now(), data };
  memory.set(key, entry);
  try {
    localStorage.setItem(`born_cache:${key}`, JSON.stringify(entry));
  } catch {
    /* quota */
  }
}
