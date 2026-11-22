import { memo } from 'react'
import {
  EDUNEXUS_HEADER_BANNER_MOBILE_DEFAULT_URL,
  EDUNEXUS_HEADER_BANNER_MOBILE_HEIGHT,
  EDUNEXUS_HEADER_BANNER_MOBILE_SIZES,
  EDUNEXUS_HEADER_BANNER_MOBILE_SRCSET,
  EDUNEXUS_HEADER_BANNER_MOBILE_WIDTH,
  EDUNEXUS_HEADER_BANNER_TABLET_HEIGHT,
  EDUNEXUS_HEADER_BANNER_TABLET_SIZES,
  EDUNEXUS_HEADER_BANNER_TABLET_SRCSET,
  EDUNEXUS_HEADER_BANNER_TABLET_WIDTH,
  EDUNEXUS_HEADER_BANNER_WIDE_HEIGHT,
  EDUNEXUS_HEADER_BANNER_WIDE_SIZES,
  EDUNEXUS_HEADER_BANNER_WIDE_SRCSET,
  EDUNEXUS_HEADER_BANNER_WIDE_WIDTH,
} from '../../utils/cloudinary'
import { HeaderImageSlider } from './HeaderImageSlider'
import type { HeaderSlideItem } from './slides'

export interface HeaderImageProps {
  /** Optional custom accessible description for the banner image */
  alt?: string
  /** Optional custom overlay slides; defaults to the 8 modular HeaderSlide1-HeaderSlide8 components */
  slides?: readonly HeaderSlideItem[]
  /** Optional extra classes on the outer header-image section */
  className?: string
}

/**
 * Responsive full-bleed EduNexus header-image banner served from Cloudinary CDN (`Header` folder),
 * using intrinsic min-height grid stacking so rich slide content scales cleanly without clipping
 * across Mobile, Tablet, Laptop, and Desktop, with an auto-advancing 8-slide transparent overlay.
 */
export const HeaderImage = memo(function HeaderImage({
  alt = 'EduNexus — Learn, Practice, Create, Excel',
  slides,
  className = '',
}: HeaderImageProps) {
  return (
    <section
      aria-label="EduNexus banner"
      data-header-section="header-image"
      className={`w-full px-2 pt-2.5 sm:px-2.5 sm:pt-3 lg:px-3.5 lg:pt-3.5 ${className}`.trim()}
    >
      <div className="relative grid min-h-56 w-full grid-cols-1 overflow-hidden rounded-2xl border border-sky-400/30 bg-[#050b2b] shadow-[0_12px_32px_-14px_rgba(14,165,233,0.34)] ring-1 ring-inset ring-white/15 contain-[layout_style_paint] sm:min-h-64 sm:rounded-3xl md:min-h-68 lg:min-h-72 xl:min-h-76 2xl:min-h-80 dark:border-cyan-400/25 dark:shadow-[0_16px_40px_-14px_rgba(0,0,0,0.78)]">
        <picture className="pointer-events-none absolute inset-0 block h-full w-full">
          <source
            media="(min-width: 1280px)"
            type="image/webp"
            srcSet={EDUNEXUS_HEADER_BANNER_WIDE_SRCSET}
            sizes={EDUNEXUS_HEADER_BANNER_WIDE_SIZES}
            width={EDUNEXUS_HEADER_BANNER_WIDE_WIDTH}
            height={EDUNEXUS_HEADER_BANNER_WIDE_HEIGHT}
          />
          <source
            media="(min-width: 640px)"
            srcSet={EDUNEXUS_HEADER_BANNER_TABLET_SRCSET}
            sizes={EDUNEXUS_HEADER_BANNER_TABLET_SIZES}
            width={EDUNEXUS_HEADER_BANNER_TABLET_WIDTH}
            height={EDUNEXUS_HEADER_BANNER_TABLET_HEIGHT}
          />
          <img
            src={EDUNEXUS_HEADER_BANNER_MOBILE_DEFAULT_URL}
            srcSet={EDUNEXUS_HEADER_BANNER_MOBILE_SRCSET}
            sizes={EDUNEXUS_HEADER_BANNER_MOBILE_SIZES}
            alt={alt}
            width={EDUNEXUS_HEADER_BANNER_MOBILE_WIDTH}
            height={EDUNEXUS_HEADER_BANNER_MOBILE_HEIGHT}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            crossOrigin="anonymous"
            className="block h-full w-full object-cover object-[center_45%] select-none"
          />
        </picture>

        <HeaderImageSlider slides={slides} />
      </div>
    </section>
  )
})

export default HeaderImage
