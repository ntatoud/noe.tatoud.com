import type { Project } from '@ntatoud/content'

import {
  ArrowUpRight02Icon,
  HandshakeIcon,
  Rocket01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { KindChip } from '@/components/kind-chip'
import { Badge } from '@/components/ui/badge'
import { formatMonthYear } from '@/lib/format'

type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isContribution = project.kind === 'contribution'
  const external = isContribution && !!project.url
  const href = external ? project.url : `/projects/${project.slug}`

  return (
    <li data-slot="project-card">
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card outline-none transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-lg hover:shadow-black/5 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:hover:shadow-black/20"
      >
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center justify-between gap-2">
            <KindChip
              icon={isContribution ? HandshakeIcon : Rocket01Icon}
              label={isContribution ? 'Contribution' : 'Personal'}
              tone={isContribution ? 'honey' : 'moss'}
            />
            <time className="text-xs text-muted-foreground tabular-nums">
              {formatMonthYear(project.date)}
            </time>
          </div>
          <h3 className="line-clamp-2 min-h-[2lh] font-semibold tracking-tight text-foreground underline-offset-4 group-hover:underline">
            {project.title}
            {external && (
              <HugeiconsIcon
                icon={ArrowUpRight02Icon}
                size={14}
                className="ml-1 inline-block align-text-top text-muted-foreground"
                aria-hidden="true"
              />
            )}
          </h3>
          {project.description && (
            <p className="line-clamp-2 min-h-[2lh] text-sm text-muted-foreground">
              {project.description}
            </p>
          )}
          <div className="mt-auto flex min-h-5.5 flex-wrap gap-1 pt-2">
            {project.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </a>
    </li>
  )
}
