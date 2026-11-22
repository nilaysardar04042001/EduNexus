import { memo } from 'react'
import { HeaderSlideFrame } from './HeaderSlideFrame'
import type { HeaderSlideProps } from './types'

/**
 * Slide 3 of the EduNexus header banner slider.
 * Blank transparent slide component ready for custom content.
 */
export const HeaderSlide3 = memo(function HeaderSlide3({
  index,
  total,
  isActive,
  ariaLabel,
  className,
  children,
}: HeaderSlideProps) {
  return (
    <HeaderSlideFrame
      slideId="slide-3"
      index={index}
      total={total}
      isActive={isActive}
      variant={2}
      ariaLabel={ariaLabel}
      className={className}
    >
      {children}
    </HeaderSlideFrame>
  )
})

export default HeaderSlide3
