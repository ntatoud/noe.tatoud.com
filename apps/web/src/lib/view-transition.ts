import type { CSSProperties } from 'react'

type Shared = 'title' | 'hero'
type Collection = 'blog' | 'projects' | 'talks'

// A card and its detail page share these names, so the browser morphs one into the other on navigation.
export function sharedElement(
  shared: Shared,
  collection: Collection,
  slug: string,
): { style: CSSProperties; 'data-vt': Shared } {
  return {
    style: { viewTransitionName: `${shared}-${collection}-${slug}` },
    'data-vt': shared,
  }
}
