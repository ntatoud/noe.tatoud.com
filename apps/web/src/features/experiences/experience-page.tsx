import { Link } from '@tanstack/react-router'

import { MdxRenderer } from '@/components/mdx/mdx-renderer'
import { Badge } from '@/components/ui/badge'
import { ButtonAnchor } from '@/components/ui/button-link'
import type { ExperienceWithBody } from '@/lib/content'
import { formatMonthYear } from '@/lib/format'

type ExperiencePageProps = {
  experience: ExperienceWithBody
}

function dateRange(start: string, end: string | undefined): string {
  const startLabel = formatMonthYear(start)
  const endLabel = end ? formatMonthYear(end) : 'Present'
  return `${startLabel} — ${endLabel}`
}

export function ExperiencePage({ experience }: ExperiencePageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12" data-slot="experience-page">
      <Link
        to="/experiences"
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        ← Experiences
      </Link>
      <div className="mt-6 flex items-center gap-3">
        {experience.logo && (
          <img
            src={experience.logo}
            alt={`${experience.organization} logo`}
            width={40}
            height={40}
            className="size-10 shrink-0 rounded border border-border object-contain"
            data-slot="experience-logo"
          />
        )}
        <h1 className="text-3xl font-bold tracking-tight">
          {experience.title}
        </h1>
        <Badge>{experience.kind}</Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {experience.organization} ·{' '}
        {dateRange(experience.startDate, experience.endDate)}
      </p>
      {experience.url && (
        <div className="mt-4">
          <ButtonAnchor
            href={experience.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit
          </ButtonAnchor>
        </div>
      )}
      <div
        className="prose prose-invert mt-8 max-w-none"
        data-slot="experience-body"
      >
        <MdxRenderer body={experience.body} />
      </div>
    </main>
  )
}
