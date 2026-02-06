import { createFileRoute } from '@tanstack/react-router'
import { PageHome } from '@/features/home/page-home'
import { getBlogPosts } from '@/features/blog/get-blog-posts'
import { getProjects } from '@/features/projects/get-projects'

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    const [posts, projects] = await Promise.all([getBlogPosts(), getProjects()])
    return { posts, projects }
  },
})

function App() {
  return <PageHome />
}
