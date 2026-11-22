import { memo } from 'react'
import type { ReactNode } from 'react'
import { HeaderImage } from './HeaderImage'

export interface HeaderProps {
  /** Content for the left slot */
  left?: ReactNode
  /** Content for the center slot */
  center?: ReactNode
  /** Content for the right slot */
  right?: ReactNode
  /** Optional full-width content rendered inside the header */
  children?: ReactNode
  /** Whether to render the Cloudinary header-image banner section (default: true) */
  showBanner?: boolean
  /** Optional extra classes on the outer header element */
  className?: string
}

export const Header = memo(function Header({
  left,
  center,
  right,
  children,
  showBanner = true,
  className = '',
}: HeaderProps) {
  return (
    <header
      className={`relative flex min-h-[calc(100dvh-var(--edunexus-navbar-height,3.375rem))] w-full flex-col border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 ${className}`.trim()}
    >
      {showBanner && <HeaderImage />}

      <div className="grid w-full flex-1 grid-cols-[auto_1fr_auto] items-center gap-4 px-3 py-8 sm:px-4 sm:py-10 lg:gap-6 lg:px-6 lg:py-12">
        {children === undefined ? (
          <>
            <div className="flex min-w-0 items-center justify-start gap-2" data-header-slot="left">
              {left}
            </div>

            <div className="flex min-w-0 items-center justify-center gap-2" data-header-slot="center">
              {center}
            </div>

            <div className="flex min-w-0 items-center justify-end gap-2" data-header-slot="right">
              {right}
            </div>
          </>
        ) : (
          <div className="col-span-3 min-w-0">{children}</div>
        )}
      </div>
    </header>
  )
})

export default Header
