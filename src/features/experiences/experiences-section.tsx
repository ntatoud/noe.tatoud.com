import { useLoaderData } from '@tanstack/react-router'

import { PixelExternalLink } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import type { Experience } from '@/features/experiences/get-experiences'
import {
  Section,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from '@/layout/section'
import { cn } from '@/lib/utils'

const KIND_LABEL: Record<Experience['kind'], string> = {
  work: 'Work',
  volunteer: 'Volunteer',
  education: 'Education',
}

function ExperienceItem({ experience }: { experience: Experience }) {
  const start = new Date(experience.startDate).getFullYear()
  const end = experience.endDate
    ? new Date(experience.endDate).getFullYear()
    : 'Present'

  const Wrapper = experience.url ? 'a' : 'div'

  return (
    <Wrapper
      {...(experience.url && {
        href: experience.url,
        target: '_blank',
        rel: 'noopener noreferrer',
      })}
      className={cn(
        'flex items-center gap-4 py-4',
        experience.url && 'transition-opacity hover:opacity-70',
      )}
    >
      {experience.logo ? (
        <img
          src={experience.logo}
          alt={experience.organization}
          width={40}
          height={40}
          className="shrink-0 object-contain clip-pixel"
          style={{ imageRendering: 'pixelated' }}
        />
      ) : (
        <div className="size-10 shrink-0 bg-muted clip-pixel" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-head text-base font-semibold tracking-wide uppercase">
            {experience.title}
          </span>
          <Badge variant="outline" className="shrink-0 text-xs">
            {KIND_LABEL[experience.kind]}
          </Badge>
        </div>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          {experience.organization}
          {experience.url && (
            <PixelExternalLink size={10} aria-hidden className="shrink-0" />
          )}
        </span>
      </div>
      <span className="shrink-0 font-mono text-xs text-muted-foreground/60">
        {start} — {end}
      </span>
    </Wrapper>
  )
}

export function ExperiencesSection() {
  const { experiences } = useLoaderData({ from: '/' })
  return (
    <Section>
      <SectionHeader>
        <SectionTitle className="mr-auto">Experiences</SectionTitle>
      </SectionHeader>
      <SectionContent>
        <div className="-my-4 flex w-full flex-col divide-y divide-border">
          {experiences.map((experience) => (
            <ExperienceItem key={experience.slug} experience={experience} />
          ))}
        </div>
      </SectionContent>
    </Section>
  )
}
