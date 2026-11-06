import type { BlogPost } from '@ntatoud/content'

import { BlogCard } from '@/features/blog/blog-card'

import { Slice } from './slice'

type BlogSliceProps = {
  posts: readonly BlogPost[]
}

export function BlogSlice({ posts }: BlogSliceProps) {
  const latest = posts.slice(0, 3)

  return (
    <Slice
      title="Blog"
      description="Notes on what I build, what I learn, and how the way I work keeps changing."
      seeAll={{ href: '/blog', label: 'All posts' }}
      slot="blog-slice"
    >
      <ul
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        data-slot="blog-slice-list"
      >
        {latest.map((post, index) => (
          <BlogCard key={post.slug} post={post} featured={index === 0} />
        ))}
      </ul>
    </Slice>
  )
}
