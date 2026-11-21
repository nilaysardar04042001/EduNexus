import { createApp } from './app.js'
import { env } from './config/env.js'
import { databaseProvider, prisma } from './db/prisma.js'

const app = createApp()

const server = app.listen(env.PORT, () => {
  console.log(
    `EduNexus Backend API running at http://localhost:${env.PORT}/api [DB: ${databaseProvider}]`,
  )
})

let isShuttingDown = false

async function shutdown(signal: string) {
  if (isShuttingDown) return
  isShuttingDown = true
  console.log(`\nReceived ${signal}. Shutting down EduNexus Backend gracefully...`)

  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))
