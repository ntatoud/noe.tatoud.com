import { Link } from '@tanstack/react-router'

import { MdxRenderer } from '@/components/mdx/mdx-renderer'
import type { BlogPostWithBody } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { netlifyImageUrl } from '@/lib/netlify-image'

type BlogPostPageProps = {
  post: BlogPostWithBody
}

export function BlogPostPage({ post }: BlogPostPageProps) {
  const heroSrc = post.hero
    ? netlifyImageUrl(post.hero, {
        width: post.heroDimensions?.width,
        height: post.heroDimensions?.height,
      })
    : null

  return (
    <main className="mx-auto max-w-3xl px-4 py-12" data-slot="blog-post-page">
      <Link
        to="/blog"
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        ← Blog
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">{post.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {formatDate(post.date)}
      </p>
      {heroSrc && (
        <img
          src={heroSrc}
          alt=""
          className="mt-6 w-full rounded-lg border border-border object-cover"
          width={post.heroDimensions?.width}
          height={post.heroDimensions?.height}
          data-slot="blog-post-hero"
        />
      )}
      <div
        className="prose prose-invert mt-8 max-w-none"
        data-slot="blog-post-body"
      >
        <MdxRenderer body={post.body} />
      </div>
    </main>
  )
}
