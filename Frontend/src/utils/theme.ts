const STORAGE_KEY = 'color-scheme'

export type ExplicitColorScheme = 'light' | 'dark'

function readStoredScheme(): ExplicitColorScheme | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function getSystemScheme(): ExplicitColorScheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getMetaColorScheme(): HTMLMetaElement | null {
  return document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
}

function applySchemeToMeta(scheme: ExplicitColorScheme | null): void {
  const meta = getMetaColorScheme()
  if (meta) {
    meta.content = scheme ?? 'light dark'
  }
}

/**
 * Two-state color-scheme toggle following modern-web-guidance:
 * - Toggles to the opposite of the currently rendered scheme.
 * - If the target matches the current system preference, removes the stored override
 *   so the site returns to following the OS ("light dark").
 * - Otherwise persists the literal target ("light" or "dark").
 * - Still updates <meta name="color-scheme"> even when localStorage is unavailable.
 */
export function toggleColorScheme(): void {
  const systemScheme = getSystemScheme()
  const meta = getMetaColorScheme()
  const currentMeta = meta?.content
  const renderedScheme: ExplicitColorScheme =
    currentMeta === 'light' || currentMeta === 'dark' ? currentMeta : systemScheme
  const targetScheme: ExplicitColorScheme = renderedScheme === 'dark' ? 'light' : 'dark'
  const nextStored: ExplicitColorScheme | null = targetScheme === systemScheme ? null : targetScheme

  try {
    if (nextStored === null) {
      window.localStorage.removeItem(STORAGE_KEY)
    } else {
      window.localStorage.setItem(STORAGE_KEY, nextStored)
    }
  } catch {
    // Persistence may be blocked; still apply the scheme to the current document
  }

  applySchemeToMeta(nextStored)
}

/**
 * Keeps <meta name="color-scheme"> synchronized when the user toggles the theme in another tab.
 */
export function subscribeColorSchemeStorageSync(): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return
    applySchemeToMeta(readStoredScheme())
  }

  window.addEventListener('storage', handleStorage)
  return () => {
    window.removeEventListener('storage', handleStorage)
  }
}
