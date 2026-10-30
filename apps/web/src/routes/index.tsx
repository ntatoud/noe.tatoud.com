import { createFileRoute } from '@tanstack/react-router'

import { blogPosts, experiences, projects, talks } from 'virtual:content'

import { HomePage } from '@/features/home/home-page'
import { pageMeta } from '@/features/og/metadata'

export const Route = createFileRoute('/')({
  component: HomePageRoute,
  head: () => ({ meta: pageMeta('/') }),
})

function HomePageRoute() {
  return (
    <HomePage
      posts={blogPosts}
      projects={projects}
      talks={talks}
      experiences={experiences}
    />
  )
}
