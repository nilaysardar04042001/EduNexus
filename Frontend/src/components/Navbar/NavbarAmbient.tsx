import { memo } from 'react'

/**
 * Pure decorative dual-theme paint-mixing ambient backdrop and bottom accent hairline.
 * Clipped inside its own layer so navbar popovers are never clipped.
 */
export const NavbarAmbient = memo(function NavbarAmbient() {
  return (
    <div className="edunexus-navbar-ambient" aria-hidden="true">
      <span className="edunexus-ambient-wash" />
      <span className="edunexus-ambient-vortex" />
      <span className="edunexus-ambient-blob edunexus-ambient-blob-a" />
      <span className="edunexus-ambient-blob edunexus-ambient-blob-b" />
      <span className="edunexus-ambient-blob edunexus-ambient-blob-c" />
      <span className="edunexus-ambient-blob edunexus-ambient-blob-d" />
      <span className="edunexus-ambient-blob edunexus-ambient-blob-e" />
      <span className="edunexus-ambient-blob edunexus-ambient-blob-f" />
      <span className="edunexus-ambient-blob edunexus-ambient-blob-g" />
      <span className="edunexus-ambient-blob edunexus-ambient-blob-h" />
    </div>
  )
})

export const NavbarEdgeAccent = memo(function NavbarEdgeAccent() {
  return (
    <div className="edunexus-navbar-edge" aria-hidden="true">
      <span className="edunexus-navbar-edge-track" />
    </div>
  )
})
