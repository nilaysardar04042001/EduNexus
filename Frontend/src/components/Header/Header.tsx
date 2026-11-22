import { memo } from 'react'
import type { ReactNode } from 'react'

export interface HeaderProps {
  /** Content for the left slot */
  left?: ReactNode
  /** Content for the center slot */
  center?: ReactNode
  /** Content for the right slot */
  right?: ReactNode
  /** Optional full-width content rendered inside the header */
  children?: ReactNode
  /** Optional extra classes on the outer header element */
  className?: string
}

export const Header = memo(function Header({
  left,
  center,
  right,
  children,
  className = '',
}: HeaderProps) {
  return (
    <header
      className={`relative w-full border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 ${className}`.trim()}
    >
      <div className="grid min-h-36 w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-3 py-6 sm:min-h-48 sm:px-4 sm:py-8 lg:min-h-60 lg:gap-6 lg:px-6 lg:py-10">
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
