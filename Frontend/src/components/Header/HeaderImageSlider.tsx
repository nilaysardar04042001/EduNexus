import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'
import { faPause } from '@fortawesome/free-solid-svg-icons/faPause'
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import './HeaderImageSlider.css'
import { DEFAULT_HEADER_SLIDES, HeaderSlideFrame } from './slides'
import type { HeaderSlideComponent, HeaderSlideItem, HeaderSlideProps } from './slides'

export type { HeaderSlideComponent, HeaderSlideItem, HeaderSlideProps }

export interface HeaderImageSliderProps {
  /** Optional custom slides; defaults to the 8 modular HeaderSlide1-HeaderSlide8 components */
  slides?: readonly HeaderSlideItem[]
  /** Auto-advance interval in milliseconds (default: 4000) */
  intervalMs?: number
}

type FaIconDef = typeof faChevronLeft

function SliderIcon({ icon }: { icon: FaIconDef }) {
  const [width, height, , , svgPathData] = icon.icon
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      focusable="false"
      className="edunexus-banner-icon"
    >
      {Array.isArray(svgPathData) ? (
        svgPathData.map((d) => <path key={d} fill="currentColor" d={d} />)
      ) : (
        <path fill="currentColor" d={svgPathData} />
      )}
    </svg>
  )
}

/**
 * Auto-advancing blank transparent slide overlay (light green + yellow + sky blue)
 * rendered over the HeaderImage banner.
 * - Pauses automatically when the cursor reaches the slider, on keyboard focus, or when tab is hidden.
 * - Built on native horizontal CSS scroll-snap with accessible Previous/Next, Marker, and Pause/Play controls.
 */
