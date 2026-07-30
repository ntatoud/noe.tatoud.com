import { createFileRoute } from '@tanstack/react-router'

import { blogPosts, experiences, projects, talks } from 'virtual:content'

import { HomePage } from '@/features/home/home-page'

export const Route = createFileRoute('/')({
  component: HomePageRoute,
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
