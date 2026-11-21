interface CacheEntry<T> {
  value: T
  expiresAt: number
}

/**
 * Lightweight bounded in-memory TTL cache to minimize Turso remote read rows & network RTT
 * for read-heavy public catalog endpoints.
 */
export class TtlCache<T> {
  private readonly store = new Map<string, CacheEntry<T>>()
  private readonly ttlMs: number
  private readonly maxEntries: number

  constructor(ttlMs: number, maxEntries = 64) {
    this.ttlMs = ttlMs
    this.maxEntries = maxEntries
  }

  get(key: string): T | undefined {
    if (this.ttlMs <= 0) return undefined
    const entry = this.store.get(key)
    if (!entry) return undefined

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }

    return entry.value
  }

  set(key: string, value: T): void {
    if (this.ttlMs <= 0) return
    if (this.store.size >= this.maxEntries) {
      const oldestKey = this.store.keys().next().value
      if (oldestKey !== undefined) {
        this.store.delete(oldestKey)
      }
    }
    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    })
  }

  clear(): void {
    this.store.clear()
  }
}
