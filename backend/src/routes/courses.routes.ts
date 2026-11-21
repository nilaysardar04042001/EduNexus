import { Router } from 'express'
import { z } from 'zod'
import { env } from '../config/env.js'
import { databaseProvider, prisma } from '../db/prisma.js'
import { HttpError } from '../middleware/errorHandler.js'
import { TtlCache } from '../utils/ttlCache.js'

export const coursesRouter = Router()

const courseListCache = new TtlCache<unknown>(env.CACHE_TTL_MS, 32)
const courseDetailCache = new TtlCache<unknown>(env.CACHE_TTL_MS, 64)

const listCoursesQuerySchema = z.object({
  featured: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
  pillar: z.enum(['learn', 'practice', 'create', 'excel']).optional(),
  level: z.string().trim().min(1).max(60).optional(),
  search: z.string().trim().min(1).max(100).optional(),
})

const slugParamSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Invalid course slug format'),
})

/** GET /api/courses — List published courses with outcomes & tool badges (TTL-cached for edge speed) */
coursesRouter.get('/', async (req, res) => {
  const query = listCoursesQuerySchema.parse(req.query)
  const cacheKey = JSON.stringify(query)

  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  res.setHeader('X-Database-Provider', databaseProvider)

  const cached = courseListCache.get(cacheKey)
  if (cached !== undefined) {
    res.setHeader('X-Cache', 'HIT')
    res.json(cached)
    return
  }

  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      ...(query.featured === undefined ? {} : { isFeaturedHero: query.featured }),
      ...(query.pillar === undefined ? {} : { pillar: query.pillar }),
      ...(query.level === undefined ? {} : { level: { contains: query.level } }),
      ...(query.search === undefined
        ? {}
        : {
            OR: [
              { title: { contains: query.search } },
              { summary: { contains: query.search } },
              { category: { contains: query.search } },
            ],
          }),
    },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      slug: true,
      order: true,
      shortLabel: true,
      title: true,
      category: true,
      level: true,
      summary: true,
      duration: true,
      modulesLabel: true,
      credential: true,
      imageKey: true,
      imageAlt: true,
      pillar: true,
      iconKey: true,
      isFeaturedHero: true,
      outcomes: {
        orderBy: { sortOrder: 'asc' },
        select: { text: true },
      },
      tools: {
        orderBy: { sortOrder: 'asc' },
        select: { id: true, label: true, logoKey: true },
      },
      _count: {
        select: {
          modules: true,
          questions: true,
        },
      },
    },
  })

  const payload = {
    count: courses.length,
    provider: databaseProvider,
    data: courses.map((course) => ({
      id: course.id,
      slug: course.slug,
      order: course.order,
      shortLabel: course.shortLabel,
      title: course.title,
      category: course.category,
      level: course.level,
      summary: course.summary,
      duration: course.duration,
      modules: course.modulesLabel,
      credential: course.credential,
      imageKey: course.imageKey,
      imageAlt: course.imageAlt,
      pillar: course.pillar,
      icon: course.iconKey,
      isFeaturedHero: course.isFeaturedHero,
      moduleCount: course._count.modules,
      questionCount: course._count.questions,
      studyOutcomes: course.outcomes.map((o) => o.text),
      tools: course.tools.map((t) => ({
        id: t.id,
        label: t.label,
        logo: t.logoKey,
      })),
    })),
  }

  courseListCache.set(cacheKey, payload)
  res.setHeader('X-Cache', 'MISS')
  res.json(payload)
})

/** GET /api/courses/:slug — Full course detail including modules, lessons & practice questions */
coursesRouter.get('/:slug', async (req, res) => {
  const { slug } = slugParamSchema.parse(req.params)

  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  res.setHeader('X-Database-Provider', databaseProvider)

  const cached = courseDetailCache.get(slug)
  if (cached !== undefined) {
    res.setHeader('X-Cache', 'HIT')
    res.json(cached)
    return
  }

  const course = await prisma.course.findFirst({
    where: { slug, isPublished: true },
    select: {
      id: true,
      slug: true,
      order: true,
      shortLabel: true,
      title: true,
      category: true,
      level: true,
      summary: true,
      duration: true,
      modulesLabel: true,
      credential: true,
      imageKey: true,
      imageAlt: true,
      pillar: true,
      iconKey: true,
      isFeaturedHero: true,
      outcomes: {
        orderBy: { sortOrder: 'asc' },
        select: { text: true },
      },
      tools: {
        orderBy: { sortOrder: 'asc' },
        select: { id: true, label: true, logoKey: true },
      },
      modules: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          title: true,
          description: true,
          outcome: true,
          sortOrder: true,
          lessons: {
            orderBy: { sortOrder: 'asc' },
            select: {
              id: true,
              slug: true,
              title: true,
              summary: true,
              durationMins: true,
              sortOrder: true,
            },
          },
        },
      },
      questions: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          difficulty: true,
          prompt: true,
          optionsJson: true,
          answerIndex: true,
          explanation: true,
          xpReward: true,
        },
      },
    },
  })

  if (!course) {
    throw new HttpError(404, `Course "${slug}" not found`)
  }

  const payload = {
    provider: databaseProvider,
    data: {
      id: course.id,
      slug: course.slug,
      order: course.order,
      shortLabel: course.shortLabel,
      title: course.title,
      category: course.category,
      level: course.level,
      summary: course.summary,
      duration: course.duration,
      modulesLabel: course.modulesLabel,
      credential: course.credential,
      imageKey: course.imageKey,
      imageAlt: course.imageAlt,
      pillar: course.pillar,
      icon: course.iconKey,
      isFeaturedHero: course.isFeaturedHero,
      studyOutcomes: course.outcomes.map((o) => o.text),
      tools: course.tools.map((t) => ({
        id: t.id,
        label: t.label,
        logo: t.logoKey,
      })),
      modules: course.modules,
      questions: course.questions.map((q) => ({
        id: q.id,
        difficulty: q.difficulty,
        prompt: q.prompt,
        options: JSON.parse(q.optionsJson) as string[],
        answerIndex: q.answerIndex,
        explanation: q.explanation,
        xpReward: q.xpReward,
      })),
    },
  }

  courseDetailCache.set(slug, payload)
  res.setHeader('X-Cache', 'MISS')
  res.json(payload)
})
