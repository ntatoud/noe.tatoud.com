import type { BlogPostDetail } from '@ntatoud/content'
import { Link } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { resolveContentImage } from '@/lib/content-images'
import { formatDate } from '@/lib/format'

type BlogPostPageProps = {
  post: Omit<BlogPostDetail, 'Content'> & { bodyHtml: string }
}

export function BlogPostPage({ post }: BlogPostPageProps) {
  const heroSrc = resolveContentImage(post.hero)

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
        {post.author} · {formatDate(post.date)}
      </p>
      {post.description && (
        <p className="mt-2 text-muted-foreground">{post.description}</p>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {heroSrc && (
        <img
          src={heroSrc}
          alt=""
          className="mt-6 w-full rounded-lg border border-border object-cover"
          data-slot="blog-post-hero"
        />
      )}

      <div
        className="prose prose-invert mt-8"
        data-slot="blog-post-content"
        dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
      />
    </main>
  )
}
