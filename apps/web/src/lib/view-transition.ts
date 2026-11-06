import type { CSSProperties } from 'react'

type Shared = 'title' | 'hero'
type Collection = 'blog' | 'projects' | 'talks'
type Side = 'card' | 'page'

// A card and its page share a name; index.css applies it only to the clicked card and the page, so nothing else gets its own layer.
export function sharedElement(
  shared: Shared,
  collection: Collection,
  slug: string,
  side: Side,
): {
  style: CSSProperties
  'data-vt': Shared
  'data-vt-page'?: ''
} {
  return {
    style: { '--vt-name': `${shared}-${collection}-${slug}` } as CSSProperties,
    'data-vt': shared,
    ...(side === 'page' ? { 'data-vt-page': '' as const } : {}),
  }
}
