const imageModules = import.meta.glob<string>(
  '/../../content/**/*.{png,jpg,jpeg,webp,avif,svg}',
  { eager: true, query: '?url', import: 'default' },
)

const cache = new Map<string, string>()
for (const [key, url] of Object.entries(imageModules)) {
  // key looks like "/../../content/blog/<dir>/hero.png"
  const normalized = key.split('/../../content/')[1]?.replace(/\/+/g, '/')
  if (normalized) cache.set(normalized, url)
}

/**
 * Resolves a content-relative image path to a Vite-processed URL.
 * Accepts either `/content/blog/<dir>/file.png` or `blog/<dir>/file.png`.
 * Returns null if the image is not found.
 */
export function resolveContentImage(imagePath: string | null): string | null {
  if (!imagePath) return null
  const key = imagePath
    .replace(/^\/content\//, '')
    .replace(/^\//, '')
    .replace(/\/+/g, '/')
  return cache.get(key) ?? null
}
