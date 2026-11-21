import { memo } from 'react'
import type { ReactNode } from 'react'

export interface NavbarProps {
  /** Content for the left slot (e.g., brand logo) */
  left?: ReactNode
  /** Content for the center slot (e.g., navigation links) */
  center?: ReactNode
  /** Content for the right slot (e.g., theme toggle, auth actions) */
  right?: ReactNode
  /** Accessible label for the navigation landmark */
  ariaLabel?: string
  /** Optional extra classes on the outer nav element */
  className?: string
}

export const Navbar = memo(function Navbar({
  left,
  center,
  right,
  ariaLabel = 'Primary navigation',
  className = '',
}: NavbarProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={`sticky top-0 z-50 w-full border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 ${className}`.trim()}
    >
      <div className="mx-auto grid h-14 w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:h-16 sm:px-6 lg:gap-6 lg:px-8">
        <div
          className="flex min-w-0 shrink-0 items-center justify-start gap-2 whitespace-nowrap"
          data-navbar-slot="left"
        >
          {left}
        </div>

        <div
          className="flex min-w-0 items-center justify-center gap-2"
          data-navbar-slot="center"
        >
          {center}
        </div>

        <div
          className="flex min-w-0 shrink-0 items-center justify-end gap-2 whitespace-nowrap"
          data-navbar-slot="right"
        >
          {right}
        </div>
      </div>
    </nav>
  )
})

export default Navbar
