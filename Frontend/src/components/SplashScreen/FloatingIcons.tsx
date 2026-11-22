import { memo, useId } from 'react'

export const FloatingIcons = memo(function FloatingIcons() {
  const chartGradId = `${useId()}-chart-grad`

  return (
    <div
      className="edunexus-bg-layer pointer-events-none absolute inset-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Top-Left: Coding Laptop (</>) */}
      <div className="edunexus-float-a edunexus-icon-tilt-n14 absolute top-[11%] left-[6%] sm:left-[10%] md:left-[12%] opacity-40 sm:opacity-50">
        <svg
          className="h-14 w-16 sm:h-20 sm:w-24 md:h-24 md:w-28 text-[#3474FF]"
          viewBox="0 0 96 74"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="14" y="8" width="68" height="46" rx="4.5" stroke="currentColor" strokeWidth="3" />
          <path d="M37 25L30 31L37 37" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M59 25L66 31L59 37" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M51 22L45 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path
            d="M6 59H90L85 65C84.2 66 83 66.5 81.8 66.5H14.2C13 66.5 11.8 66 11 65L6 59Z"
            fill="currentColor"
            fillOpacity="0.85"
          />
        </svg>
      </div>

      {/* Mid-Left: Stacked Books */}
      <div className="edunexus-float-b edunexus-icon-tilt-n8 absolute top-[34%] left-[4%] sm:left-[7%] md:left-[9%] opacity-35 sm:opacity-45">
        <svg
          className="h-14 w-16 sm:h-18 sm:w-22 md:h-20 md:w-24 text-[#2F6BFF]"
          viewBox="0 0 90 74"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 20L46 10L78 21L48 31L16 20Z" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
          <path
            d="M16 20V31C16 33 17.5 34.5 19.5 35.2L48 45L78 34"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M48 31V45" stroke="currentColor" strokeWidth="2.2" />
          <path d="M12 37L19 34.8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <path
            d="M12 37V49C12 51 13.5 52.5 15.5 53.2L46 64L76 53V42"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 37L46 49L76 38.5" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Top-Right: Glowing Lightbulb */}
      <div className="edunexus-float-b edunexus-icon-tilt-10 absolute top-[9%] right-[7%] sm:right-[11%] md:right-[13%] opacity-40 sm:opacity-50">
        <svg
          className="h-14 w-14 sm:h-20 sm:w-20 md:h-24 md:w-24 text-[#6B8AFF]"
          viewBox="0 0 88 94"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M44 6V14" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M18 18L24 23" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M70 18L64 23" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M10 42H18" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M70 42H78" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M20 62L25 58" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M68 62L63 58" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          <path
            d="M44 21C32.4 21 23 30.2 23 41.6C23 49.4 27.3 56.1 33.8 59.5C35.2 60.3 36 61.8 36 63.4V68H52V63.4C52 61.8 52.8 60.3 54.2 59.5C60.7 56.1 65 49.4 65 41.6C65 30.2 55.6 21 44 21Z"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <path d="M38 43C38 39.5 41 37 44 37C47 37 50 39.5 50 43" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M44 43V67" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M36 74H52" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M38 80H50" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M41 85.5H47" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* Mid-Right: Certificate / Award Badge */}
      <div className="edunexus-float-a edunexus-icon-tilt-n10 absolute top-[28%] right-[4%] sm:right-[7%] md:right-[9%] opacity-35 sm:opacity-45">
        <svg
          className="h-14 w-16 sm:h-18 sm:w-22 md:h-20 md:w-24 text-[#5A7BFF]"
          viewBox="0 0 92 78"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M52 58H14C10.7 58 8 55.3 8 52V16C8 12.7 10.7 10 14 10H78C81.3 10 84 12.7 84 16V52C84 55.3 81.3 58 78 58H72"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path d="M21 24H55" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M21 34H47" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M21 44H39" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="62" cy="46" r="10.5" stroke="currentColor" strokeWidth="2.8" />
          <path d="M57 55.5L54 71L62 66.5L70 71L67 55.5" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Lower-Mid-Right: Video Play Icon */}
      <div className="edunexus-float-b hidden sm:block absolute top-[43%] right-[13%] md:right-[15%] opacity-35 md:opacity-45">
        <svg
          className="h-11 w-14 md:h-13 md:w-16 text-[#4A8DFF]"
          viewBox="0 0 68 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="3" y="3" width="62" height="42" rx="8" stroke="currentColor" strokeWidth="2.8" />
          <path d="M28 15.5L44 24L28 32.5V15.5Z" fill="currentColor" fillOpacity="0.85" />
        </svg>
      </div>

      {/* Bottom-Right: Growth / Analytics Bar Chart */}
      <div className="edunexus-float-a hidden sm:block absolute top-[51%] right-[5%] md:right-[7%] opacity-45 md:opacity-55">
        <svg
          className="h-14 w-16 md:h-18 md:w-20"
          viewBox="0 0 80 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={chartGradId} x1="10" y1="64" x2="72" y2="12" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
          <path d="M12 45C28 40 46 28 65 11" stroke={`url(#${chartGradId})`} strokeWidth="3.2" strokeLinecap="round" />
          <path d="M55 10.5H66.5V22" stroke={`url(#${chartGradId})`} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="12" y="53" width="10" height="14" rx="2" fill={`url(#${chartGradId})`} />
          <rect x="27" y="45" width="10" height="22" rx="2" fill={`url(#${chartGradId})`} />
          <rect x="42" y="36" width="10" height="31" rx="2" fill={`url(#${chartGradId})`} />
          <rect x="57" y="26" width="11" height="41" rx="2" fill={`url(#${chartGradId})`} />
        </svg>
      </div>
    </div>
  )
})

export default FloatingIcons
