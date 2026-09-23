import type { BlogPostDetail } from '@ntatoud/content'

import { DetailPage } from '@/components/detail-page'
import { formatDate } from '@/lib/format'

type BlogPostPageProps = {
  post: BlogPostDetail
}

export function BlogPostPage({ post }: BlogPostPageProps) {
  return (
    <DetailPage
      slot="blog-post"
      back={{ to: '/blog', label: 'Blog' }}
      title={post.title}
      byline={`${post.author} · ${formatDate(post.date)}`}
      description={post.description}
      tags={post.tags}
      html={post.html}
    >
      {/* `hero` is already a hashed asset URL — the content plugin turns the
          frontmatter path into a real Vite import at build time. */}
      {post.hero && (
        <img
          src={post.hero}
          alt=""
          className="mt-6 w-full rounded-lg border border-border object-cover"
          data-slot="blog-post-hero"
        />
      )}
    </DetailPage>
  )
}
