import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const IS_WINDOWS = process.platform === 'win32'
const frontendBinDir = path.join(process.cwd(), 'Frontend', 'node_modules', '.bin')

/**
 * Runs an npm command synchronously with inherited stdio.
 * @param {string[]} args
 */
function runNpm(args) {
  const command = IS_WINDOWS ? 'cmd.exe' : 'npm'
  const commandArgs = IS_WINDOWS ? ['/d', '/s', '/c', `npm ${args.join(' ')}`] : args
  const result = spawnSync(command, commandArgs, {
    cwd: process.cwd(),
    stdio: 'inherit',
  })

  if (result.error) {
    process.stderr.write(`Failed to run npm ${args.join(' ')}: ${result.error.message}\n`)
    process.exit(1)
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

// Install Frontend dependencies automatically in CI / Cloudflare Builds when Root directory is "/"
if (!fs.existsSync(frontendBinDir)) {
  process.stdout.write('[EduNexus] Installing Frontend dependencies before build...\n')
  runNpm(['--prefix', 'Frontend', 'ci', '--no-audit', '--no-fund'])
}

runNpm(['--prefix', 'Frontend', 'run', 'build'])
