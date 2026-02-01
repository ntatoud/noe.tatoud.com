import { Link } from '@tanstack/react-router'
import type { BlogPost } from '@/features/blog/get-blog-posts'
import { formatDate } from '@/features/blog/schemas'

export function ArticlesList({ posts }: { posts: Array<BlogPost> }) {
  if (posts.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No blog posts yet. Check back soon!
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {posts.map((post) => (
        <article
          key={post.slug}
          className="group relative rounded-lg border border-border p-6 transition-colors hover:bg-muted/50"
        >
          <Link to="/blog/$" params={{ _splat: post.slug }} className="block">
            <h2 className="text-xl font-semibold tracking-tight group-hover:text-primary">
              {post.title}
            </h2>
            {post.description && (
              <p className="mt-2 text-muted-foreground">{post.description}</p>
            )}
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span>{post.author}</span>
              <span>·</span>
              <time>{formatDate(post.date)}</time>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
}
