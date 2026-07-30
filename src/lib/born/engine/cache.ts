const memory = new Map<string, { at: number; value: unknown }>();
const TTL_MS = 1000 * 60 * 30;

export function cacheGet<T>(key: string): T | undefined {
  const hit = memory.get(key);
  if (!hit) return undefined;
  if (Date.now() - hit.at > TTL_MS) {
    memory.delete(key);
    return undefined;
  }
  return hit.value as T;
}

export function cacheSet<T>(key: string, value: T): T {
  memory.set(key, { at: Date.now(), value });
  return value;
}
