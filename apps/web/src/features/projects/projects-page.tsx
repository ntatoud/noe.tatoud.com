import { Link } from '@tanstack/react-router'

import type { Project } from '@/lib/content'

type ProjectsPageProps = {
  projects: Project[]
}

export function ProjectsPage({ projects }: ProjectsPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12" data-slot="projects-page">
      <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      <p className="mt-2 text-muted-foreground">
        Things I've built and shipped.
      </p>
      <ul className="mt-8 flex flex-col gap-2">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              to="/projects/$slug"
              params={{ slug: project.slug }}
              className="text-sm text-foreground underline-offset-4 hover:underline"
            >
              {project.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
