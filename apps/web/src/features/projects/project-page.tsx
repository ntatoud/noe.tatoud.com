import { Link } from '@tanstack/react-router'

import { MdxRenderer } from '@/components/mdx/mdx-renderer'
import { Badge } from '@/components/ui/badge'
import { ButtonAnchor } from '@/components/ui/button-link'
import type { ProjectWithBody } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

type ProjectPageProps = {
  project: ProjectWithBody
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
      <div className="mt-6 flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        <Badge
          className={cn(
            project.kind === 'personal'
              ? 'bg-primary text-primary-foreground'
              : '',
          )}
        >
          {project.kind}
        </Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {formatDate(project.date)}
      </p>
      {project.description && (
        <p className="mt-4 text-muted-foreground">{project.description}</p>
      )}
      {(project.url ?? project.repo) && (
        <div className="mt-4 flex items-center gap-3">
          {project.url && (
            <ButtonAnchor
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit
            </ButtonAnchor>
          )}
          {project.repo && (
            <ButtonAnchor
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            >
              Source
            </ButtonAnchor>
          )}
        </div>
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
      <div
        className="prose prose-invert mt-8 max-w-none"
        data-slot="project-body"
      >
        <MdxRenderer body={project.body} />
      </div>
    </main>
  )
}
