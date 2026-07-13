import { Link } from '@tanstack/react-router'

type BlogPostPageProps = {
  slug: string
}

export function BlogPostPage({ slug }: BlogPostPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12" data-slot="blog-post-page">
      <Link
        to="/blog"
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        ← Blog
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">{slug}</h1>
      <p className="mt-2 text-muted-foreground">Post content goes here.</p>
    </main>
  )
}
