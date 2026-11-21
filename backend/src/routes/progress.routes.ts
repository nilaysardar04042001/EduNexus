import { Router } from 'express'
import type { Response } from 'express'
import { z } from 'zod'
import { prisma } from '../db/prisma.js'
import { HttpError } from '../middleware/errorHandler.js'
import { requireAuth } from '../middleware/requireAuth.js'
import type { AuthLocals } from '../middleware/requireAuth.js'
import { getAuthenticatedSession } from '../utils/session.js'

export const progressRouter = Router()

progressRouter.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  next()
})

const slugParamSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Invalid course slug format'),
})

const lessonParamSchema = z.object({
  lessonId: z.string().trim().min(1).max(120),
})

const toggleLessonBodySchema = z.object({
  completed: z.boolean(),
})

/**
 * GET /api/progress/:slug
 * Returns the authenticated learner's completed lesson IDs for a course (or empty list for guests).
 */
progressRouter.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = slugParamSchema.parse(req.params)
    const auth = await getAuthenticatedSession(req, res)

    if (!auth) {
      res.json({
        authenticated: false,
        completedLessonIds: [] as string[],
        progressPercent: 0,
      })
      return
    }

    const course = await prisma.course.findFirst({
      where: { slug, isPublished: true },
      select: {
        id: true,
        modules: {
          select: {
            lessons: { select: { id: true } },
          },
        },
      },
    })

    if (!course) {
      throw new HttpError(404, `Course "${slug}" not found`)
    }

    const lessonIds = course.modules.flatMap((mod) => mod.lessons.map((l) => l.id))
    const completedRows = await prisma.lessonProgress.findMany({
      where: {
        userId: auth.user.id,
        lessonId: { in: lessonIds },
        status: 'completed',
      },
      select: { lessonId: true },
    })

    const completedLessonIds = completedRows.map((row) => row.lessonId)
    const progressPercent =
      lessonIds.length > 0 ? Math.round((completedLessonIds.length / lessonIds.length) * 100) : 0

    res.json({
      authenticated: true,
      completedLessonIds,
      progressPercent,
    })
  } catch (error) {
    next(error)
  }
})

/**
 * PUT /api/progress/lessons/:lessonId
 * Persists a signed-in learner's lesson completion toggle and updates their course enrollment progress.
 */
progressRouter.put(
  '/lessons/:lessonId',
  requireAuth,
  async (req, res: Response<unknown, AuthLocals>, next) => {
    try {
      const auth = res.locals.auth
      if (!auth) {
        throw new HttpError(401, 'Authentication required.')
      }

      const { lessonId } = lessonParamSchema.parse(req.params)
      const { completed } = toggleLessonBodySchema.parse(req.body)

      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: {
          id: true,
          module: {
            select: {
              courseId: true,
              course: {
                select: {
                  modules: {
                    select: {
                      lessons: { select: { id: true } },
                    },
                  },
                },
              },
            },
          },
        },
      })

      if (!lesson) {
        throw new HttpError(404, 'Lesson not found')
      }

      const nextStatus = completed ? 'completed' : 'not_started'
      await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: auth.user.id,
            lessonId: lesson.id,
          },
        },
        update: { status: nextStatus },
        create: {
          userId: auth.user.id,
          lessonId: lesson.id,
          status: nextStatus,
        },
      })

      const allCourseLessonIds = lesson.module.course.modules.flatMap((mod) =>
        mod.lessons.map((l) => l.id),
      )

      const completedInCourse = await prisma.lessonProgress.count({
        where: {
          userId: auth.user.id,
          lessonId: { in: allCourseLessonIds },
          status: 'completed',
        },
      })

      const progressPercent =
        allCourseLessonIds.length > 0
          ? Math.round((completedInCourse / allCourseLessonIds.length) * 100)
          : 0

      await prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: auth.user.id,
            courseId: lesson.module.courseId,
          },
        },
        update: {
          progressPercent,
          completedAt: progressPercent === 100 ? new Date() : null,
        },
        create: {
          userId: auth.user.id,
          courseId: lesson.module.courseId,
          progressPercent,
          completedAt: progressPercent === 100 ? new Date() : null,
        },
      })

      res.json({
        lessonId: lesson.id,
        completed,
        progressPercent,
      })
    } catch (error) {
      next(error)
    }
  },
)
