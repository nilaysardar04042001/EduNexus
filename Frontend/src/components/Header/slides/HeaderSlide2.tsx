import { memo } from 'react'
import { HeaderSlideFrame } from './HeaderSlideFrame'
import type { HeaderSlideProps } from './types'

/**
 * Slide 2 of the EduNexus header banner slider.
 * Blank transparent slide component ready for custom content.
 */
export const HeaderSlide2 = memo(function HeaderSlide2({
  index,
  total,
  isActive,
  ariaLabel,
  className,
  children,
}: HeaderSlideProps) {
  return (
    <HeaderSlideFrame
      slideId="slide-2"
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

export default HeaderSlide2
