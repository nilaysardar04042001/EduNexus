import { spawn } from 'node:child_process'
import process from 'node:process'

const IS_WINDOWS = process.platform === 'win32'

const SERVICES = [
  {
    name: 'BACKEND',
    color: '\x1b[35m', // Magenta
    npmArgs: ['run', 'dev:backend'],
  },
  {
    name: 'FRONTEND',
    color: '\x1b[36m', // Cyan
    npmArgs: ['run', 'dev:frontend'],
  },
]

const RESET = '\x1b[0m'
const DIM = '\x1b[2m'
const RED = '\x1b[31m'

/** @type {Array<{ name: string; child: import('node:child_process').ChildProcess }>} */
const running = []
let isShuttingDown = false

/**
 * Writes line-prefixed output so frontend and backend logs stay readable in one terminal.
 * @param {string} label
 * @param {string} color
 * @param {NodeJS.WriteStream} stream
 * @param {Buffer} chunk
 */
function writePrefixed(label, color, stream, chunk) {
  const text = chunk.toString('utf8')
  const lines = text.split(/\r?\n/)
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    if (i === lines.length - 1 && line === '') continue
    stream.write(`${color}[${label}]${RESET} ${line}\n`)
  }
}

/**
 * Terminates a child process tree cleanly on both Windows and POSIX.
 * @param {import('node:child_process').ChildProcess} child
 */
function terminateTree(child) {
  if (!child.pid || child.killed || child.exitCode !== null) return

  if (IS_WINDOWS) {
    spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], {
      stdio: 'ignore',
      windowsHide: true,
    })
    return
  }

  try {
    process.kill(-child.pid, 'SIGTERM')
  } catch {
    child.kill('SIGTERM')
  }
}

/**
 * Stops all running services cleanly and exits.
 * @param {number} exitCode
 */
function shutdown(exitCode = 0) {
  if (isShuttingDown) return
  isShuttingDown = true

  process.stdout.write(`\n${DIM}[DEV] Shutting down EduNexus services...${RESET}\n`)
  for (const entry of running) {
    terminateTree(entry.child)
  }

  setTimeout(() => {
    process.exit(exitCode)
  }, 300)
}

process.stdout.write(
  `${DIM}[DEV] Starting EduNexus Backend (http://localhost:4000/api) + Frontend (http://localhost:5173/)...${RESET}\n`,
)

for (const service of SERVICES) {
  const command = IS_WINDOWS ? 'cmd.exe' : 'npm'
  const args = IS_WINDOWS ? ['/d', '/s', '/c', `npm ${service.npmArgs.join(' ')}`] : service.npmArgs

  const child = spawn(command, args, {
    cwd: process.cwd(),
    env: { ...process.env, FORCE_COLOR: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: !IS_WINDOWS,
    windowsHide: true,
  })

  running.push({ name: service.name, child })

  child.stdout?.on('data', (chunk) => {
    writePrefixed(service.name, service.color, process.stdout, chunk)
  })

  child.stderr?.on('data', (chunk) => {
    writePrefixed(service.name, service.color, process.stderr, chunk)
  })

  child.on('error', (error) => {
    process.stderr.write(`${RED}[${service.name}] Failed to start: ${error.message}${RESET}\n`)
    shutdown(1)
  })

  child.on('exit', (code, signal) => {
    if (isShuttingDown) return
    const reason = signal ? `signal ${signal}` : `exit code ${code ?? 0}`
    process.stderr.write(`${RED}[${service.name}] Stopped unexpectedly (${reason}).${RESET}\n`)
    shutdown(code === 0 ? 0 : 1)
  })
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
