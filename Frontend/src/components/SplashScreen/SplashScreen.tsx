import { Fragment, memo, useEffect, useRef, useState } from 'react'
import { FloatingIcons } from './FloatingIcons'
import { SplashLogo } from './SplashLogo'
import { WaveBackground } from './WaveBackground'
import './SplashScreen.css'

export interface SplashScreenProps {
  /** Called after the exit fade-out animation finishes. */
  onFinish?: () => void
  /** Minimum display duration in milliseconds before dismissal (default: 1500). */
  duration?: number
  /**
   * Optional readiness flag for real app bootstrapping (e.g. auth/config loading).
   * When false, progress smoothly eases up to 92% and waits until true.
   */
  isReady?: boolean
  /** Status label rendered beneath the progress bar (default: "Loading EduNexus..."). */
  statusText?: string
  /** Optional toggle to show numeric percentage beside status text (default: false). */
  showPercentage?: boolean
  /** Tagline keywords displayed beneath the brand title. */
  taglineItems?: readonly string[]
  /** Platform descriptor in the bottom pill badge. */
  footerPlatformText?: string
}

const DEFAULT_TAGLINE = ['Learn', 'Practice', 'Create', 'Excel'] as const
const EXIT_DURATION_MS = 420

/** Smooth ease-out cubic curve for natural progress feel. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export const SplashScreen = memo(function SplashScreen({
  onFinish,
  duration = 1500,
  isReady = true,
  statusText = 'Loading EduNexus...',
  showPercentage = false,
  taglineItems = DEFAULT_TAGLINE,
  footerPlatformText = 'Your Learning & Practice Platform',
}: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false)

  // DOM refs for 60fps GPU-composited progress updates with ZERO React re-renders
  const barFillRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const percentTextRef = useRef<HTMLSpanElement>(null)

  // Stable refs so inline callbacks/flags never restart the animation loop
  const onFinishRef = useRef(onFinish)
  const isReadyRef = useRef(isReady)
  const hasCompletedRef = useRef(false)

  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  useEffect(() => {
    isReadyRef.current = isReady
  }, [isReady])

  // Lock background page scrolling while splash overlay is mounted
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  // Zero-re-render rAF progress loop driving GPU transform: translate3d(...)
  useEffect(() => {
    const safeDuration = Math.max(400, duration)
    const startTime = performance.now()
    let rafId: number | null = null
    let exitTimerId: number | null = null
    let currentProgress = 0
    let lastAriaValue = -1
    let settleStart: number | null = null
    let progressAtSettle = 0

    const applyProgressToDom = (value: number) => {
      const clamped = Math.max(4, Math.min(100, value))
      if (barFillRef.current) {
        barFillRef.current.style.transform = `translate3d(${clamped - 100}%, 0, 0)`
      }

      const rounded = Math.round(value)
      if (rounded !== lastAriaValue) {
        lastAriaValue = rounded
        if (progressBarRef.current) {
          progressBarRef.current.setAttribute('aria-valuenow', String(rounded))
        }
        if (percentTextRef.current) {
          percentTextRef.current.textContent = `${rounded}%`
        }
      }
    }

    const finishSplash = () => {
      if (hasCompletedRef.current) return
      hasCompletedRef.current = true
      applyProgressToDom(100)
      setIsExiting(true)

      exitTimerId = window.setTimeout(() => {
        onFinishRef.current?.()
      }, EXIT_DURATION_MS)
    }

    const tick = (now: number) => {
      const elapsed = now - startTime
      const rawRatio = Math.min(1, elapsed / safeDuration)
      const ready = isReadyRef.current

      if (settleStart !== null) {
        const settleRatio = Math.min(1, (now - settleStart) / 350)
        currentProgress =
          progressAtSettle + (100 - progressAtSettle) * easeOutCubic(settleRatio)
        applyProgressToDom(currentProgress)

        if (settleRatio >= 1) {
          finishSplash()
          return
        }
      } else if (!ready) {
        if (rawRatio < 1) {
          currentProgress = Math.max(currentProgress, easeOutCubic(rawRatio) * 92)
        } else {
          const overtime = elapsed - safeDuration
          const asymptotic = 92 + 5 * (1 - Math.exp(-overtime / 4000))
          currentProgress = Math.max(currentProgress, asymptotic)
        }
        applyProgressToDom(currentProgress)
      } else if (rawRatio >= 1 && currentProgress < 99.5) {
        settleStart = now
        progressAtSettle = currentProgress
      } else {
        currentProgress = Math.max(currentProgress, easeOutCubic(rawRatio) * 100)
        applyProgressToDom(currentProgress)

        if (rawRatio >= 1) {
          finishSplash()
          return
        }
      }

      rafId = window.requestAnimationFrame(tick)
    }

    applyProgressToDom(0)
    rafId = window.requestAnimationFrame(tick)

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId)
      if (exitTimerId !== null) window.clearTimeout(exitTimerId)
    }
  }, [duration])

  return (
    <div
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- full-screen overlay status region, not an inline form <output>
      role="status"
      aria-live="polite"
      aria-busy={!isExiting}
      className={`edunexus-splash-root fixed inset-0 z-100 flex flex-col items-center justify-between overflow-hidden bg-[radial-gradient(ellipse_at_top,#081d58_0%,#030e30_48%,#02081f_100%)] text-white transition-opacity duration-400 ease-out ${
        isExiting ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background Luminous Waves & Floating Educational Icons */}
      <WaveBackground />
      <FloatingIcons />

      {/* Top Spacer for Vertical Optical Balance */}
      <div className="h-6 sm:h-10 shrink-0" aria-hidden="true" />

      {/* Main Centered Brand Hero */}
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-6 text-center">
        {/* Brand Emblem — Immediate opacity: 1 for instant First Paint */}
        <div className="edunexus-lcp-enter mb-1 sm:mb-2">
          <SplashLogo className="w-52 sm:w-64 md:w-72 h-auto" />
        </div>

        {/* Wordmark (LCP Element) — Renders immediately at opacity: 1 with zero delay */}
        <h1 className="edunexus-lcp-enter text-5xl sm:text-6xl md:text-[4.25rem] font-extrabold leading-none tracking-tight select-none">
          <span className="text-white">Edu</span>
          <span className="bg-linear-to-r from-[#00D8FF] via-[#4C8DFF] to-[#C278FF] bg-clip-text text-transparent">
            Nexus
          </span>
        </h1>

        {/* Tagline: ——— Learn • Practice • Create • Excel ——— */}
        <div className="edunexus-animate-enter edunexus-delay-1 mt-4 sm:mt-5 flex items-center justify-center gap-3 sm:gap-4">
          <span
            className="inline-block h-[1.5px] w-6 sm:w-12 rounded-full bg-linear-to-r from-transparent to-white/45"
            aria-hidden="true"
          />
          <p className="flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3.5 gap-y-1 text-sm sm:text-base md:text-[1.0625rem] font-medium tracking-wide text-slate-200/95">
            {taglineItems.map((item, index) => (
              <Fragment key={item}>
                <span>{item}</span>
                {index < taglineItems.length - 1 && (
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-[#9B6BFF] shadow-[0_0_8px_rgba(155,107,255,0.9)]"
                    aria-hidden="true"
                  />
                )}
              </Fragment>
            ))}
          </p>
          <span
            className="inline-block h-[1.5px] w-6 sm:w-12 rounded-full bg-linear-to-l from-transparent to-white/45"
            aria-hidden="true"
          />
        </div>

        {/* GPU-Composited Progress Bar (transform: translate3d, zero reflow / zero React re-renders) */}
        <div className="edunexus-animate-enter edunexus-delay-2 mt-10 sm:mt-12 flex w-full max-w-82.5 sm:max-w-95 flex-col items-center">
          <div
            ref={progressBarRef}
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- custom GPU-composited progress track with inner shimmer bar
            role="progressbar"
            aria-label={statusText}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            className="relative h-3 sm:h-3.5 w-full overflow-hidden rounded-full border border-[#6C7BFF]/45 bg-[#030b27]/85 p-[1.5px] shadow-[0_0_20px_rgba(0,180,255,0.16)]"
          >
            <div
              ref={barFillRef}
              className="edunexus-bar-fill edunexus-bar-shimmer relative h-full w-full overflow-hidden rounded-full bg-linear-to-r from-[#00F0FF] via-[#2B7FFF] to-[#B76EFF]"
            />
          </div>

          <p className="mt-3.5 text-sm sm:text-[0.95rem] font-medium tracking-wide text-slate-200/95">
            {statusText}
            {showPercentage && (
              <span ref={percentTextRef} className="ml-1.5 tabular-nums text-cyan-300">
                0%
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Bottom Footer Pill Badge */}
      <footer className="edunexus-animate-enter edunexus-delay-3 relative z-10 mb-6 sm:mb-8 px-4">
        <div className="inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-full border border-[#6E5CE6]/60 bg-[#041036]/88 px-5 sm:px-7 py-2.5 text-xs sm:text-sm text-slate-200/95 shadow-[0_0_24px_rgba(99,102,241,0.25)]">
          <span className="font-semibold tracking-wide text-white">EduNexus</span>
          <span className="text-slate-400/70" aria-hidden="true">
            |
          </span>
          <span className="font-normal text-slate-200/90">{footerPlatformText}</span>
        </div>
      </footer>
    </div>
  )
})

export default SplashScreen
