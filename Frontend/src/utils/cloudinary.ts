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
 * automatic format/quality negotiation (AVIF/WebP via f_auto,q_auto).
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
