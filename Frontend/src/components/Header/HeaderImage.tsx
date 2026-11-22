import { memo } from 'react'
import {
  EDUNEXUS_HEADER_BANNER_DEFAULT_URL,
  EDUNEXUS_HEADER_BANNER_HEIGHT,
  EDUNEXUS_HEADER_BANNER_SIZES,
  EDUNEXUS_HEADER_BANNER_SRCSET,
  EDUNEXUS_HEADER_BANNER_WIDTH,
} from '../../utils/cloudinary'

export interface HeaderImageProps {
  /** Optional custom accessible description for the banner image */
  alt?: string
  /** Optional extra classes on the outer header-image section */
  className?: string
}

/**
 * Responsive 3:1 EduNexus header-image banner served from Cloudinary CDN (`Header` folder)
 * with automatic format/quality negotiation (`f_auto,q_auto`), responsive `srcSet`,
 * explicit intrinsic dimensions (0 CLS), and elevated `fetchPriority="high"` for LCP.
 */
export const HeaderImage = memo(function HeaderImage({
  alt = 'EduNexus — Learn, Practice, Create, Excel',
  className = '',
}: HeaderImageProps) {
  return (
    <section
      aria-label="EduNexus banner"
      data-header-section="header-image"
      className={`w-full px-3 pt-4 sm:px-4 sm:pt-5 lg:px-6 lg:pt-6 ${className}`.trim()}
    >
      <div className="relative aspect-3/1 w-full overflow-hidden rounded-2xl border border-sky-400/30 bg-[#050b2b] shadow-[0_14px_38px_-14px_rgba(14,165,233,0.34)] ring-1 ring-inset ring-white/15 [contain:layout_style_paint] sm:rounded-3xl dark:border-cyan-400/25 dark:shadow-[0_18px_46px_-14px_rgba(0,0,0,0.78)]">
        <img
          src={EDUNEXUS_HEADER_BANNER_DEFAULT_URL}
          srcSet={EDUNEXUS_HEADER_BANNER_SRCSET}
          sizes={EDUNEXUS_HEADER_BANNER_SIZES}
          alt={alt}
          width={EDUNEXUS_HEADER_BANNER_WIDTH}
          height={EDUNEXUS_HEADER_BANNER_HEIGHT}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          crossOrigin="anonymous"
          className="block h-full w-full object-cover select-none"
        />
      </div>
    </section>
  )
})

export default HeaderImage
