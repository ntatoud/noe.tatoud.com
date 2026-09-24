import type { Project } from '@ntatoud/content'

import { HandshakeIcon, Rocket01Icon } from '@hugeicons/core-free-icons'

import {
  CardDescription,
  CardTags,
  CardTitle,
  ContentCard,
} from '@/components/content-card'
import { KindChip } from '@/components/kind-chip'
import { formatMonthYear } from '@/lib/format'

type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isContribution = project.kind === 'contribution'
  const external = isContribution && !!project.url

  return (
    <ContentCard
      slot="project-card"
      link={
        external && project.url
          ? { external: true, href: project.url }
          : { to: '/projects/$slug', slug: project.slug }
      }
    >
      <div className="flex items-center justify-between gap-2">
        <KindChip
          icon={isContribution ? HandshakeIcon : Rocket01Icon}
          label={isContribution ? 'Contribution' : 'Personal'}
          tone={isContribution ? 'olive' : 'clay'}
        />
        <time
          dateTime={project.date}
          className="text-xs text-muted-foreground tabular-nums"
        >
          {formatMonthYear(project.date)}
        </time>
      </div>
      <CardTitle external={external}>{project.title}</CardTitle>
      {project.description && (
        <CardDescription>{project.description}</CardDescription>
      )}
      <CardTags tags={project.tags} />
    </ContentCard>
  )
}
