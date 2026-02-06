import { createFileRoute } from '@tanstack/react-router'
import { PageHome } from '@/features/home/page-home'
import { getBlogPosts } from '@/features/blog/get-blog-posts'
import { getProjects } from '@/features/projects/get-projects'
import { getEvents } from '@/features/events/get-events'

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    const [posts, projects, events] = await Promise.all([
      getBlogPosts(),
      getProjects(),
      getEvents(),
    ])
    return { posts, projects, events }
  },
})

function App() {
  return <PageHome />
}
