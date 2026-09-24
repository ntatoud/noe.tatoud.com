import type { BlogPost, Experience, Project, StageItem } from '@ntatoud/content'

import { BlogSlice } from './blog-slice'
import { ExperiencesSlice } from './experiences-slice'
import { Hero } from './hero'
import { ProjectsSlice } from './projects-slice'
import { TalksSlice } from './talks-slice'

type HomePageProps = {
  posts: readonly BlogPost[]
  projects: readonly Project[]
  talks: readonly StageItem[]
  experiences: readonly Experience[]
}

export function HomePage({
  posts,
  projects,
  talks,
  experiences,
}: HomePageProps) {
  return (
    <main id="main" data-slot="home-page">
      <Hero current={experiences.find((exp) => !exp.endDate)} />
      <BlogSlice posts={posts} />
      <ProjectsSlice projects={projects} />
      <TalksSlice talks={talks} />
      <ExperiencesSlice experiences={experiences} />
    </main>
  )
}