export const HeaderImageSlider = memo(function HeaderImageSlider({
  slides = DEFAULT_HEADER_SLIDES,
  intervalMs = 4000,
}: HeaderImageSliderProps) {
  const slideCount = slides.length
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPointerHovering, setIsPointerHovering] = useState(false)
  const [isTouchDragging, setIsTouchDragging] = useState(false)
  const [isKeyboardFocusWithin, setIsKeyboardFocusWithin] = useState(false)
  const [isManuallyPaused, setIsManuallyPaused] = useState(false)
  const [isTabHidden, setIsTabHidden] = useState(
    () => typeof document !== 'undefined' && document.hidden,
  )
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [statusMessage, setStatusMessage] = useState('')

  const activeIndexRef = useRef(0)
  const pendingTargetRef = useRef<number | null>(null)
  const pendingStartScrollLeftRef = useRef<number | null>(null)
  const lastSettledIndexRef = useRef(0)
  const lastChangeWasUserRef = useRef(false)

  const isAutoPaused =
    slideCount <= 1 ||
    isPointerHovering ||
    isTouchDragging ||
    isKeyboardFocusWithin ||
    isManuallyPaused ||
    isTabHidden ||
    prefersReducedMotion

  // Pause automatically on mouse/pen hover, active touch drag, or keyboard (:focus-visible) focus
  useEffect(() => {
    const sliderEl = sliderRef.current
    if (!sliderEl) return undefined

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        setIsPointerHovering(true)
      }
    }
    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        setIsPointerHovering(false)
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        setIsTouchDragging(true)
      }
    }
    const onTouchRelease = () => {
      setIsTouchDragging(false)
    }
    const onFocusIn = (event: FocusEvent) => {
      if (event.target instanceof Element && event.target.matches(':focus-visible')) {
        setIsKeyboardFocusWithin(true)
      }
    }
    const onFocusOut = (event: FocusEvent) => {
      if (!sliderEl.contains(event.relatedTarget as Node | null)) {
        setIsKeyboardFocusWithin(false)
      }
    }

    sliderEl.addEventListener('pointerenter', onPointerEnter)
    sliderEl.addEventListener('pointerleave', onPointerLeave)
    sliderEl.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onTouchRelease)
    window.addEventListener('pointercancel', onTouchRelease)
    sliderEl.addEventListener('focusin', onFocusIn)
    sliderEl.addEventListener('focusout', onFocusOut)

    return () => {
      sliderEl.removeEventListener('pointerenter', onPointerEnter)
      sliderEl.removeEventListener('pointerleave', onPointerLeave)
      sliderEl.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onTouchRelease)
      window.removeEventListener('pointercancel', onTouchRelease)
      sliderEl.removeEventListener('focusin', onFocusIn)
      sliderEl.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  // Sync reduced-motion media query dynamically
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }
    mq.addEventListener('change', onChange)
    return () => {
      mq.removeEventListener('change', onChange)
    }
  }, [])

  // Pause auto-advance when tab is backgrounded
  useEffect(() => {
    const onVisibilityChange = () => {
      setIsTabHidden(document.hidden)
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  const scrollToSlide = useCallback(
    (targetIndex: number, isUserInitiated: boolean) => {
      const track = trackRef.current
      if (!track || slideCount === 0) return

      const normalized = ((targetIndex % slideCount) + slideCount) % slideCount
      const targetEl = track.children.item(normalized)
      if (!(targetEl instanceof HTMLElement)) return

      // Exact inline scroll target relative to the track (position: relative), never scrolls the page
      const targetScrollLeft = Math.max(
        0,
        targetEl.offsetLeft - (track.clientWidth - targetEl.offsetWidth) / 2,
      )

      // If already aligned on the requested slide, avoid leaving pendingTargetRef stuck waiting for scrollend
      if (Math.abs(targetScrollLeft - track.scrollLeft) < 1) {
        pendingTargetRef.current = null
        pendingStartScrollLeftRef.current = null
        activeIndexRef.current = normalized
        setActiveIndex(normalized)
        return
      }

      pendingTargetRef.current = prefersReducedMotion ? null : normalized
      pendingStartScrollLeftRef.current = prefersReducedMotion ? null : track.scrollLeft
      lastChangeWasUserRef.current = isUserInitiated
      activeIndexRef.current = normalized
      setActiveIndex(normalized)

      track.scrollTo({
        left: targetScrollLeft,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
    },
    [prefersReducedMotion, slideCount],
  )

  // Track nearest slide on scroll (rAF-throttled) and settle on scrollend (with debounced fallback)
  useEffect(() => {
    const track = trackRef.current
    if (!track || slideCount <= 1) return undefined

    let rafId: number | null = null
    let fallbackTimerId: number | null = null
    const supportsScrollEnd = 'onscrollend' in window

    const getNearestSlideIndex = (): number => {
      const trackCenter = track.scrollLeft + track.clientWidth / 2
      let nearestIdx = 0
      let minDist = Number.POSITIVE_INFINITY

      for (let i = 0; i < track.children.length; i += 1) {
        const slideEl = track.children.item(i)
        if (!(slideEl instanceof HTMLElement)) continue
        const slideCenter = slideEl.offsetLeft + slideEl.offsetWidth / 2
        const dist = Math.abs(slideCenter - trackCenter)
        if (dist < minDist) {
          minDist = dist
          nearestIdx = i
        }
      }
      return nearestIdx
    }

    const handleSettle = () => {
      // Ignore stale scrollend arriving at the exact start position of a newly requested scroll
      if (
        pendingTargetRef.current !== null &&
        pendingStartScrollLeftRef.current !== null &&
        Math.abs(track.scrollLeft - pendingStartScrollLeftRef.current) < 1
      ) {
        return
      }

      const settledIdx = getNearestSlideIndex()
      pendingTargetRef.current = null
      pendingStartScrollLeftRef.current = null

      if (settledIdx !== activeIndexRef.current) {
        activeIndexRef.current = settledIdx
        setActiveIndex(settledIdx)
      }

      if (settledIdx !== lastSettledIndexRef.current) {
        lastSettledIndexRef.current = settledIdx
        if (lastChangeWasUserRef.current) {
          setStatusMessage(`Slide ${settledIdx + 1} of ${slideCount}`)
        }
      }
      lastChangeWasUserRef.current = false
    }

    const handleScroll = () => {
      if (pendingTargetRef.current === null && rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null
          const nearest = getNearestSlideIndex()
          if (nearest !== activeIndexRef.current) {
            lastChangeWasUserRef.current = true
            activeIndexRef.current = nearest
            setActiveIndex(nearest)
          }
        })
      }

      if (!supportsScrollEnd) {
        if (fallbackTimerId !== null) {
          window.clearTimeout(fallbackTimerId)
        }
        fallbackTimerId = window.setTimeout(() => {
          fallbackTimerId = null
          handleSettle()
        }, 140)
      }
    }

    track.addEventListener('scroll', handleScroll, { passive: true })
    if (supportsScrollEnd) {
      track.addEventListener('scrollend', handleSettle)
    }

    // Re-align active slide cleanly on viewport resize or mobile/tablet orientation changes
    let resizeRafId: number | null = null
    let lastTrackWidth = track.clientWidth
    const resizeObserver = new ResizeObserver(() => {
      if (track.clientWidth === lastTrackWidth) return
      lastTrackWidth = track.clientWidth
      if (resizeRafId !== null) return
      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = null
        const activeSlideEl = track.children.item(activeIndexRef.current)
        if (!(activeSlideEl instanceof HTMLElement)) return
        const targetScrollLeft = Math.max(
          0,
          activeSlideEl.offsetLeft - (track.clientWidth - activeSlideEl.offsetWidth) / 2,
        )
        if (Math.abs(targetScrollLeft - track.scrollLeft) >= 1) {
          pendingTargetRef.current = null
          pendingStartScrollLeftRef.current = null
          track.scrollTo({ left: targetScrollLeft, behavior: 'auto' })
        }
      })
    })
    resizeObserver.observe(track)

    return () => {
      resizeObserver.disconnect()
      track.removeEventListener('scroll', handleScroll)
      if (supportsScrollEnd) {
        track.removeEventListener('scrollend', handleSettle)
      }
      if (resizeRafId !== null) cancelAnimationFrame(resizeRafId)
      if (rafId !== null) cancelAnimationFrame(rafId)
      if (fallbackTimerId !== null) window.clearTimeout(fallbackTimerId)
    }
  }, [slideCount])

  // Automatic slide advancement (paused on cursor hover, keyboard focus, manual pause, hidden tab, or reduced motion)
  useEffect(() => {
    if (isAutoPaused) return undefined

    const timerId = window.setInterval(() => {
      const baseIndex = pendingTargetRef.current ?? activeIndexRef.current
      scrollToSlide(baseIndex + 1, false)
    }, Math.max(1500, intervalMs))

    return () => {
      window.clearInterval(timerId)
    }
  }, [intervalMs, isAutoPaused, scrollToSlide])

  const handlePrevious = useCallback(() => {
    const baseIndex = pendingTargetRef.current ?? activeIndexRef.current
    scrollToSlide(baseIndex - 1, true)
  }, [scrollToSlide])

  const handleNext = useCallback(() => {
    const baseIndex = pendingTargetRef.current ?? activeIndexRef.current
    scrollToSlide(baseIndex + 1, true)
  }, [scrollToSlide])

  const handleMarkerClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const idx = Number(event.currentTarget.dataset.slideIndex)
      if (Number.isInteger(idx) && idx >= 0 && idx < slideCount) {
        scrollToSlide(idx, true)
      }
    },
    [scrollToSlide, slideCount],
  )

  const handleTogglePlay = useCallback(() => {
    setIsManuallyPaused((prev) => !prev)
  }, [])

  return (
    <div
      ref={sliderRef}
      className="edunexus-banner-slider"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- nested carousel region inside <section data-header-section="header-image">
      role="region"
      aria-roledescription="carousel"
      aria-label="Header banner slides"
      data-paused={isAutoPaused ? 'true' : 'false'}
      data-manual-paused={isManuallyPaused ? 'true' : 'false'}
    >
      {/* Previous / Next Controls (before track in DOM order per carousel guidance) */}
      <div className="edunexus-banner-nav-controls">
        <button
          type="button"
          className="edunexus-banner-arrow"
          aria-label="Previous slide"
          onClick={handlePrevious}
        >
          <SliderIcon icon={faChevronLeft} />
        </button>
        <button
          type="button"
          className="edunexus-banner-arrow"
          aria-label="Next slide"
          onClick={handleNext}
        >
          <SliderIcon icon={faChevronRight} />
        </button>
      </div>

      {/* Native Horizontal Scroll-Snap Track of Blank Transparent Slides */}
      <div
        ref={trackRef}
        className="edunexus-banner-track"
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable carousel track must be keyboard-focusable
        tabIndex={0}
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- WAI-ARIA APG carousel slides track group
        role="group"
        aria-label="Slides"
      >
        {slides.map((slide, index) => {
          const SlideComponent = slide.Component
          if (SlideComponent) {
            return (
              <SlideComponent
                key={slide.id}
                index={index}
                total={slideCount}
                isActive={activeIndex === index}
                ariaLabel={slide.label}
              >
                {slide.content}
              </SlideComponent>
            )
          }

          return (
            <HeaderSlideFrame
              key={slide.id}
              slideId={slide.id}
              index={index}
              total={slideCount}
              isActive={activeIndex === index}
              ariaLabel={slide.label}
            >
              {slide.content}
            </HeaderSlideFrame>
          )
        })}
      </div>

      {/* Polite status region for assistive technology */}
      <output className="sr-only" aria-live="polite">
        {statusMessage}
      </output>

      {/* Bottom Slide Markers (8 multi-color dots always visible) + Preserved Pause / Play Button */}
      <div className="edunexus-banner-footer">
        <nav className="edunexus-banner-markers" aria-label="Choose a slide">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              data-slide-index={index}
              data-dot-color={index % 8}
              className="edunexus-banner-marker"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeIndex === index ? 'true' : undefined}
              onClick={handleMarkerClick}
            >
              <span className="edunexus-banner-marker-dot" aria-hidden="true" />
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="edunexus-banner-play-toggle"
          aria-label={isManuallyPaused ? 'Play slides' : 'Pause slides'}
          onClick={handleTogglePlay}
        >
          <SliderIcon icon={isManuallyPaused ? faPlay : faPause} />
        </button>
      </div>
    </div>
  )
})

export default HeaderImageSlider
