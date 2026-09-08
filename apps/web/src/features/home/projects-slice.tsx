import type { Project } from '@ntatoud/content'

import { ProjectCard } from '@/features/projects/project-card'

import { Slice } from './slice'

type ProjectsSliceProps = {
  projects: readonly Project[]
}

export function ProjectsSlice({ projects }: ProjectsSliceProps) {
  const featured = projects.slice(0, 3)

  return (
    <Slice title="Projects" seeAllHref="/projects" data-slot="projects-slice">
      <ul
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        data-slot="projects-slice-list"
      >
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ul>
    </Slice>
  )
}
