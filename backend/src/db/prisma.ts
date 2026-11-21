import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'
import { env } from '../config/env.js'

export type DatabaseProvider = 'turso-libsql' | 'local-sqlite'

export const databaseProvider: DatabaseProvider = env.isTursoEnabled
  ? 'turso-libsql'
  : 'local-sqlite'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

function createPrismaClient(): PrismaClient {
  const logLevels: ('warn' | 'error')[] =
    env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']

  if (env.isTursoEnabled && env.TURSO_DATABASE_URL) {
    const adapter = new PrismaLibSQL({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    })
    return new PrismaClient({ adapter, log: logLevels })
  }

  return new PrismaClient({ log: logLevels })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') {
  globalForPrisma.prisma = prisma
}
