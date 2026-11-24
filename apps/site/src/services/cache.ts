interface CacheEnvelope<T> {
  savedAt: number;
  ttlMs: number;
  data: T;
}

export function loadCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const env = JSON.parse(raw) as CacheEnvelope<T>;
    if (Date.now() - env.savedAt >= env.ttlMs) {
      localStorage.removeItem(key);
      return null;
    }
    return env.data;
  } catch {
    return null;
  }
}

export function saveCache<T>(key: string, data: T, ttlMs: number): void {
  try {
    const env: CacheEnvelope<T> = { savedAt: Date.now(), ttlMs, data };
    localStorage.setItem(key, JSON.stringify(env));
  } catch {
    // переполнено или запрещено — просто не кэшируем
  }
}

/**
 * Взять из кэша или загрузить. Одновременные вызовы с одним ключом
 * ждут один и тот же запрос, а не шлют его повторно.
 */
const inflight = new Map<string, Promise<unknown>>();

export function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const hit = loadCache<T>(key);
  if (hit !== null) return Promise.resolve(hit);

  const pending = inflight.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  const request = load()
    .then((data) => {
      saveCache(key, data, ttlMs);
      return data;
    })
    .finally(() => inflight.delete(key));

  inflight.set(key, request);
  return request;
}
