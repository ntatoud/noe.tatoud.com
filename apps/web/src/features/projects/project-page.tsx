import type { ProjectDetail } from '@ntatoud/content'
import { Link } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'

type ProjectPageProps = {
  project: Omit<ProjectDetail, 'Content'> & { bodyHtml: string }
}

export function ProjectPage({ project }: ProjectPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12" data-slot="project-page">
      <Link
        to="/projects"
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        ← Projects
      </Link>
      <div className="mt-6 flex items-center gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        <Badge>{project.kind}</Badge>
      </div>
      {project.description && (
        <p className="mt-2 text-muted-foreground">{project.description}</p>
      )}

      {project.tags && project.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-4">
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-foreground underline-offset-4 hover:underline"
          >
            Website →
          </a>
        )}
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-foreground underline-offset-4 hover:underline"
          >
            Repository →
          </a>
        )}
      </div>

      <div
        className="prose prose-invert mt-8"
        data-slot="project-content"
        dangerouslySetInnerHTML={{ __html: project.bodyHtml }}
      />
    </main>
  )
}
