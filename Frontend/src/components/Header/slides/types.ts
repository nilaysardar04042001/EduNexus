import type { ComponentType, ReactNode } from 'react'

export interface HeaderSlideProps {
  /** Zero-based position of the slide inside the slider track */
  index: number
  /** Total number of slides in the slider */
  total: number
  /** Whether this slide is currently the active slide */
  isActive: boolean
  /** Optional accessible label override for this slide */
  ariaLabel?: string
  /** Optional extra CSS classes appended to the slide root */
  className?: string
  /** Optional custom content rendered inside the slide */
  children?: ReactNode
}

export type HeaderSlideComponent = ComponentType<HeaderSlideProps>

export interface HeaderSlideItem {
  /** Unique stable key for the slide */
  id: string
  /** Optional accessible label override for this slide */
  label?: string
  /** Dedicated React component representing this slide */
  Component?: HeaderSlideComponent
  /** Optional ReactNode content (passed as children to Component, or wrapped in HeaderSlideFrame) */
  content?: ReactNode
}
