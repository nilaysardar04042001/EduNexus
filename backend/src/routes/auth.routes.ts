import { Router } from 'express'
import type { Response } from 'express'
import { z } from 'zod'
import { databaseProvider, prisma } from '../db/prisma.js'
import { HttpError } from '../middleware/errorHandler.js'
import { createRateLimiter } from '../middleware/rateLimit.js'
import { requireAuth } from '../middleware/requireAuth.js'
import type { AuthLocals } from '../middleware/requireAuth.js'
import { hashPassword, runDummyPasswordWork, verifyPassword } from '../utils/password.js'
import {
  clearSessionCookie,
  createSession,
  getAuthenticatedSession,
  revokeSessionByRequest,
  setSessionCookie,
} from '../utils/session.js'
import type { PublicUser } from '../utils/session.js'

export const authRouter = Router()

// Auth responses must never be cached by browsers or intermediaries
authRouter.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  next()
})

const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 25,
})

const PASSWORD_COMPLEXITY_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,128}$/

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your full name (at least 2 characters).')
    .max(80, 'Name must be 80 characters or fewer.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address.')
    .max(254, 'Email address is too long.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .max(128, 'Password must be 128 characters or fewer.')
    .regex(
      PASSWORD_COMPLEXITY_REGEX,
      'Password must include uppercase, lowercase, a number, and a special character.',
    ),
})

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address.')
    .max(254),
  password: z.string().min(1, 'Please enter your password.').max(128),
})

const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter a name with at least 2 characters.')
    .max(80, 'Name must be 80 characters or fewer.')
    .optional(),
  dailyGoalMins: z.coerce.number().int().min(10).max(240).optional(),
})

function formatPublicUser(
  user: {
    id: string
    name: string
    email: string
    avatarUrl: string | null
    role: string
    theme: string
    dailyGoalMins: number
    createdAt: Date
  },
  counts?: { enrollments: number; completedLessons: number },
): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    theme: user.theme,
    dailyGoalMins: user.dailyGoalMins,
    createdAt: user.createdAt.toISOString(),
    stats: {
      enrollments: counts?.enrollments ?? 0,
      completedLessons: counts?.completedLessons ?? 0,
    },
  }
}

/**
 * GET /api/auth/me
 * Returns current authenticated user session or { authenticated: false, user: null } (200 OK).
 */
authRouter.get('/me', async (req, res, next) => {
  try {
    const auth = await getAuthenticatedSession(req, res)
    if (!auth) {
      res.json({
        authenticated: false,
        provider: databaseProvider,
        user: null,
      })
      return
    }

    res.json({
      authenticated: true,
      provider: databaseProvider,
      user: auth.user,
    })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/auth/register
 * Registers a new EduNexus learner account, persists it to Turso/SQLite, and issues an HttpOnly session cookie.
 */
authRouter.post('/register', authRateLimit, async (req, res, next) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body)

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existing) {
      throw new HttpError(
        409,
        'An account with this email already exists. Try signing in instead.',
      )
    }

    const passwordHash = await hashPassword(password)
    const created = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'student',
      },
    })

    const { rawToken, expiresAt } = await createSession(created.id, req.headers['user-agent'])
    setSessionCookie(res, rawToken, expiresAt)

    res.status(201).json({
      authenticated: true,
      provider: databaseProvider,
      user: formatPublicUser(created),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/auth/login
 * Authenticates an existing account with constant-time password verification and creates a DB-backed session.
 */
authRouter.post('/login', authRateLimit, async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { email },
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
    })

    if (!user || !user.passwordHash) {
      await runDummyPasswordWork(password)
      throw new HttpError(401, 'Invalid email or password.')
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      throw new HttpError(401, 'Invalid email or password.')
    }

    const { rawToken, expiresAt } = await createSession(user.id, req.headers['user-agent'])
    setSessionCookie(res, rawToken, expiresAt)

    res.json({
      authenticated: true,
      provider: databaseProvider,
      user: formatPublicUser(user, {
        enrollments: user._count.enrollments,
        completedLessons: user._count.lessonProgress,
      }),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/auth/logout
 * Revokes the current session in Turso/SQLite and clears the HttpOnly cookie.
 */
authRouter.post('/logout', async (req, res, next) => {
  try {
    await revokeSessionByRequest(req)
    clearSessionCookie(res)
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

/**
 * PATCH /api/auth/me
 * Updates the signed-in user's profile (display name or daily study goal).
 */
authRouter.patch('/me', requireAuth, async (req, res: Response<unknown, AuthLocals>, next) => {
  try {
    const auth = res.locals.auth
    if (!auth) {
      throw new HttpError(401, 'Authentication required.')
    }

    const payload = updateProfileSchema.parse(req.body)
    if (payload.name === undefined && payload.dailyGoalMins === undefined) {
      res.json({
        authenticated: true,
        provider: databaseProvider,
        user: auth.user,
      })
      return
    }

    const updated = await prisma.user.update({
      where: { id: auth.user.id },
      data: {
        ...(payload.name === undefined ? {} : { name: payload.name }),
        ...(payload.dailyGoalMins === undefined ? {} : { dailyGoalMins: payload.dailyGoalMins }),
      },
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
    })

    res.json({
      authenticated: true,
      provider: databaseProvider,
      user: formatPublicUser(updated, {
        enrollments: updated._count.enrollments,
        completedLessons: updated._count.lessonProgress,
      }),
    })
  } catch (error) {
    next(error)
  }
})
