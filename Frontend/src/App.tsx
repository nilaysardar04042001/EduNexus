import { useCallback, useState } from 'react'
import { Header, Navbar } from './components'
import type { NavSectionId } from './components'

function App() {
  const [activeSection, setActiveSection] = useState<NavSectionId>('home')

  const handleNavigate = useCallback((section: NavSectionId) => {
    setActiveSection(section)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
      <Header />
      <main className="flex flex-1 flex-col" />
    </div>
  )
}

export default App
