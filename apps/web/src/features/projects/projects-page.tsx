import type { Project } from '@ntatoud/content'

import { ContentList } from '@/components/content-list'

type ProjectsPageProps = {
  projects: readonly Project[]
}

export function ProjectsPage({ projects }: ProjectsPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12" data-slot="projects-page">
      <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      <p className="mt-2 text-muted-foreground">
        Things I've built and shipped.
      </p>
      <ContentList
        className="mt-8"
        items={projects.map((project) => ({
          key: project.slug,
          href:
            project.kind === 'contribution' && project.url
              ? project.url
              : `/projects/${project.slug}`,
          external: project.kind === 'contribution' && !!project.url,
          title: project.title,
        }))}
      />
    </main>
  )
}
