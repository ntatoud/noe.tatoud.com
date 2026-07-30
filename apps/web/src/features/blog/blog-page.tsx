import type { BlogPost } from '@ntatoud/content'

import { ContentList } from '@/components/content-list'

type BlogPageProps = {
  posts: readonly BlogPost[]
}

export function BlogPage({ posts }: BlogPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12" data-slot="blog-page">
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
      <p className="mt-2 text-muted-foreground">
        Long-form posts on frontend, tooling, and craft.
      </p>
      <ContentList
        className="mt-8"
        items={posts.map((post) => ({
          key: post.slug,
          href: post.externalUrl ?? post.url,
          title: post.title,
          external: post.externalUrl !== null,
        }))}
      />
    </main>
  )
}
