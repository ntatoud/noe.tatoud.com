import type { BlogPost } from '@ntatoud/content'

const words = (tags: ReadonlyArray<string> | undefined) =>
  new Set(tags?.flatMap((tag) => tag.toLowerCase().split(/\s+/)) ?? [])

export function relatedPosts(
  post: Pick<BlogPost, 'slug' | 'tags'>,
  posts: readonly BlogPost[],
  count = 2,
  { requireOverlap = false } = {},
): BlogPost[] {
  const own = words(post.tags)
  const overlap = (other: BlogPost) =>
    [...words(other.tags)].filter((word) => own.has(word)).length
  // `posts` is newest first and `sort` is stable, so ties stay newest first.
  return posts
    .filter(
      (other) =>
        other.slug !== post.slug && (!requireOverlap || overlap(other) > 0),
    )
    .sort((a, b) => overlap(b) - overlap(a))
    .slice(0, count)
}
