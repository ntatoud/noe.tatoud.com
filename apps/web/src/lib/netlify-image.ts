export type NetlifyImageOptions = {
  width?: number
  height?: number
  fit?: 'contain' | 'cover' | 'fill'
  quality?: number
}

/**
 * Wraps a same-origin `/content/...` URL with Netlify's Image CDN for
 * responsive, format-negotiated delivery (ADR-0008). Omitting `fm` lets
 * Netlify auto-negotiate AVIF/WebP from the request's `Accept` header.
 *
 * Local dev has no Image CDN emulation (`netlify()` is only wired in for
 * production builds, see `vite.config.ts`), so this falls back to the
 * direct URL there — the dev static-serving middleware handles it instead.
 */
export function netlifyImageUrl(
  src: string,
  options: NetlifyImageOptions = {},
): string {
  if (import.meta.env.DEV || !src.startsWith('/')) return src

  const params = new URLSearchParams({ url: src })
  if (options.width) params.set('w', String(options.width))
  if (options.height) params.set('h', String(options.height))
  if (options.fit) params.set('fit', options.fit)
  if (options.quality) params.set('q', String(options.quality))

  return `/.netlify/images?${params.toString()}`
}
