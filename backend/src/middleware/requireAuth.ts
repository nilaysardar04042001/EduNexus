import type { NextFunction, Request, Response } from 'express'
import { HttpError } from './errorHandler.js'
import { getAuthenticatedSession } from '../utils/session.js'
import type { AuthenticatedSession } from '../utils/session.js'

export interface AuthLocals {
  auth?: AuthenticatedSession
}

export async function requireAuth(
  req: Request,
  res: Response<unknown, AuthLocals>,
  next: NextFunction,
): Promise<void> {
  try {
    const auth = await getAuthenticatedSession(req, res)
    if (!auth) {
      next(new HttpError(401, 'Authentication required. Please sign in.'))
      return
    }
    res.locals.auth = auth
    next()
  } catch (error) {
    next(error)
  }
}
