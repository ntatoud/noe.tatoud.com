import type { BlogPostDetail } from '@ntatoud/content'

import { ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button-link'
import { formatDate } from '@/lib/format'

type BlogPostPageProps = {
  post: BlogPostDetail
}

export function BlogPostPage({ post }: BlogPostPageProps) {
  // `hero` is already a hashed asset URL: the build-time content plugin turns the
  // frontmatter path into a real Vite import.
  const heroSrc = post.hero

  return (
    <main
      className="mx-auto w-full min-w-0 max-w-3xl px-4 py-12"
      data-slot="blog-post-page"
    >
      <ButtonLink to="/blog" variant="ghost" size="sm">
        <HugeiconsIcon
          icon={ArrowLeft02Icon}
          size={16}
          data-icon="inline-start"
        />
        Blog
      </ButtonLink>
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
        className="typeset typeset-docs mt-8"
        data-slot="blog-post-content"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </main>
  )
}
