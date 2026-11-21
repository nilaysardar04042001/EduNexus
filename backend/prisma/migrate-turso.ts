import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@libsql/client'

async function runTursoMigrations() {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url) {
    console.log('TURSO_DATABASE_URL is not set — skipping remote Turso migration.')
    return
  }

  const client = createClient({ url, authToken })

  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "_TursoMigrations" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "applied_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations')
    if (!fs.existsSync(migrationsDir)) {
      throw new Error(`Migrations directory not found at ${migrationsDir}`)
    }

    const folders = fs
      .readdirSync(migrationsDir)
      .filter((entry) => fs.statSync(path.join(migrationsDir, entry)).isDirectory())
      .sort()

    for (const folder of folders) {
      const existing = await client.execute({
        sql: 'SELECT "id" FROM "_TursoMigrations" WHERE "id" = ?',
        args: [folder],
      })

      if (existing.rows.length > 0) {
        console.log(`Skipping already-applied Turso migration: ${folder}`)
        continue
      }

      const sqlPath = path.join(migrationsDir, folder, 'migration.sql')
      if (!fs.existsSync(sqlPath)) continue

      const sql = fs.readFileSync(sqlPath, 'utf8').replace(/^\uFEFF/, '')
      console.log(`Applying Turso migration: ${folder}...`)
      await client.executeMultiple(sql)
      await client.execute({
        sql: 'INSERT INTO "_TursoMigrations" ("id") VALUES (?)',
        args: [folder],
      })
      console.log(`Applied Turso migration: ${folder}`)
    }

    console.log('Turso schema is up to date.')
  } finally {
    client.close()
  }
}

runTursoMigrations().catch((error) => {
  console.error('Turso migration failed:', error)
  process.exitCode = 1
})
