import { createFileRoute } from '@tanstack/react-router'
import { PageHome } from '@/features/home/page-home'
import { getBlogPosts } from '@/features/blog/get-blog-posts'

export const Route = createFileRoute('/')({
  component: App,
  loader: () => getBlogPosts(),
})

function App() {
  return <PageHome />
}
