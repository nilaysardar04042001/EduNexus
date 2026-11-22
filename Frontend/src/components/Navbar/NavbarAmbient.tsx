import { memo, useId } from 'react'

/**
 * Ultra-low-VRAM Rainbow Marbled-Liquid Pigment Ribbons backdrop and bottom edge.
 *
 * Memory optimizations:
 * - Zero giant aspect-ratio:1 blur circles (previously allocated ~32-64 MB VRAM at HiDPI).
 * - Zero runtime CSS filter:blur() passes on animated elements; soft pigment blending is
 *   baked directly into concentric feathered translucent SVG strokes.
 * - Only 2 height-bounded (52px-tall) 2x-periodic (0..800..1600) SVG ribbon strips
 *   translated strictly via compositor-only translate3d with zero scale re-rasterization.
 */
export const NavbarAmbient = memo(function NavbarAmbient() {
  const uid = useId()
  const gradA = `${uid}-rb-a`
  const gradB = `${uid}-rb-b`
  const gradSilk = `${uid}-rb-silk`

  return (
    <div className="edunexus-navbar-ambient" aria-hidden="true">
      {/* Stream A: Pre-feathered marbled rainbow pigment ribbons flowing left -> right */}
      <svg
        className="edunexus-marble-svg edunexus-marble-stream-a"
        viewBox="0 0 1600 80"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradA} x1="0" y1="0" x2="1600" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="6.25%" stopColor="#f97316" />
            <stop offset="12.5%" stopColor="#facc15" />
            <stop offset="18.75%" stopColor="#22c55e" />
            <stop offset="25%" stopColor="#06b6d4" />
            <stop offset="31.25%" stopColor="#3b82f6" />
            <stop offset="37.5%" stopColor="#8b5cf6" />
            <stop offset="43.75%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="56.25%" stopColor="#f97316" />
            <stop offset="62.5%" stopColor="#facc15" />
            <stop offset="68.75%" stopColor="#22c55e" />
            <stop offset="75%" stopColor="#06b6d4" />
            <stop offset="81.25%" stopColor="#3b82f6" />
            <stop offset="87.5%" stopColor="#8b5cf6" />
            <stop offset="93.75%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Soft outer pigment wash (replaces expensive Gaussian blur shader) */}
        <path
          d="M0,26 C135,-8 265,62 400,26 C535,-10 665,60 800,26 C935,-8 1065,62 1200,26 C1335,-10 1465,60 1600,26"
          stroke={`url(#${gradA})`}
          strokeWidth="44"
          strokeOpacity="0.26"
          strokeLinecap="round"
        />
        {/* Primary liquid pigment ribbon body */}
        <path
          d="M0,26 C135,-8 265,62 400,26 C535,-10 665,60 800,26 C935,-8 1065,62 1200,26 C1335,-10 1465,60 1600,26"
          stroke={`url(#${gradA})`}
          strokeWidth="22"
          strokeOpacity="0.5"
          strokeLinecap="round"
        />
        {/* Secondary folded ribbon lower swell */}
        <path
          d="M0,54 C140,86 260,16 400,54 C540,92 660,22 800,54 C940,86 1060,16 1200,54 C1340,92 1460,22 1600,54"
          stroke={`url(#${gradA})`}
          strokeWidth="26"
          strokeOpacity="0.34"
          strokeLinecap="round"
        />
      </svg>

      {/* Stream B: Counter-flowing intertwined rainbow ribbons + iridescent silk veins (right -> left) */}
      <svg
        className="edunexus-marble-svg edunexus-marble-stream-b"
        viewBox="0 0 1600 80"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradB} x1="0" y1="0" x2="1600" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="6.25%" stopColor="#3b82f6" />
            <stop offset="12.5%" stopColor="#8b5cf6" />
            <stop offset="18.75%" stopColor="#ec4899" />
            <stop offset="25%" stopColor="#ef4444" />
            <stop offset="31.25%" stopColor="#f97316" />
            <stop offset="37.5%" stopColor="#facc15" />
            <stop offset="43.75%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="56.25%" stopColor="#3b82f6" />
            <stop offset="62.5%" stopColor="#8b5cf6" />
            <stop offset="68.75%" stopColor="#ec4899" />
            <stop offset="75%" stopColor="#ef4444" />
            <stop offset="81.25%" stopColor="#f97316" />
            <stop offset="87.5%" stopColor="#facc15" />
            <stop offset="93.75%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <linearGradient id={gradSilk} x1="0" y1="0" x2="1600" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="12.5%" stopColor="#fef08a" stopOpacity="0.52" />
            <stop offset="25%" stopColor="#67e8f9" stopOpacity="0.48" />
            <stop offset="37.5%" stopColor="#f0abfc" stopOpacity="0.52" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="62.5%" stopColor="#fef08a" stopOpacity="0.52" />
            <stop offset="75%" stopColor="#67e8f9" stopOpacity="0.48" />
            <stop offset="87.5%" stopColor="#f0abfc" stopOpacity="0.52" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Soft feathered counter-flowing ribbon halo */}
        <path
          d="M0,56 C135,84 265,0 400,28 C535,56 665,28 800,56 C935,84 1065,0 1200,28 C1335,56 1465,28 1600,56"
          stroke={`url(#${gradB})`}
          strokeWidth="36"
          strokeOpacity="0.24"
          strokeLinecap="round"
        />
        {/* Intertwined pigment core */}
        <path
          d="M0,56 C135,84 265,0 400,28 C535,56 665,28 800,56 C935,84 1065,0 1200,28 C1335,56 1465,28 1600,56"
          stroke={`url(#${gradB})`}
          strokeWidth="16"
          strokeOpacity="0.54"
          strokeLinecap="round"
        />
        {/* Glossy liquid marbling silk filament catching light */}
        <path
          d="M0,40 C135,6 265,74 400,40 C535,6 665,74 800,40 C935,6 1065,74 1200,40 C1335,6 1465,74 1600,40"
          stroke={`url(#${gradSilk})`}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M0,22 C140,62 260,-8 400,32 C540,72 660,-18 800,22 C940,62 1060,-8 1200,32 C1340,72 1460,-18 1600,22"
          stroke="#ffffff"
          strokeWidth="1.4"
          strokeOpacity="0.32"
          strokeLinecap="round"
        />
      </svg>
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
