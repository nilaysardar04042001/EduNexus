import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { env } from '../config/env.js'

export class HttpError extends Error {
  readonly statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.name = 'HttpError'
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: 'Not Found',
    message:
      env.NODE_ENV === 'production'
        ? 'The requested resource does not exist'
        : `Route ${req.method} ${req.originalUrl} does not exist`,
  })
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation Error',
      details: err.flatten().fieldErrors,
    })
    return
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      error: err.message,
    })
    return
  }

  const message =
    env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err instanceof Error
        ? err.message
        : 'Unknown error'

  console.error('[EduNexus API Error]', err)
  res.status(500).json({ error: message })
}
