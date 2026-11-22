import { memo } from 'react'
import type { ReactNode } from 'react'

export interface HeaderSlideFrameProps {
  /** Stable identifier for the slide (e.g. "slide-1") */
  slideId: string
  /** Zero-based position of the slide inside the slider track */
  index: number
  /** Total number of slides in the slider */
  total: number
  /** Whether this slide is currently active */
  isActive: boolean
  /** Gradient surface variant (0, 1, or 2) */
  variant?: 0 | 1 | 2
  /** Optional accessible label override (defaults to "<index + 1> of <total>") */
  ariaLabel?: string
  /** Optional extra CSS classes appended to the slide root */
  className?: string
  /** Optional slide body content */
  children?: ReactNode
}

/**
 * Shared accessible root frame for every EduNexus header banner slide component.
 * Renders the single `.edunexus-banner-slide` DOM element tracked by HeaderImageSlider.
 */
export const HeaderSlideFrame = memo(function HeaderSlideFrame({
  slideId,
  index,
  total,
  isActive,
  variant,
  ariaLabel,
  className = '',
  children,
}: HeaderSlideFrameProps) {
  const resolvedVariant = variant ?? index % 3

  return (
    <div
      className={`edunexus-banner-slide ${className}`.trim()}
      data-slide-id={slideId}
      data-slide-index={index}
      data-slide-variant={resolvedVariant}
      data-active={isActive ? 'true' : 'false'}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- WAI-ARIA APG carousel slide pattern
      role="group"
      aria-roledescription="slide"
      aria-label={ariaLabel ?? `${index + 1} of ${total}`}
    >
      {children}
    </div>
  )
})

export default HeaderSlideFrame
