import { useCallback, useState } from 'react'
import { Header, Navbar, SplashScreen } from './components'
import type { NavSectionId } from './components'

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
      {showSplash && <SplashScreen duration={1500} onFinish={handleSplashFinish} />}
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
      <Header />
      <main className="flex flex-1 flex-col" />
    </div>
  )
}

export default App
