import { memo } from 'react'
import { HeaderSlideFrame } from './HeaderSlideFrame'
import type { HeaderSlideProps } from './types'

/**
 * Slide 4 of the EduNexus header banner slider.
 * Blank transparent slide component ready for custom content.
 */
export const HeaderSlide4 = memo(function HeaderSlide4({
  index,
  total,
  isActive,
  ariaLabel,
  className,
  children,
}: HeaderSlideProps) {
  return (
    <HeaderSlideFrame
      slideId="slide-4"
      index={index}
      total={total}
      isActive={isActive}
      variant={0}
      ariaLabel={ariaLabel}
      className={className}
    >
      {children}
    </HeaderSlideFrame>
  )
})

export default HeaderSlide4
