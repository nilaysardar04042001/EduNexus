import { memo, useId } from 'react'

/**
 * Pure decorative dual-theme Rainbow Marbled-Liquid Pigment Ribbons backdrop
 * and matching flowing rainbow bottom hairline edge.
 *
 * Uses mathematically seamless 2x-periodic (0..1200..2400) SVG pigment ribbons
 * animated strictly via GPU-composited transforms (zero layout/paint thrash),
 * clipped inside its own layer so navbar popovers are never clipped.
 */
export const NavbarAmbient = memo(function NavbarAmbient() {
  const uid = useId()
  const ribbonGradA = `${uid}-rainbow-a`
  const ribbonGradB = `${uid}-rainbow-b`
  const ribbonGradC = `${uid}-rainbow-c`
  const silkHighlight = `${uid}-rainbow-silk`

  return (
    <div className="edunexus-navbar-ambient" aria-hidden="true">
      {/* Continuous marbled liquid rainbow under-stream */}
      <span className="edunexus-marble-base" />
      <span className="edunexus-marble-swirl edunexus-marble-swirl-a" />
      <span className="edunexus-marble-swirl edunexus-marble-swirl-b" />

      {/* Stream A: Thick swelling rainbow pigment ribbons flowing left -> right */}
      <svg
        className="edunexus-marble-svg edunexus-marble-stream-a"
        viewBox="0 0 2400 120"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={ribbonGradA} x1="0" y1="0" x2="2400" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="7%" stopColor="#f97316" />
            <stop offset="14%" stopColor="#facc15" />
            <stop offset="21%" stopColor="#22c55e" />
            <stop offset="28%" stopColor="#06b6d4" />
            <stop offset="35%" stopColor="#3b82f6" />
            <stop offset="42%" stopColor="#8b5cf6" />
            <stop offset="46%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="57%" stopColor="#f97316" />
            <stop offset="64%" stopColor="#facc15" />
            <stop offset="71%" stopColor="#22c55e" />
            <stop offset="78%" stopColor="#06b6d4" />
            <stop offset="85%" stopColor="#3b82f6" />
            <stop offset="92%" stopColor="#8b5cf6" />
            <stop offset="96%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>

          <linearGradient id={ribbonGradB} x1="0" y1="0" x2="2400" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="8%" stopColor="#6366f1" />
            <stop offset="16%" stopColor="#d946ef" />
            <stop offset="25%" stopColor="#ef4444" />
            <stop offset="33%" stopColor="#f97316" />
            <stop offset="41%" stopColor="#facc15" />
            <stop offset="46%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="58%" stopColor="#6366f1" />
            <stop offset="66%" stopColor="#d946ef" />
            <stop offset="75%" stopColor="#ef4444" />
            <stop offset="83%" stopColor="#f97316" />
            <stop offset="91%" stopColor="#facc15" />
            <stop offset="96%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Primary thick marbled pigment band (C1-smooth, pinches & swells across exact 1200u period) */}
        <path
          d="M0,18 C200,-14 400,76 600,32 C800,-12 1000,50 1200,18 C1400,-14 1600,76 1800,32 C2000,-12 2200,50 2400,18 L2400,74 C2200,112 2000,32 1800,82 C1600,126 1400,36 1200,74 C1000,112 800,32 600,82 C400,126 200,36 0,74 Z"
          fill={`url(#${ribbonGradA})`}
          opacity="0.74"
        />

        {/* Secondary folded rainbow pigment veil */}
        <path
          d="M0,62 C180,108 420,10 600,62 C780,114 1020,16 1200,62 C1380,108 1620,10 1800,62 C1980,114 2220,16 2400,62"
          stroke={`url(#${ribbonGradB})`}
          strokeWidth="34"
          strokeLinecap="round"
          opacity="0.58"
        />
      </svg>

      {/* Stream B: Counter-flowing intertwined rainbow pigment ribbons (right -> left) */}
      <svg
        className="edunexus-marble-svg edunexus-marble-stream-b"
        viewBox="0 0 2400 120"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={ribbonGradC} x1="0" y1="0" x2="2400" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="7%" stopColor="#22c55e" />
            <stop offset="14%" stopColor="#0ea5e9" />
            <stop offset="22%" stopColor="#6366f1" />
            <stop offset="30%" stopColor="#a855f7" />
            <stop offset="37%" stopColor="#ec4899" />
            <stop offset="43%" stopColor="#ef4444" />
            <stop offset="47%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="57%" stopColor="#22c55e" />
            <stop offset="64%" stopColor="#0ea5e9" />
            <stop offset="72%" stopColor="#6366f1" />
            <stop offset="80%" stopColor="#a855f7" />
            <stop offset="87%" stopColor="#ec4899" />
            <stop offset="93%" stopColor="#ef4444" />
            <stop offset="97%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>

          <linearGradient id={silkHighlight} x1="0" y1="0" x2="2400" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="12%" stopColor="#fef08a" stopOpacity="0.58" />
            <stop offset="25%" stopColor="#67e8f9" stopOpacity="0.52" />
            <stop offset="38%" stopColor="#f0abfc" stopOpacity="0.56" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="62%" stopColor="#fef08a" stopOpacity="0.58" />
            <stop offset="75%" stopColor="#67e8f9" stopOpacity="0.52" />
            <stop offset="88%" stopColor="#f0abfc" stopOpacity="0.56" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* Counter-twisting fluid marbled ribbon */}
        <path
          d="M0,88 C210,126 390,-6 600,32 C810,70 990,50 1200,88 C1410,126 1590,-6 1800,32 C2010,70 2190,50 2400,88"
          stroke={`url(#${ribbonGradC})`}
          strokeWidth="28"
          strokeLinecap="round"
          opacity="0.66"
        />

        {/* Interlaced counter-ribbon lower fold */}
        <path
          d="M0,26 C180,26 270,104 480,94 C690,84 780,10 990,22 C1100,28 1140,26 1200,26 C1380,26 1470,104 1680,94 C1890,84 1980,10 2190,22 C2300,28 2340,26 2400,26"
          stroke={`url(#${ribbonGradC})`}
          strokeWidth="16"
          strokeLinecap="round"
          opacity="0.54"
        />

        {/* Glossy liquid marbling silk filament catching specular light */}
        <path
          d="M0,56 C200,4 400,108 600,56 C800,4 1000,108 1200,56 C1400,4 1600,108 1800,56 C2000,4 2200,108 2400,56"
          stroke={`url(#${silkHighlight})`}
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Stream C: Fine iridescent marbling highlight veins flowing at a 3rd harmonic speed */}
      <svg
        className="edunexus-marble-svg edunexus-marble-stream-c"
        viewBox="0 0 2400 120"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,34 C190,94 410,-12 600,48 C790,108 1010,-26 1200,34 C1390,94 1610,-12 1800,48 C1990,108 2210,-26 2400,34"
          stroke="#ffffff"
          strokeWidth="2.4"
          strokeOpacity="0.38"
          strokeLinecap="round"
        />
        <path
          d="M0,84 C210,18 390,118 600,66 C810,14 990,150 1200,84 C1410,18 1590,118 1800,66 C2010,14 2190,150 2400,84"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeOpacity="0.3"
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
