import type { Project } from '@ntatoud/content'

import { ContentList } from '@/components/content-list'

import { Slice } from './slice'

type ProjectsSliceProps = {
  projects: Project[]
}

export function ProjectsSlice({ projects }: ProjectsSliceProps) {
  const featured = projects.slice(0, 3)

  return (
    <Slice title="Projects" seeAllHref="/projects" data-slot="projects-slice">
      <ContentList
        items={featured.map((project) => {
          const href = project.url ?? project.repo
          return {
            key: project.slug,
            href,
            title: project.title,
            external: href !== undefined,
          }
        })}
      />
    </Slice>
  )
}
