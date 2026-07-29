import { createFileRoute } from '@tanstack/react-router'

import { getBlogPosts } from '@/content-api'
import { HomePage } from '@/features/home/home-page'
import { getExperiences, getProjects, getTalks } from '@/server/content'

export const Route = createFileRoute('/')({
  component: HomePageRoute,
  loader: async () => {
    const [posts, projects, talks, experiences] = await Promise.all([
      getBlogPosts(),
      getProjects(),
      getTalks(),
      getExperiences(),
    ])
    return { posts, projects, talks, experiences }
  },
})

function HomePageRoute() {
  const { posts, projects, talks, experiences } = Route.useLoaderData()

  return (
    <HomePage
      posts={posts}
      projects={projects}
      talks={talks}
      experiences={experiences}
    />
  )
}
