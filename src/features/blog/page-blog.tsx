import { useLoaderData } from '@tanstack/react-router'
import { ArticlesList } from '@/features/blog/articles-list'

export function PageBlog() {
  const posts = useLoaderData({ from: '/blog/' })
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Thoughts on web development, technology, and more.
        </p>
      </header>

      <ArticlesList posts={posts} />
    </div>
  )
}
