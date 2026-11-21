import { Router } from 'express'
import { env } from '../config/env.js'
import { databaseProvider, prisma } from '../db/prisma.js'
import { TtlCache } from '../utils/ttlCache.js'

export const platformRouter = Router()

const statsCache = new TtlCache<unknown>(env.CACHE_TTL_MS, 4)

interface PillarBucket {
  courses: number
  modules: number
  lessons: number
}

/**
 * GET /api/platform/stats
 * Live database-backed platform telemetry (published courses, real lesson durations,
 * real question difficulty distribution, pillar breakdown, and top taught tools).
 */
platformRouter.get('/stats', async (_req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  res.setHeader('X-Database-Provider', databaseProvider)

  const cached = statsCache.get('stats')
  if (cached !== undefined) {
    res.setHeader('X-Cache', 'HIT')
    res.json(cached)
    return
  }

  const [courses, questions, learnerCount] = await Promise.all([
    prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        slug: true,
        shortLabel: true,
        pillar: true,
        tools: {
          orderBy: { sortOrder: 'asc' },
          select: { label: true, logoKey: true },
        },
        modules: {
          select: {
            id: true,
            lessons: {
              select: { durationMins: true },
            },
          },
        },
        _count: {
          select: { questions: true },
        },
      },
    }),
    prisma.practiceQuestion.findMany({
      where: { course: { isPublished: true } },
      select: { difficulty: true, xpReward: true },
    }),
    prisma.user.count(),
  ])

  const pillarBreakdown: Record<'learn' | 'practice' | 'create' | 'excel', PillarBucket> = {
    learn: { courses: 0, modules: 0, lessons: 0 },
    practice: { courses: 0, modules: 0, lessons: 0 },
    create: { courses: 0, modules: 0, lessons: 0 },
    excel: { courses: 0, modules: 0, lessons: 0 },
  }

  let totalModules = 0
  let totalLessons = 0
  let totalDurationMins = 0
  const seenTools = new Set<string>()
  const topTools: { label: string; logo: string }[] = []

  const courseWorkloads = courses.map((course) => {
    const moduleCount = course.modules.length
    let lessonCount = 0
    let durationMins = 0

    for (const mod of course.modules) {
      lessonCount += mod.lessons.length
      for (const lesson of mod.lessons) {
        durationMins += lesson.durationMins
      }
    }

    totalModules += moduleCount
    totalLessons += lessonCount
    totalDurationMins += durationMins

    if (
      course.pillar === 'learn' ||
      course.pillar === 'practice' ||
      course.pillar === 'create' ||
      course.pillar === 'excel'
    ) {
      pillarBreakdown[course.pillar].courses += 1
      pillarBreakdown[course.pillar].modules += moduleCount
      pillarBreakdown[course.pillar].lessons += lessonCount
    }

    for (const tool of course.tools) {
      const normalized = tool.label.toLowerCase()
      if (!seenTools.has(normalized)) {
        seenTools.add(normalized)
        topTools.push({ label: tool.label, logo: tool.logoKey })
      }
    }

    return {
      slug: course.slug,
      shortLabel: course.shortLabel,
      pillar: course.pillar,
      moduleCount,
      lessonCount,
      durationMins,
      questionCount: course._count.questions,
    }
  })

  const questionDifficulty = { easy: 0, medium: 0, hard: 0 }
  let totalXpAvailable = 0

  for (const question of questions) {
    totalXpAvailable += question.xpReward
    if (question.difficulty === 'easy') {
      questionDifficulty.easy += 1
    } else if (question.difficulty === 'medium') {
      questionDifficulty.medium += 1
    } else if (question.difficulty === 'hard') {
      questionDifficulty.hard += 1
    }
  }

  const payload = {
    provider: databaseProvider,
    totals: {
      courses: courses.length,
      modules: totalModules,
      lessons: totalLessons,
      questions: questions.length,
      learners: learnerCount,
      totalDurationMins,
      totalXpAvailable,
    },
    questionDifficulty,
    pillarBreakdown,
    courseWorkloads,
    topTools: topTools.slice(0, 8),
  }

  statsCache.set('stats', payload)
  res.setHeader('X-Cache', 'MISS')
  res.json(payload)
})
