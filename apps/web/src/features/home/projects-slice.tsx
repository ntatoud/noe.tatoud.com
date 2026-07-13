import type { Project } from '@ntatoud/content'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import { Slice } from './slice'

type ProjectsSliceProps = {
  projects: Project[]
}

export function ProjectsSlice({ projects }: ProjectsSliceProps) {
  const featured = projects.slice(0, 3)

  return (
    <Slice title="Projects" seeAllHref="/projects" data-slot="projects-slice">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => {
          const href = project.url ?? project.repo
          const isExternal = href !== undefined
          return (
            <li key={project.slug}>
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="flex h-full flex-col gap-2 rounded-lg border border-border p-4 transition-colors hover:border-foreground/20"
                data-slot="project-card"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium">{project.title}</h3>
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
                {project.description && (
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-1 pt-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </Slice>
  )
}
