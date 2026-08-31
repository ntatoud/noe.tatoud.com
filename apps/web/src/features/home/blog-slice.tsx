import type { BlogPost } from '@ntatoud/content'

import { BlogCard } from '@/features/blog/blog-card'

import { Slice } from './slice'

type BlogSliceProps = {
  posts: readonly BlogPost[]
}

export function BlogSlice({ posts }: BlogSliceProps) {
  const latest = posts.slice(0, 3)

  return (
    <Slice title="Blog" seeAllHref="/blog" data-slot="blog-slice">
      <ul
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        data-slot="blog-slice-list"
      >
        {latest.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </ul>
    </Slice>
  )
}
