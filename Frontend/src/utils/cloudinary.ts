const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dhfhh3ujq/image/upload'

export interface CloudinaryImageOptions {
  width: number
  height?: number
  format?: 'auto' | 'png' | 'webp' | 'avif'
  quality?: string
  crop?: 'limit' | 'fill' | 'fit' | 'scale'
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

  const segments = [CLOUDINARY_BASE_URL, transforms]
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
export const EDUNEXUS_HEADER_BANNER_WIDTH = 2172
export const EDUNEXUS_HEADER_BANNER_HEIGHT = 724

const HEADER_BANNER_WIDTHS = [640, 960, 1440, 2172] as const

export const EDUNEXUS_HEADER_BANNER_DEFAULT_URL = buildCloudinaryImageUrl(
  EDUNEXUS_HEADER_BANNER_PUBLIC_ID,
  {
    width: 1440,
    version: EDUNEXUS_HEADER_BANNER_VERSION,
  },
)

export const EDUNEXUS_HEADER_BANNER_SRCSET = HEADER_BANNER_WIDTHS.map(
  (width) =>
    `${buildCloudinaryImageUrl(EDUNEXUS_HEADER_BANNER_PUBLIC_ID, {
      width,
      version: EDUNEXUS_HEADER_BANNER_VERSION,
    })} ${width}w`,
).join(', ')

export const EDUNEXUS_HEADER_BANNER_SIZES =
  '(min-width: 1024px) calc(100vw - 3rem), (min-width: 640px) calc(100vw - 2rem), calc(100vw - 1.5rem)'
