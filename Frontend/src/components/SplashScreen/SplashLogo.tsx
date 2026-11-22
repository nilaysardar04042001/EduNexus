import { memo, useId } from 'react'

interface SplashLogoProps {
  className?: string
}

export const SplashLogo = memo(function SplashLogo({
  className = 'w-56 sm:w-64 md:w-72 h-auto',
}: SplashLogoProps) {
  const uid = useId()
  const leftPageId = `${uid}-left-page`
  const leftCoverId = `${uid}-left-cover`
  const rightPageId = `${uid}-right-page`
  const rightCoverId = `${uid}-right-cover`
  const swooshId = `${uid}-swoosh`
  const innerArcId = `${uid}-inner-arc`
  const pixelCyanId = `${uid}-pixel-cyan`
  const pixelBlueId = `${uid}-pixel-blue`

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Lightweight filter-free ambient emblem glow */}
      <div
        className="edunexus-logo-glow pointer-events-none absolute inset-0 scale-125 rounded-full"
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 340 225"
        width="340"
        height="225"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`relative ${className}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={leftPageId} x1="78" y1="100" x2="170" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="68%" stopColor="#F1F8FF" />
            <stop offset="100%" stopColor="#B8DCFF" />
          </linearGradient>

          <linearGradient id={leftCoverId} x1="48" y1="130" x2="165" y2="195" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#E6F2FF" />
            <stop offset="100%" stopColor="#94C5FF" />
          </linearGradient>

          <linearGradient id={rightPageId} x1="172" y1="100" x2="255" y2="178" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00ECFF" />
            <stop offset="48%" stopColor="#00A8FF" />
            <stop offset="100%" stopColor="#005CE6" />
          </linearGradient>

          <linearGradient id={rightCoverId} x1="178" y1="175" x2="262" y2="145" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0D47A1" />
            <stop offset="100%" stopColor="#1D6BFF" />
          </linearGradient>

          <linearGradient id={swooshId} x1="175" y1="208" x2="285" y2="62" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#B66CFF" />
            <stop offset="35%" stopColor="#7C4DFF" />
            <stop offset="70%" stopColor="#2684FF" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>

          <linearGradient id={innerArcId} x1="172" y1="186" x2="242" y2="152" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          <linearGradient id={pixelCyanId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          <linearGradient id={pixelBlueId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>

        <g>
          {/* Floating Digital Pixel Squares */}
          <g>
            <rect x="234" y="36" width="10" height="10" rx="1.5" fill={`url(#${pixelCyanId})`} className="edunexus-pixel-1" />
            <rect x="256" y="31" width="13" height="13" rx="2" fill={`url(#${pixelCyanId})`} className="edunexus-pixel-2" />
            <rect x="280" y="22" width="12" height="12" rx="1.5" fill={`url(#${pixelBlueId})`} className="edunexus-pixel-3" />
            <rect x="247" y="53" width="9" height="9" rx="1.5" fill={`url(#${pixelBlueId})`} className="edunexus-pixel-4" />
            <rect x="268" y="49" width="16" height="16" rx="2.5" fill={`url(#${pixelCyanId})`} className="edunexus-pixel-1" />
          </g>

          {/* Graduation Cap */}
          <g className="edunexus-cap-levitate">
            <path d="M170 25L233 54L170 83L107 54L170 25Z" fill="#FFFFFF" />
            <path
              d="M132 69.5V88C132 91.5 151 101.5 170 107.5C189 101.5 208 91.5 208 88V69.5L170 87L132 69.5Z"
              fill="#F8FAFC"
            />
            <path d="M220.5 60V83" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="220.5" cy="85" r="3" fill="#FFFFFF" />
            <path
              d="M217.5 87.5H223.5L225 99.5C225 100.8 224 101.5 222.8 101.5H218.2C217 101.5 216 100.8 216 99.5L217.5 87.5Z"
              fill="#FFFFFF"
            />
          </g>

          {/* Open Book */}
          <g>
            <path
              d="M78 119.5C68 122 61 126.5 57.5 133L42 184C41.2 186.8 43.6 189.2 46.5 188.5C82 179.5 129.5 178 164.5 196.5C165.6 197.1 166.7 195.8 166 194.8C139 175.5 96.5 168.5 55.5 176.5L70.5 126C72 122.2 74.8 120.4 78 119.5Z"
              fill={`url(#${leftCoverId})`}
            />
            <path
              d="M93.5 99.5C128 99.5 154.5 113 168 130.5V187.5C143 169 104.5 164 68.5 169.5L88 105C89 101.6 91 99.5 93.5 99.5Z"
              fill={`url(#${leftPageId})`}
            />
            <path
              d="M246.5 99.5C212 99.5 185.5 113 172 130.5V187.5C197 169 235.5 164 271.5 169.5L252 105C251 101.6 249 99.5 246.5 99.5Z"
              fill={`url(#${rightPageId})`}
            />
            <path
              d="M261 119.5C267 121.5 272 125.5 274.5 131L284.5 159C279 162.5 274.5 164.5 270 166.2L260.5 126C259.6 122.4 259.5 120.5 261 119.5Z"
              fill={`url(#${rightCoverId})`}
              opacity="0.88"
            />
            <path
              d="M174 195.5C198 179.5 227 175.5 253 179.5C236 186 210 192 174 195.5Z"
              fill={`url(#${innerArcId})`}
              opacity="0.72"
            />
          </g>

          {/* Dynamic Orbit Swoosh */}
          <path
            d="M178 210C226 198 279 164 298 118C307 95 301 74 281 67C259 59.5 232 68 214 80.5C235 73 263 72 276 82C289 92 288 113 276 132C258 161 221 190 178 210Z"
            fill={`url(#${swooshId})`}
          />
        </g>
      </svg>
    </div>
  )
})

export default SplashLogo
