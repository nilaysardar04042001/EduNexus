import { memo } from 'react'
import type { MouseEvent } from 'react'

export interface NavbarBrandProps {
  onHomeClick: (event: MouseEvent<HTMLAnchorElement>) => void
}

/**
 * Left Brand Home button with glass tint, layered inner shadow, animated sheen,
 * /EduNexus.png logo tile, and animated color tagline.
 */
export const NavbarBrand = memo(function NavbarBrand({ onHomeClick }: NavbarBrandProps) {
  return (
    <div className="edunexus-nav-left" data-nav-part="left">
      <a
        href="#home"
        data-section="home"
        onClick={onHomeClick}
        aria-label="EduNexus — Go to Home page"
        className="edunexus-home-link"
      >
        <span className="edunexus-home-sheen" aria-hidden="true" />
        <span className="edunexus-home-logo-frame">
          <img
            src="/EduNexus.png"
            alt=""
            width={34}
            height={34}
            decoding="async"
            fetchPriority="high"
            className="edunexus-home-logo-img"
          />
        </span>
        <span className="edunexus-brand-copy">
          <span className="edunexus-brand-title">
            Edu<span className="edunexus-brand-accent">Nexus</span>
          </span>
          <span className="edunexus-home-tagline">Learn • Practice • Create • Excel</span>
        </span>
      </a>
    </div>
  )
})
