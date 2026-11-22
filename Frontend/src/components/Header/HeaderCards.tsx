import { memo } from 'react'
import type { ReactNode } from 'react'

export interface HeaderCardsProps {
  /** Content for the left card */
  left?: ReactNode
  /** Content for the middle card */
  middle?: ReactNode
  /** Content for the right card */
  right?: ReactNode
  /** Optional extra classes on the outer cards section */
  className?: string
}

const CARD_PARENT_CLASS_NAME =
  'grid w-full flex-1 grid-cols-1 gap-2.5 rounded-2xl border border-sky-300/60 bg-slate-50 bg-[linear-gradient(115deg,#7dd3fc_0%,#86efac_25%,#dfb14b_50%,#fca5a5_75%,#7dd3fc_100%)] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_12px_30px_-16px_rgba(15,23,42,0.18)] contain-[layout_style_paint] sm:gap-3 sm:rounded-3xl sm:p-2 md:grid-cols-3 lg:gap-3.5 lg:p-2.5 dark:border-sky-400/25 dark:bg-slate-950 dark:bg-[linear-gradient(115deg,rgba(56,189,248,0.38)_0%,rgba(134,239,172,0.3)_25%,rgba(217,164,38,0.36)_50%,rgba(252,165,165,0.32)_75%,rgba(56,189,248,0.38)_100%)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_16px_36px_-14px_rgba(0,0,0,0.72)]'

const CARD_CLASS_NAME =
  'flex h-full min-h-40 min-w-0 flex-col rounded-xl border border-white/85 bg-white/92 p-4 shadow-[0_10px_28px_-14px_rgba(15,23,42,0.2)] ring-1 ring-inset ring-white contain-[layout_style_paint] motion-safe:transition-[transform,border-color,box-shadow] motion-safe:duration-200 hover:-translate-y-0.5 hover:border-sky-400/70 hover:shadow-[0_16px_34px_-14px_rgba(14,165,233,0.3)] sm:min-h-48 sm:rounded-2xl sm:p-5 md:min-h-64 lg:min-h-72 lg:p-6 dark:border-white/15 dark:bg-slate-900/90 dark:shadow-[0_14px_34px_-14px_rgba(0,0,0,0.75)] dark:ring-white/10 dark:hover:border-cyan-400/50 dark:hover:shadow-[0_18px_38px_-14px_rgba(6,182,212,0.26)]'

/**
 * Responsive three-column blank card grid (left, middle, right) beneath the HeaderImage banner,
 * framed inside a sky -> light green -> yellow ochre -> light red -> sky gradient card parent.
 */
export const HeaderCards = memo(function HeaderCards({
  left,
  middle,
  right,
  className = '',
}: HeaderCardsProps) {
  return (
    <section
      aria-label="Header cards"
      data-header-section="header-cards"
      className={`flex w-full flex-1 flex-col px-2 py-3 sm:px-2.5 sm:py-3.5 lg:px-3.5 lg:py-4 ${className}`.trim()}
    >
      <div className={CARD_PARENT_CLASS_NAME} data-header-cards-parent="true">
        <div className={CARD_CLASS_NAME} data-header-card="left">
          {left}
        </div>

        <div className={CARD_CLASS_NAME} data-header-card="middle">
          {middle}
        </div>

        <div className={CARD_CLASS_NAME} data-header-card="right">
          {right}
        </div>
      </div>
    </section>
  )
})

export default HeaderCards
