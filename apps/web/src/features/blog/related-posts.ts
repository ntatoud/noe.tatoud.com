import type { BlogPost } from '@ntatoud/content'

import { MORE_COUNT } from '@/lib/more'

const tagWords = (tags: ReadonlyArray<string> | undefined) =>
  new Set(tags?.flatMap((tag) => tag.toLowerCase().split(/\s+/)) ?? [])

export function relatedPosts(
  post: Pick<BlogPost, 'slug' | 'tags'>,
  posts: readonly BlogPost[],
  { requireOverlap = false } = {},
): BlogPost[] {
  const own = tagWords(post.tags)
  const overlap = (other: BlogPost) =>
    [...tagWords(other.tags)].filter((word) => own.has(word)).length
  // `posts` is newest first and `sort` is stable, so ties stay newest first.
  return posts
    .filter(
      (other) =>
        other.slug !== post.slug && (!requireOverlap || overlap(other) > 0),
    )
    .sort((a, b) => overlap(b) - overlap(a))
    .slice(0, MORE_COUNT)
}
