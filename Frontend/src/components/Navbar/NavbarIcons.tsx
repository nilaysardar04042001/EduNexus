import { config } from '@fortawesome/fontawesome-svg-core'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { faBookOpen } from '@fortawesome/free-solid-svg-icons/faBookOpen'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { faCubes } from '@fortawesome/free-solid-svg-icons/faCubes'
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse'
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons/faRightToBracket'
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { NavSectionId } from './types'

// Disable runtime inline <style> injection; base .svg-inline--fa sizing is declared in Navbar.css
config.autoAddCss = false

export type NavIconName = NavSectionId

const NAV_ICON_MAP: Record<NavIconName, IconDefinition> = {
  home: faHouse,
  courses: faBookOpen,
  practice: faCode,
  projects: faCubes,
  about: faCircleInfo,
}

export function NavIcon({
  name,
  className = 'edunexus-nav-icon',
}: {
  name: NavIconName
  className?: string
}) {
  return <FontAwesomeIcon icon={NAV_ICON_MAP[name]} fixedWidth aria-hidden="true" className={className} />
}

export function MenuBarsIcon({ className = 'edunexus-menu-icon' }: { className?: string }) {
  return <FontAwesomeIcon icon={faBars} fixedWidth aria-hidden="true" className={className} />
}

export function RegisterIcon({ className = 'edunexus-auth-icon' }: { className?: string }) {
  return <FontAwesomeIcon icon={faUserPlus} fixedWidth aria-hidden="true" className={className} />
}

export function LoginIcon({ className = 'edunexus-auth-icon' }: { className?: string }) {
  return <FontAwesomeIcon icon={faRightToBracket} fixedWidth aria-hidden="true" className={className} />
}

export function SunIcon({ className = 'edunexus-theme-icon' }: { className?: string }) {
  return <FontAwesomeIcon icon={faSun} fixedWidth aria-hidden="true" className={className} />
}

export function MoonIcon({ className = 'edunexus-theme-icon' }: { className?: string }) {
  return <FontAwesomeIcon icon={faMoon} fixedWidth aria-hidden="true" className={className} />
}
