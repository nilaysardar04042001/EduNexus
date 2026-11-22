import { memo } from 'react'
import { HeaderSlideFrame } from './HeaderSlideFrame'
import type { HeaderSlideProps } from './types'

/**
 * Slide 8 of the EduNexus header banner slider.
 * Blank transparent slide component ready for custom content.
 */
export const HeaderSlide8 = memo(function HeaderSlide8({
  index,
  total,
  isActive,
  ariaLabel,
  className,
  children,
}: HeaderSlideProps) {
  return (
    <HeaderSlideFrame
      slideId="slide-8"
      index={index}
      total={total}
      isActive={isActive}
      variant={1}
      ariaLabel={ariaLabel}
      className={className}
    >
      {children}
    </HeaderSlideFrame>
  )
})

export default HeaderSlide8
