import { memo } from 'react'
import { MoonIcon, SunIcon } from './NavbarIcons'

export interface NavbarThemeToggleProps {
  onToggle: () => void
}

/**
 * Tactile iridescent glass Theme Toggle orb with Font Awesome Sun/Moon icons.
 * Both states stay in markup and inactive option is hidden via CSS so it remains
 * accurate with zero JS and stays in sync with <meta name="color-scheme">.
 */
export const NavbarThemeToggle = memo(function NavbarThemeToggle({
  onToggle,
}: NavbarThemeToggleProps) {
  return (
    <div className="edunexus-right-theme" data-nav-part="right-theme">
      <button type="button" className="edunexus-theme-toggle" onClick={onToggle}>
        <span className="edunexus-theme-glow" aria-hidden="true" />
        <span className="edunexus-theme-option edunexus-theme-to-dark">
          <MoonIcon />
          <span className="sr-only">Switch to dark theme</span>
        </span>
        <span className="edunexus-theme-option edunexus-theme-to-light">
          <SunIcon />
          <span className="sr-only">Switch to light theme</span>
        </span>
      </button>
    </div>
  )
})
