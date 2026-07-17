import type { BlogPost } from '@ntatoud/content'
import { Link } from '@tanstack/react-router'

type BlogPageProps = {
  posts: BlogPost[]
}

export function BlogPage({ posts }: BlogPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12" data-slot="blog-page">
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
      <p className="mt-2 text-muted-foreground">
        Long-form posts on frontend, tooling, and craft.
      </p>
      <ul className="mt-8 flex flex-col gap-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="text-sm text-foreground underline-offset-4 hover:underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
