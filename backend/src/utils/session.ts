import crypto from 'node:crypto'
import type { Request, Response } from 'express'
import { env } from '../config/env.js'
import { prisma } from '../db/prisma.js'

// Use __Host- cookie prefix in production (requires Secure, Path=/, and no Domain attribute)
export const SESSION_COOKIE_NAME =
  env.NODE_ENV === 'production' ? '__Host-edunexus_session' : 'edunexus_session'
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const SESSION_REFRESH_THRESHOLD_MS = SESSION_TTL_MS / 2

export interface PublicUser {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  role: string
  theme: string
  dailyGoalMins: number
  createdAt: string
  stats: {
    enrollments: number
    completedLessons: number
  }
}

export interface AuthenticatedSession {
  sessionId: string
  user: PublicUser
}

function hashSessionToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex')
}

export function getCookieValue(req: Request, name: string): string | null {
  const header = req.headers.cookie
  if (!header) return null

  const pairs = header.split(';')
  for (const pair of pairs) {
    const eqIndex = pair.indexOf('=')
    if (eqIndex === -1) continue
    const key = pair.slice(0, eqIndex).trim()
    if (key === name) {
      const rawVal = pair.slice(eqIndex + 1).trim()
      try {
        return decodeURIComponent(rawVal)
      } catch {
        return rawVal
      }
    }
  }
  return null
}

export function setSessionCookie(res: Response, rawToken: string, expiresAt: Date): void {
  const maxAgeSeconds = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000))
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(rawToken)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
    `Expires=${expiresAt.toUTCString()}`,
  ]
  if (env.NODE_ENV === 'production') {
    parts.push('Secure')
  }
  res.setHeader('Set-Cookie', parts.join('; '))
}

export function clearSessionCookie(res: Response): void {
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ]
  if (env.NODE_ENV === 'production') {
    parts.push('Secure')
  }
  res.setHeader('Set-Cookie', parts.join('; '))
}

export async function createSession(
  userId: string,
  userAgent: string | undefined,
): Promise<{ rawToken: string; expiresAt: Date }> {
  const rawToken = crypto.randomBytes(32).toString('base64url')
  const tokenHash = hashSessionToken(rawToken)
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

  await prisma.session.create({
    data: {
      tokenHash,
      userId,
      userAgent: userAgent ? userAgent.slice(0, 256) : null,
      expiresAt,
    },
  })

  return { rawToken, expiresAt }
}

export async function revokeSessionByRequest(req: Request): Promise<void> {
  const rawToken = getCookieValue(req, SESSION_COOKIE_NAME)
  if (!rawToken) return

  const tokenHash = hashSessionToken(rawToken)
  await prisma.session.deleteMany({
    where: { tokenHash },
  })
}

export async function getAuthenticatedSession(
  req: Request,
  res: Response,
): Promise<AuthenticatedSession | null> {
  const rawToken = getCookieValue(req, SESSION_COOKIE_NAME)
  if (!rawToken) return null

  const tokenHash = hashSessionToken(rawToken)
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        include: {
          _count: {
            select: {
              enrollments: true,
              lessonProgress: {
                where: { status: 'completed' },
              },
            },
          },
        },
      },
    },
  })

  if (!session) {
    clearSessionCookie(res)
    return null
  }

  const now = Date.now()
  if (session.expiresAt.getTime() <= now) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => undefined)
    clearSessionCookie(res)
    return null
  }

  // Sliding session refresh when past halfway to expiration
  if (session.expiresAt.getTime() - now < SESSION_REFRESH_THRESHOLD_MS) {
    const newExpiresAt = new Date(now + SESSION_TTL_MS)
    await prisma.session
      .update({
        where: { id: session.id },
        data: { expiresAt: newExpiresAt },
      })
      .catch(() => undefined)
    setSessionCookie(res, rawToken, newExpiresAt)
  }

  return {
    sessionId: session.id,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      avatarUrl: session.user.avatarUrl,
      role: session.user.role,
      theme: session.user.theme,
      dailyGoalMins: session.user.dailyGoalMins,
      createdAt: session.user.createdAt.toISOString(),
      stats: {
        enrollments: session.user._count.enrollments,
        completedLessons: session.user._count.lessonProgress,
      },
    },
  }
}
