import type { Project } from '@ntatoud/content'

import { ListingPage } from '@/components/listing-page'
import { ProjectCard } from '@/features/projects/project-card'

type ProjectsPageProps = {
  projects: readonly Project[]
}

export function ProjectsPage({ projects }: ProjectsPageProps) {
  return (
    <ListingPage
      slot="projects-page"
      title="Projects"
      subtitle="Things I have built for fun, and open-source projects I am lucky to contribute to."
      columns={3}
    >
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </ListingPage>
  )
}
