import type { BlogPost } from '@ntatoud/content'

import { BlogCard } from './blog-card'

type BlogPageProps = {
  posts: readonly BlogPost[]
}

export function BlogPage({ posts }: BlogPageProps) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12" data-slot="blog-page">
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
      <p className="mt-2 text-muted-foreground">
        Long-form posts on frontend, tooling, and craft.
      </p>
      <ul
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
        data-slot="blog-page-list"
      >
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </ul>
    </main>
  )
}
