import type { NextFunction, Request, Response } from 'express'

interface RateLimitBucket {
  count: number
  resetAt: number
}

export interface RateLimitOptions {
  windowMs: number
  maxRequests: number
  maxEntries?: number
}

/**
 * Lightweight bounded in-memory sliding-window rate limiter for auth endpoints.
 */
export function createRateLimiter({
  windowMs,
  maxRequests,
  maxEntries = 1000,
}: RateLimitOptions) {
  const buckets = new Map<string, RateLimitBucket>()

  return function rateLimiter(req: Request, res: Response, next: NextFunction): void {
    const now = Date.now()
    const key = req.ip || req.socket.remoteAddress || 'unknown'

    const existing = buckets.get(key)
    if (!existing || now >= existing.resetAt) {
      if (buckets.size >= maxEntries) {
        for (const [entryKey, entry] of buckets) {
          if (now >= entry.resetAt) {
            buckets.delete(entryKey)
          }
        }
        if (buckets.size >= maxEntries) {
          const oldestKey = buckets.keys().next().value
          if (oldestKey !== undefined) {
            buckets.delete(oldestKey)
          }
        }
      }

      buckets.set(key, { count: 1, resetAt: now + windowMs })
      next()
      return
    }

    if (existing.count >= maxRequests) {
      const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
      res.setHeader('Retry-After', String(retryAfterSeconds))
      res.status(429).json({
        error: `Too many attempts. Please try again in ${retryAfterSeconds} seconds.`,
      })
      return
    }

    existing.count += 1
    next()
  }
}
