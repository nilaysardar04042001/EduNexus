import { HeaderSlide1 } from './HeaderSlide1'
import { HeaderSlide2 } from './HeaderSlide2'
import { HeaderSlide3 } from './HeaderSlide3'
import { HeaderSlide4 } from './HeaderSlide4'
import { HeaderSlide5 } from './HeaderSlide5'
import { HeaderSlide6 } from './HeaderSlide6'
import { HeaderSlide7 } from './HeaderSlide7'
import { HeaderSlide8 } from './HeaderSlide8'
import type { HeaderSlideItem } from './types'

export { HeaderSlideFrame } from './HeaderSlideFrame'
export type { HeaderSlideFrameProps } from './HeaderSlideFrame'
export { HeaderSlide1 } from './HeaderSlide1'
export type { HeaderSlide1Props } from './HeaderSlide1'
export { HeaderSlide2 } from './HeaderSlide2'
export { HeaderSlide3 } from './HeaderSlide3'
export { HeaderSlide4 } from './HeaderSlide4'
export { HeaderSlide5 } from './HeaderSlide5'
export { HeaderSlide6 } from './HeaderSlide6'
export { HeaderSlide7 } from './HeaderSlide7'
export { HeaderSlide8 } from './HeaderSlide8'
export type { HeaderSlideComponent, HeaderSlideItem, HeaderSlideProps } from './types'

export const DEFAULT_HEADER_SLIDES: readonly HeaderSlideItem[] = [
  { id: 'slide-1', Component: HeaderSlide1 },
  { id: 'slide-2', Component: HeaderSlide2 },
  { id: 'slide-3', Component: HeaderSlide3 },
  { id: 'slide-4', Component: HeaderSlide4 },
  { id: 'slide-5', Component: HeaderSlide5 },
  { id: 'slide-6', Component: HeaderSlide6 },
  { id: 'slide-7', Component: HeaderSlide7 },
  { id: 'slide-8', Component: HeaderSlide8 },
]
