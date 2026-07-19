import type { ProjectDetail } from '@ntatoud/content'

import { ArrowLeft02Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { ButtonAnchor, ButtonLink } from '@/components/ui/button-link'

type ProjectPageProps = {
  project: Omit<ProjectDetail, 'Content'> & { bodyHtml: string }
}

export function ProjectPage({ project }: ProjectPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12" data-slot="project-page">
      <ButtonLink to="/projects" variant="ghost" size="sm">
        <HugeiconsIcon
          icon={ArrowLeft02Icon}
          size={16}
          data-icon="inline-start"
        />
        Projects
      </ButtonLink>
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
          <ButtonAnchor
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            size="sm"
          >
            Website
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={16}
              data-icon="inline-end"
            />
          </ButtonAnchor>
        )}
        {project.repo && (
          <ButtonAnchor
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            size="sm"
          >
            Repository
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={16}
              data-icon="inline-end"
            />
          </ButtonAnchor>
        )}
      </div>

      <div
        className="typeset typeset-docs mt-8"
        data-slot="project-content"
        dangerouslySetInnerHTML={{ __html: project.bodyHtml }}
      />
    </main>
  )
}
