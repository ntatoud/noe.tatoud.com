import type { BlogPost } from '@ntatoud/content'

export function relatedPosts(
  post: Pick<BlogPost, 'slug' | 'tags'>,
  posts: readonly BlogPost[],
  count = 2,
): BlogPost[] {
  const tags = new Set(post.tags)
  const shared = (other: BlogPost) =>
    other.tags?.filter((tag) => tags.has(tag)).length ?? 0
  // `posts` is newest first and `sort` is stable, so ties stay newest first.
  return posts
    .filter((other) => other.slug !== post.slug)
    .sort((a, b) => shared(b) - shared(a))
    .slice(0, count)
}
