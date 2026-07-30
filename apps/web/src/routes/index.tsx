import { createFileRoute } from '@tanstack/react-router'

import { blogPosts, experiences, projects, talks } from 'virtual:content'

import { HomePage } from '@/features/home/home-page'

// This route used to load all four collections through `Promise.all`, which was
// four separate RPCs into the serverless function — so a cold instance could be
// started four times over, in parallel, to render a handful of titles. They are
// build-time constants now, and no loader is needed at all.
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
