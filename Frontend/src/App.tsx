import { Header, Navbar } from './components'

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <Header />
      <main className="flex flex-1 flex-col" />
    </div>
  )
}

export default App
