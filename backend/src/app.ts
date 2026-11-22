import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { fetchMetadataGuard } from './middleware/fetchMetadata.js'
import { apiRouter } from './routes/index.js'

export function createApp() {
  const app = express()

  app.disable('x-powered-by')
  if (env.TRUST_PROXY > 0) {
    app.set('trust proxy', env.TRUST_PROXY)
  }

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          defaultSrc: ["'none'"],
          baseUri: ["'none'"],
          frameAncestors: ["'none'"],
        },
      },
      frameguard: { action: 'deny' },
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: { policy: 'same-origin' },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  )
  app.use(
    cors({
      origin: env.FRONTEND_ORIGIN,
      credentials: true,
    }),
  )
  app.use(fetchMetadataGuard)
  app.use(express.json({ limit: '100kb' }))

  app.use('/api', apiRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
