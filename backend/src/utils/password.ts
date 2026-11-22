import crypto from 'node:crypto'

const SCRYPT_N = 16_384
const SCRYPT_R = 8
const SCRYPT_P = 1
const KEY_LENGTH = 64
const SALT_BYTES = 16

function deriveScryptKey(
  password: string,
  salt: Buffer,
  cost: number,
  blockSize: number,
  parallelization: number,
  keyLen: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(
      password,
      salt,
      keyLen,
      { N: cost, r: blockSize, p: parallelization },
      (error, derivedKey) => {
        if (error) {
          reject(error)
          return
        }
        resolve(derivedKey)
      },
    )
  })
}

/**
 * Hashes a password with Node.js built-in scrypt (memory-hard KDF).
 * Format: scrypt$N$r$p$saltHex$hashHex
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(SALT_BYTES)
  const derived = await deriveScryptKey(
    password,
    salt,
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    KEY_LENGTH,
  )
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString('hex')}$${derived.toString('hex')}`
}

const MIN_SCRYPT_N = 1024
const MAX_SCRYPT_N = 65_536
const MAX_SCRYPT_R = 16
const MAX_SCRYPT_P = 4
const MIN_KEY_LENGTH = 16
const MAX_KEY_LENGTH = 128

function isPowerOfTwo(value: number): boolean {
  return value > 0 && (value & (value - 1)) === 0
}

/**
 * Timing-safe password verification against a stored scrypt hash.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split('$')
  if (parts.length !== 6 || parts[0] !== 'scrypt') {
    return false
  }

  const cost = Number(parts[1])
  const blockSize = Number(parts[2])
  const parallelization = Number(parts[3])
  const saltHex = parts[4]
  const expectedHex = parts[5]

  if (
    !Number.isInteger(cost) ||
    !Number.isInteger(blockSize) ||
    !Number.isInteger(parallelization) ||
    cost < MIN_SCRYPT_N ||
    cost > MAX_SCRYPT_N ||
    !isPowerOfTwo(cost) ||
    blockSize < 1 ||
    blockSize > MAX_SCRYPT_R ||
    parallelization < 1 ||
    parallelization > MAX_SCRYPT_P ||
    !saltHex ||
    !expectedHex
  ) {
    return false
  }

  const salt = Buffer.from(saltHex, 'hex')
  const expected = Buffer.from(expectedHex, 'hex')
  if (
    salt.length < 8 ||
    expected.length < MIN_KEY_LENGTH ||
    expected.length > MAX_KEY_LENGTH
  ) {
    return false
  }

  const derived = await deriveScryptKey(
    password,
    salt,
    cost,
    blockSize,
    parallelization,
    expected.length,
  )

  return derived.length === expected.length && crypto.timingSafeEqual(derived, expected)
}

// Precomputed dummy scrypt hash used when an email is not found on login
// so invalid-email and wrong-password paths take equivalent CPU time.
const DUMMY_SALT = Buffer.from('0123456789abcdef0123456789abcdef', 'hex')

export async function runDummyPasswordWork(password: string): Promise<void> {
  await deriveScryptKey(password, DUMMY_SALT, SCRYPT_N, SCRYPT_R, SCRYPT_P, KEY_LENGTH)
}
