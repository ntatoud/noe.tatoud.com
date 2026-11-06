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
  return (
    <ContentCard
      slot="project-card"
      link={{ to: '/projects/$slug', slug: project.slug }}
    >
      <div className="flex items-center justify-between gap-2">
        <ProjectKindChip kind={project.kind} />
        <time
          dateTime={project.date}
          className="text-xs text-muted-foreground tabular-nums"
        >
          {formatMonthYear(project.date)}
        </time>
      </div>
      <CardTitle>{project.title}</CardTitle>
      {project.description && (
        <CardDescription>{project.description}</CardDescription>
      )}
      <CardTags tags={project.tags} />
    </ContentCard>
  )
}

export function ProjectKindChip({ kind }: { kind: Project['kind'] }) {
  const isContribution = kind === 'contribution'
  return (
    <KindChip
      icon={isContribution ? HandshakeIcon : Rocket01Icon}
      label={isContribution ? 'Contribution' : 'Personal'}
      tone={isContribution ? 'olive' : 'clay'}
    />
  )
}
