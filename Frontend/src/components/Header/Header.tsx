import { memo } from 'react'
import type { ReactNode } from 'react'
import { HeaderCards } from './HeaderCards'
import { HeaderImage } from './HeaderImage'
import type { HeaderSlideItem } from './slides'

export interface HeaderProps {
  /** Content for the left card */
  left?: ReactNode
  /** Content for the middle card */
  middle?: ReactNode
  /** Alias for middle card content */
  center?: ReactNode
  /** Content for the right card */
  right?: ReactNode
  /** Optional full-width content replacing the default three-card grid */
  children?: ReactNode
  /** Optional custom overlay slides for the header banner slider */
  slides?: readonly HeaderSlideItem[]
  /** Whether to render the Cloudinary header-image banner section (default: true) */
  showBanner?: boolean
  /** Optional extra classes on the outer header element */
  className?: string
}

export const Header = memo(function Header({
  left,
  middle,
  center,
  right,
  children,
  slides,
  showBanner = true,
  className = '',
}: HeaderProps) {
  return (
    <header
      className={`relative flex min-h-[calc(100dvh-var(--edunexus-navbar-height,3.375rem))] w-full flex-col border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 ${className}`.trim()}
    >
      {showBanner && <HeaderImage slides={slides} />}

      {children === undefined ? (
        <HeaderCards left={left} middle={middle ?? center} right={right} />
      ) : (
        <div className="flex w-full flex-1 flex-col px-2 py-3 sm:px-2.5 sm:py-3.5 lg:px-3.5 lg:py-4">
          {children}
        </div>
      )}
    </header>
  )
})

export default Header
