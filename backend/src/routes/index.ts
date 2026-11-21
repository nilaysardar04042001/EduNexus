import { Router } from 'express'
import { authRouter } from './auth.routes.js'
import { coursesRouter } from './courses.routes.js'
import { healthRouter } from './health.routes.js'
import { platformRouter } from './platform.routes.js'
import { progressRouter } from './progress.routes.js'

export const apiRouter = Router()

apiRouter.use('/health', healthRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/courses', coursesRouter)
apiRouter.use('/platform', platformRouter)
apiRouter.use('/progress', progressRouter)
