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
import type { NavSectionId } from './types'

export type NavIconName = NavSectionId
type FaIconDefinition = typeof faHouse

const NAV_ICON_MAP: Record<NavIconName, FaIconDefinition> = {
  home: faHouse,
  courses: faBookOpen,
  practice: faCode,
  projects: faCubes,
  about: faCircleInfo,
}

/**
 * Zero-overhead official Font Awesome 7 SVG renderer.
 * Reads [width, height, , , svgPathData] directly from @fortawesome/free-solid-svg-icons/*
 * without pulling the ~154 KB @fortawesome/fontawesome-svg-core runtime into V8 heap memory.
 */
function FaSvgIcon({
  icon,
  className,
}: {
  icon: FaIconDefinition
  className: string
}) {
  const [width, height, , , svgPathData] = icon.icon
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      focusable="false"
      className={`svg-inline--fa ${className}`}
    >
      {Array.isArray(svgPathData) ? (
        svgPathData.map((d) => <path key={d} fill="currentColor" d={d} />)
      ) : (
        <path fill="currentColor" d={svgPathData} />
      )}
    </svg>
  )
}

export function NavIcon({
  name,
  className = 'edunexus-nav-icon',
}: {
  name: NavIconName
  className?: string
}) {
  return <FaSvgIcon icon={NAV_ICON_MAP[name]} className={className} />
}

export function MenuBarsIcon({ className = 'edunexus-menu-icon' }: { className?: string }) {
  return <FaSvgIcon icon={faBars} className={className} />
}

export function RegisterIcon({ className = 'edunexus-auth-icon' }: { className?: string }) {
  return <FaSvgIcon icon={faUserPlus} className={className} />
}

export function LoginIcon({ className = 'edunexus-auth-icon' }: { className?: string }) {
  return <FaSvgIcon icon={faRightToBracket} className={className} />
}

export function SunIcon({ className = 'edunexus-theme-icon' }: { className?: string }) {
  return <FaSvgIcon icon={faSun} className={className} />
}

export function MoonIcon({ className = 'edunexus-theme-icon' }: { className?: string }) {
  return <FaSvgIcon icon={faMoon} className={className} />
}
