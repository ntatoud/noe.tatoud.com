import { ContentList } from '@/components/content-list'
import type { BlogPost } from '@/content-api'

import { Slice } from './slice'

type BlogSliceProps = {
  posts: ReadonlyArray<BlogPost>
}

export function BlogSlice({ posts }: BlogSliceProps) {
  const latest = posts.slice(0, 3)

  return (
    <Slice title="Blog" seeAllHref="/blog" data-slot="blog-slice">
      <ContentList
        items={latest.map((post) => ({
          key: post.slug,
          href: post.externalUrl ?? post.url,
          title: post.title,
          external: post.externalUrl !== null,
        }))}
      />
    </Slice>
  )
}
