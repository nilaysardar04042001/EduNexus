import { memo } from 'react'
import { HeaderSlideFrame } from './HeaderSlideFrame'
import type { HeaderSlideProps } from './types'

/**
 * Slide 5 of the EduNexus header banner slider.
 * Blank transparent slide component ready for custom content.
 */
export const HeaderSlide5 = memo(function HeaderSlide5({
  index,
  total,
  isActive,
  ariaLabel,
  className,
  children,
}: HeaderSlideProps) {
  return (
    <HeaderSlideFrame
      slideId="slide-5"
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

export default HeaderSlide5
