import type { BlogPost, BlogPostDetail } from '@ntatoud/content'

import { DetailPage } from '@/components/detail-page'
import { Monogram } from '@/components/monogram'
import { SayHello } from '@/layout/say-hello'
import { formatDate, readingMinutes } from '@/lib/format'

import { BlogCard } from './blog-card'

type BlogPostPageProps = {
  post: BlogPostDetail
  morePosts: readonly BlogPost[]
}

export function BlogPostPage({ post, morePosts }: BlogPostPageProps) {
  return (
    <DetailPage
      slot="blog-post"
      back={{ to: '/blog', label: 'All posts' }}
      title={post.title}
      byline={<Byline post={post} />}
      description={post.description}
      tags={post.tags}
      html={post.html}
      footer={
        <>
          <SayHello
            title="Thanks for reading!"
            subject={`About "${post.title}"`}
            className="mt-16"
          >
            <p>
              If this post sparked a thought, a question or a disagreement, I'd
              genuinely like to hear it. Replies to posts are my favourite
              emails.
            </p>
          </SayHello>
          {morePosts.length > 0 && (
            <section className="mt-16" aria-labelledby="more-posts-title">
              <h2 id="more-posts-title" className="text-2xl sm:text-3xl">
                Keep reading
              </h2>
              <ul
                className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
                data-slot="more-posts"
              >
                {morePosts.map((other) => (
                  <BlogCard key={other.slug} post={other} />
                ))}
              </ul>
            </section>
          )}
        </>
      }
    >
      {post.hero && (
        <img
          src={post.hero}
          alt=""
          width={post.heroDimensions?.width}
          height={post.heroDimensions?.height}
          fetchPriority="high"
          className="mt-8 w-full rounded-2xl border border-border object-cover"
          data-slot="blog-post-hero"
        />
      )}
    </DetailPage>
  )
}

function Byline({ post }: { post: BlogPostDetail }) {
  return (
    <div className="flex items-center gap-3" data-slot="blog-post-byline">
      <Monogram className="size-11 text-xl" />
      <div className="flex flex-col text-sm">
        <span className="font-medium text-foreground">{post.author}</span>
        <span className="text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time> ·{' '}
          {readingMinutes(post.html)} min read
        </span>
      </div>
    </div>
  )
}
