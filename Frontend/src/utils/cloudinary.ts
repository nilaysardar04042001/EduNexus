const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dhfhh3ujq/image/upload'

export interface CloudinaryImageOptions {
  width: number
  height?: number
  format?: 'auto' | 'png' | 'webp' | 'avif'
  quality?: string
  crop?: 'limit' | 'fill' | 'fit' | 'scale'
  /** Optional leading Cloudinary transformation chain (e.g. pre-crop / gen-fill before resizing) */
  preTransform?: string
  version?: string
  extension?: string
}

function encodePublicId(publicId: string): string {
  return publicId
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

/**
 * Builds an optimized Cloudinary delivery URL using on-the-fly resizing and
 * automatic format/quality negotiation (AVIF/WebP/JXL via f_auto,q_auto).
 */
export function buildCloudinaryImageUrl(
  publicId: string,
  {
    width,
    height,
    format = 'auto',
    quality = 'auto',
    crop = 'limit',
    preTransform,
    version,
    extension = 'png',
  }: CloudinaryImageOptions,
): string {
  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    `w_${width}`,
    height === undefined ? null : `h_${height}`,
    `c_${crop}`,
  ]
    .filter(Boolean)
    .join(',')

  const segments = [CLOUDINARY_BASE_URL]
  if (preTransform) {
    segments.push(preTransform)
  }
  segments.push(transforms)
  if (version) {
    segments.push(version)
  }
  segments.push(`${encodePublicId(publicId)}.${extension}`)

  return segments.join('/')
}

export const EDUNEXUS_LOGO_PUBLIC_ID = 'My Brand/EduNexus_iytdmk'
export const EDUNEXUS_LOGO_VERSION = 'v1795340729'

export const EDUNEXUS_LOGO_64_URL = buildCloudinaryImageUrl(EDUNEXUS_LOGO_PUBLIC_ID, {
  width: 64,
  height: 64,
  version: EDUNEXUS_LOGO_VERSION,
})

export const EDUNEXUS_LOGO_128_URL = buildCloudinaryImageUrl(EDUNEXUS_LOGO_PUBLIC_ID, {
  width: 128,
  height: 128,
  version: EDUNEXUS_LOGO_VERSION,
})

export const EDUNEXUS_HEADER_BANNER_PUBLIC_ID = 'EduNexus_Neon_Learning_Banner_yck9sn'
export const EDUNEXUS_HEADER_BANNER_VERSION = 'v1795350388'

// Mobile (<640px): full 3:1 banner (2172x724) matching comfortable 128px mobile height
export const EDUNEXUS_HEADER_BANNER_MOBILE_WIDTH = 2172
export const EDUNEXUS_HEADER_BANNER_MOBILE_HEIGHT = 724
const HEADER_BANNER_MOBILE_WIDTHS = [640, 960] as const

export const EDUNEXUS_HEADER_BANNER_MOBILE_DEFAULT_URL = buildCloudinaryImageUrl(
  EDUNEXUS_HEADER_BANNER_PUBLIC_ID,
  {
    width: 960,
    version: EDUNEXUS_HEADER_BANNER_VERSION,
  },
)

export const EDUNEXUS_HEADER_BANNER_MOBILE_SRCSET = HEADER_BANNER_MOBILE_WIDTHS.map(
  (width) =>
    `${buildCloudinaryImageUrl(EDUNEXUS_HEADER_BANNER_PUBLIC_ID, {
      width,
      version: EDUNEXUS_HEADER_BANNER_VERSION,
    })} ${width}w`,
).join(', ')

export const EDUNEXUS_HEADER_BANNER_MOBILE_SIZES = 'calc(100vw - 1rem)'

// Tablet & Laptop (640px - 1279px): clean 4.68:1 pre-cropped band (2172x464, y=58) matching 184px -> 232px heights
export const EDUNEXUS_HEADER_BANNER_TABLET_WIDTH = 2172
export const EDUNEXUS_HEADER_BANNER_TABLET_HEIGHT = 464
const HEADER_BANNER_TABLET_CROP = 'c_crop,w_2172,h_464,x_0,y_58'
const HEADER_BANNER_TABLET_WIDTHS = [960, 1440] as const

export const EDUNEXUS_HEADER_BANNER_TABLET_SRCSET = HEADER_BANNER_TABLET_WIDTHS.map(
  (width) =>
    `${buildCloudinaryImageUrl(EDUNEXUS_HEADER_BANNER_PUBLIC_ID, {
      width,
      preTransform: HEADER_BANNER_TABLET_CROP,
      version: EDUNEXUS_HEADER_BANNER_VERSION,
    })} ${width}w`,
).join(', ')

export const EDUNEXUS_HEADER_BANNER_TABLET_SIZES =
  '(min-width: 1024px) calc(100vw - 1.75rem), calc(100vw - 1.25rem)'

// Desktop & Ultrawide (1280px+): 7.5:1 ultra-wide panoramic band seamlessly outpainted with Cloudinary gen_fill
export const EDUNEXUS_HEADER_BANNER_WIDE_WIDTH = 2172
export const EDUNEXUS_HEADER_BANNER_WIDE_HEIGHT = 290
const HEADER_BANNER_WIDE_TRANSFORM = 'c_crop,w_2172,h_464,x_0,y_58/c_pad,ar_75:10,b_gen_fill'
const HEADER_BANNER_WIDE_WIDTHS = [1440, 2172] as const

export const EDUNEXUS_HEADER_BANNER_WIDE_SRCSET = HEADER_BANNER_WIDE_WIDTHS.map(
  (width) =>
    `${buildCloudinaryImageUrl(EDUNEXUS_HEADER_BANNER_PUBLIC_ID, {
      width,
      format: 'webp',
      preTransform: HEADER_BANNER_WIDE_TRANSFORM,
      version: EDUNEXUS_HEADER_BANNER_VERSION,
    })} ${width}w`,
).join(', ')

export const EDUNEXUS_HEADER_BANNER_WIDE_SIZES = 'calc(100vw - 1.75rem)'

// Header Slide 1 square emblem from Cloudinary EduNexus/Images folder (1254x1254 1:1 PNG)
export const EDUNEXUS_SLIDE1_IMAGE_PUBLIC_ID = 'EduNexus_-_HeroBanner_zetlae'
export const EDUNEXUS_SLIDE1_IMAGE_VERSION = 'v1795341871'
export const EDUNEXUS_SLIDE1_IMAGE_SIZE = 512
const SLIDE1_IMAGE_WIDTHS = [256, 384, 512, 640] as const

export const EDUNEXUS_SLIDE1_IMAGE_DEFAULT_URL = buildCloudinaryImageUrl(
  EDUNEXUS_SLIDE1_IMAGE_PUBLIC_ID,
  {
    width: 384,
    height: 384,
    crop: 'fill',
    version: EDUNEXUS_SLIDE1_IMAGE_VERSION,
  },
)

export const EDUNEXUS_SLIDE1_IMAGE_SRCSET = SLIDE1_IMAGE_WIDTHS.map(
  (size) =>
    `${buildCloudinaryImageUrl(EDUNEXUS_SLIDE1_IMAGE_PUBLIC_ID, {
      width: size,
      height: size,
      crop: 'fill',
      version: EDUNEXUS_SLIDE1_IMAGE_VERSION,
    })} ${size}w`,
).join(', ')

export const EDUNEXUS_SLIDE1_IMAGE_SIZES =
  '(min-width: 1536px) 280px, (min-width: 1280px) 256px, (min-width: 1024px) 224px, (min-width: 768px) 188px, 104px'
