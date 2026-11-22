import 'dotenv/config'
import { z } from 'zod'

const optionalNonEmptyString = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().trim().min(1).optional(),
)

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1).default('file:./dev.db'),
  TURSO_DATABASE_URL: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z
      .string()
      .trim()
      .refine(
        (val) =>
          val.startsWith('libsql://') || val.startsWith('https://') || val.startsWith('file:'),
        'TURSO_DATABASE_URL must start with libsql://, https://, or file:',
      )
      .optional(),
  ),
  TURSO_AUTH_TOKEN: optionalNonEmptyString,
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:5173'),
  TRUST_PROXY: z.coerce.number().int().min(0).max(10).default(0),
  CACHE_TTL_MS: z.coerce.number().int().min(0).max(3_600_000).default(60_000),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid backend environment configuration:', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

const hasRemoteTursoUrl = Boolean(
  parsed.data.TURSO_DATABASE_URL &&
    (parsed.data.TURSO_DATABASE_URL.startsWith('libsql://') ||
      parsed.data.TURSO_DATABASE_URL.startsWith('https://')),
)

const isTursoEnabled = hasRemoteTursoUrl
  ? Boolean(parsed.data.TURSO_AUTH_TOKEN)
  : Boolean(parsed.data.TURSO_DATABASE_URL)

if (hasRemoteTursoUrl && !parsed.data.TURSO_AUTH_TOKEN) {
  console.warn(
    '[EduNexus] TURSO_DATABASE_URL is set but TURSO_AUTH_TOKEN is missing — falling back to local SQLite (dev.db).',
  )
}

export const env = {
  ...parsed.data,
  isTursoEnabled,
}
