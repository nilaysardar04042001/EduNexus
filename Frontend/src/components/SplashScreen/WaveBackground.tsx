import { memo, useId } from 'react'

export const WaveBackground = memo(function WaveBackground() {
  const uid = useId()
  const waveBaseId = `${uid}-wave-base`
  const waveCyanId = `${uid}-wave-cyan`
  const waveVioletId = `${uid}-wave-violet`
  const rimCyanId = `${uid}-rim-cyan`
  const rimVioletId = `${uid}-rim-violet`

  return (
    <div
      className="edunexus-bg-layer pointer-events-none absolute inset-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Pure Radial-Gradient Nebula Glows (zero CSS blur filter cost) */}
      <div className="edunexus-nebula-tr absolute -top-32 -right-32 h-128 w-lg rounded-full" />
      <div className="edunexus-nebula-bl absolute bottom-[6%] -left-32 h-128 w-lg rounded-full" />
      <div className="edunexus-nebula-br absolute -bottom-24 -right-28 h-136 w-136 rounded-full" />

      {/* Luminous Layered Silk Waves (no expensive SVG feGaussianBlur filters) */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[56%] w-full min-w-190"
        viewBox="0 0 1440 520"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={waveBaseId} x1="0" y1="260" x2="1440" y2="480" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.65" />
            <stop offset="45%" stopColor="#0E2A6B" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.72" />
          </linearGradient>

          <linearGradient id={waveCyanId} x1="0" y1="120" x2="1440" y2="420" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.78" />
            <stop offset="32%" stopColor="#007BFF" stopOpacity="0.62" />
            <stop offset="68%" stopColor="#1D4ED8" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.72" />
          </linearGradient>

          <linearGradient id={waveVioletId} x1="0" y1="320" x2="1440" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9333EA" stopOpacity="0.78" />
            <stop offset="35%" stopColor="#6366F1" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#0EA5E9" stopOpacity="0.58" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.82" />
          </linearGradient>

          <linearGradient id={rimCyanId} x1="0" y1="150" x2="1440" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7DF9FF" stopOpacity="0.95" />
            <stop offset="28%" stopColor="#00C8FF" stopOpacity="0.85" />
            <stop offset="62%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id={rimVioletId} x1="0" y1="360" x2="1440" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.9" />
            <stop offset="38%" stopColor="#60A5FA" stopOpacity="0.55" />
            <stop offset="72%" stopColor="#38BDF8" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#D8B4FE" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Layer 1: Deep Ambient Back Wave */}
        <g className="edunexus-wave-1">
          <path
            d="M-60 120C140 165 260 320 510 385C780 455 1080 285 1500 140V540H-60V120Z"
            fill={`url(#${waveBaseId})`}
          />
          <path
            d="M-60 175C160 220 295 368 575 408C855 448 1135 305 1500 185V540H-60V175Z"
            fill={`url(#${waveCyanId})`}
            opacity="0.55"
          />
        </g>

        {/* Layer 2: Intersecting Luminous Purple/Cyan Silk Wave */}
        <g className="edunexus-wave-2">
          <path
            d="M-60 290C190 250 385 385 690 422C985 458 1190 265 1500 220V540H-60V290Z"
            fill={`url(#${waveVioletId})`}
            opacity="0.62"
          />
          <path
            d="M-60 390C240 280 515 440 845 415C1135 392 1280 315 1500 355V540H-60V390Z"
            fill="#041038"
            opacity="0.55"
          />
        </g>

        {/* Layer 3: Filter-Free Layered Neon Rim Highlights */}
        <g>
          {/* Cyan Rim Halo + Core */}
          <path
            d="M-40 178C175 230 315 388 610 424C895 458 1155 318 1480 218"
            stroke={`url(#${rimCyanId})`}
            strokeWidth="14"
            strokeOpacity="0.16"
            strokeLinecap="round"
          />
          <path
            d="M-40 178C175 230 315 388 610 424C895 458 1155 318 1480 218"
            stroke={`url(#${rimCyanId})`}
            strokeWidth="6"
            strokeOpacity="0.34"
            strokeLinecap="round"
          />
          <path
            d="M-40 178C175 230 315 388 610 424C895 458 1155 318 1480 218"
            stroke={`url(#${rimCyanId})`}
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Violet Rim Halo + Core */}
          <path
            d="M-40 365C225 270 485 425 815 408C1095 392 1265 265 1480 210"
            stroke={`url(#${rimVioletId})`}
            strokeWidth="12"
            strokeOpacity="0.15"
            strokeLinecap="round"
          />
          <path
            d="M-40 365C225 270 485 425 815 408C1095 392 1265 265 1480 210"
            stroke={`url(#${rimVioletId})`}
            strokeWidth="5"
            strokeOpacity="0.32"
            strokeLinecap="round"
          />
          <path
            d="M-40 365C225 270 485 425 815 408C1095 392 1265 265 1480 210"
            stroke={`url(#${rimVioletId})`}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>

        {/* Crisp Foreground Light Strand */}
        <path
          d="M-40 205C190 265 340 402 645 432C930 460 1185 340 1480 250"
          stroke={`url(#${rimCyanId})`}
          strokeWidth="1.2"
          strokeOpacity="0.55"
        />
      </svg>
    </div>
  )
})

export default WaveBackground
