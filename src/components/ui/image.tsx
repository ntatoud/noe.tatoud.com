import type { ComponentProps } from 'react'

type ImageProps = Omit<
  ComponentProps<'img'>,
  'loading' | 'decoding' | 'fetchPriority'
> & {
  src: string
  alt: string
  /** Render at high priority (fetchpriority=high, no lazy load). Use for LCP images. */
  priority?: boolean
  /** Resize widths to include in srcSet. Defaults to common responsive breakpoints. */
  widths?: Array<number>
  /** Quality for lossy formats (1–100). Defaults to 75. */
  quality?: number
}

const DEFAULT_WIDTHS = [320, 640, 828, 1080, 1200, 1920]

function netlifyUrl(src: string, w: number, quality: number): string {
  if (import.meta.env.DEV) return src
  return `/.netlify/images?${new URLSearchParams({ url: src, w: String(w), q: String(quality) })}`
}

export function Image({
  src,
  alt,
  priority = false,
  widths = DEFAULT_WIDTHS,
  quality = 75,
  sizes = '100vw',
  ...props
}: ImageProps) {
  const srcSet = widths
    .map((w) => `${netlifyUrl(src, w, quality)} ${w}w`)
    .join(', ')

  return (
    <img
      {...props}
      src={netlifyUrl(src, widths.at(-1) ?? 1920, quality)}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={priority ? undefined : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding={priority ? 'sync' : 'async'}
    />
  )
}
