export type NavSectionId = 'home' | 'courses' | 'practice' | 'projects' | 'about'
export type NavAuthAction = 'register' | 'login'

export interface NavSwitchItem {
  id: NavSectionId
  label: string
  href: string
}

export interface NavbarProps {
  /** Currently active section/page identifier for aria-current="page" */
  activeSection?: NavSectionId
  /** Currently active/highlighted auth switch option (defaults to 'register') */
  activeAuthAction?: NavAuthAction
  /** Callback invoked when user selects a navigation link or Brand Home button */
  onNavigate?: (section: NavSectionId) => void
  /** Callback invoked when user clicks Registration or Login in the top-right switch */
  onAuthAction?: (action: NavAuthAction) => void
  /** Optional extra classes on the outer navbar wrapper */
  className?: string
}

export const NAV_SWITCH_ITEMS: readonly NavSwitchItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'courses', label: 'Courses', href: '#courses' },
  { id: 'practice', label: 'Practice', href: '#practice' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'about', label: 'About', href: '#about' },
] as const

export function isNavSectionId(value: string | undefined): value is NavSectionId {
  return (
    value === 'home' ||
    value === 'courses' ||
    value === 'practice' ||
    value === 'projects' ||
    value === 'about'
  )
}

export function isNavAuthAction(value: string | undefined): value is NavAuthAction {
  return value === 'register' || value === 'login'
}
