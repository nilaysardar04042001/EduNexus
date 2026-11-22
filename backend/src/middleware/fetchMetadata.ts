import type { NextFunction, Request, Response } from 'express'
import { env } from '../config/env.js'

const TRUSTED_FRONTEND_ORIGIN = new URL(env.FRONTEND_ORIGIN).origin

/**
 * Fetch Metadata (Sec-Fetch-*) resource isolation middleware.
 * Rejects unauthorized cross-site API requests before authentication or DB work runs.
 */
export function fetchMetadataGuard(req: Request, res: Response, next: NextFunction): void {
  res.vary('Sec-Fetch-Dest')
  res.vary('Sec-Fetch-Mode')
  res.vary('Sec-Fetch-Site')

  const site = req.get('Sec-Fetch-Site')
  if (!site) {
    // Allow legacy browsers and non-browser clients (e.g. health probes)
    next()
    return
  }

  // Always allow same-origin and direct user-initiated requests
  if (site === 'same-origin' || site === 'none') {
    next()
    return
  }

  // Allow explicitly configured cross-origin frontend requests (exact origin match)
  const origin = req.get('Origin')
  if (origin && origin === TRUSTED_FRONTEND_ORIGIN) {
    next()
    return
  }

  // Allow standard top-level GET navigations (excluding plugin embeds)
  const mode = req.get('Sec-Fetch-Mode')
  const dest = req.get('Sec-Fetch-Dest') ?? ''
  if (
    site === 'cross-site' &&
    mode === 'navigate' &&
    req.method === 'GET' &&
    dest !== 'object' &&
    dest !== 'embed'
  ) {
    next()
    return
  }

  res.status(403).json({ error: 'Forbidden' })
}
