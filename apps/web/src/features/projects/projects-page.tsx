import type { Project } from '@ntatoud/content'

import { ProjectCard } from '@/features/projects/project-card'

type ProjectsPageProps = {
  projects: readonly Project[]
}

export function ProjectsPage({ projects }: ProjectsPageProps) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12" data-slot="projects-page">
      <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      <p className="mt-2 text-muted-foreground">
        Things I've built and shipped.
      </p>
      <ul
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        data-slot="projects-page-list"
      >
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ul>
    </main>
  )
}
