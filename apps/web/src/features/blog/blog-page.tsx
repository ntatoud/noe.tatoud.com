import type { BlogPost } from '@ntatoud/content'

import { ListingPage } from '@/components/listing-page'

import { BlogCard } from './blog-card'

type BlogPageProps = {
  posts: readonly BlogPost[]
}

export function BlogPage({ posts }: BlogPageProps) {
  return (
    <ListingPage
      slot="blog-page"
      title="Blog"
      subtitle="Long-form posts on frontend, tooling, and craft."
      columns={2}
    >
      {posts.map((post, index) => (
        <BlogCard key={post.slug} post={post} featured={index === 0} />
      ))}
    </ListingPage>
  )
}
