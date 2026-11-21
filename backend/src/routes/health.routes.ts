import { Router } from 'express'
import { databaseProvider, prisma } from '../db/prisma.js'

export const healthRouter = Router()

healthRouter.get('/', async (_req, res) => {
  const startedAt = performance.now()
  const [courses, modules, lessons] = await Promise.all([
    prisma.course.count({ where: { isPublished: true } }),
    prisma.courseModule.count(),
    prisma.lesson.count(),
  ])
  const latencyMs = Math.round(performance.now() - startedAt)

  res.setHeader('Cache-Control', 'no-store')
  res.json({
    status: 'ok',
    service: 'edunexus-backend',
    timestamp: new Date().toISOString(),
    database: {
      connected: true,
      provider: databaseProvider,
      latencyMs,
      courses,
      modules,
      lessons,
    },
  })
})
