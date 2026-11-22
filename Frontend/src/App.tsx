import { lazy, Suspense, useCallback, useState } from 'react'
import { Header } from './components/Header'
import { Navbar } from './components/Navbar'
import type { NavSectionId } from './components/Navbar'

const SplashScreen = lazy(() => import('./components/SplashScreen'))

const SPLASH_SEEN_KEY = 'edunexus_splash_seen'

function shouldShowInitialSplash(): boolean {
  try {
    return window.sessionStorage.getItem(SPLASH_SEEN_KEY) !== '1'
  } catch {
    return false
  }
}

function markSplashSeen(): void {
  try {
    window.sessionStorage.setItem(SPLASH_SEEN_KEY, '1')
  } catch {
    // Ignore storage access errors in restricted contexts
  }
}

function App() {
  const [showSplash, setShowSplash] = useState<boolean>(shouldShowInitialSplash)
  const [activeSection, setActiveSection] = useState<NavSectionId>('home')

  const handleNavigate = useCallback((section: NavSectionId) => {
    setActiveSection(section)
  }, [])

  const handleSplashFinish = useCallback(() => {
    markSplashSeen()
    setShowSplash(false)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {showSplash && (
        <Suspense fallback={null}>
          <SplashScreen duration={1500} onFinish={handleSplashFinish} />
        </Suspense>
      )}
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
      <Header />
      <main className="flex flex-1 flex-col" />
    </div>
  )
}

export default App
