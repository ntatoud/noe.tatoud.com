import type { ExperienceDetail } from '@ntatoud/content'
import { Link } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { resolveContentImage } from '@/lib/content-images'
import { formatMonthYear } from '@/lib/format'

type ExperiencePageProps = {
  experience: Omit<ExperienceDetail, 'Content'> & { bodyHtml: string }
}

function dateRange(start: string, end: string | undefined): string {
  const startLabel = formatMonthYear(start)
  const endLabel = end ? formatMonthYear(end) : 'Present'
  return `${startLabel} — ${endLabel}`
}

export function ExperiencePage({ experience }: ExperiencePageProps) {
  const logoSrc = resolveContentImage(experience.logo)

  return (
    <main className="mx-auto max-w-3xl px-4 py-12" data-slot="experience-page">
      <Link
        to="/experiences"
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        ← Experiences
      </Link>
      <div className="mt-6 flex items-start gap-3">
        {logoSrc && (
          <img
            src={logoSrc}
            alt={`${experience.organization} logo`}
            width={40}
            height={40}
            className="size-10 shrink-0 rounded border border-border object-contain"
            data-slot="experience-logo"
          />
        )}
        <div>
          <div className="flex flex-wrap items-baseline gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {experience.title}
            </h1>
            <Badge>{experience.kind}</Badge>
          </div>
          <p className="mt-1 text-muted-foreground">
            {experience.organization}
          </p>
          <p className="text-sm text-muted-foreground">
            {dateRange(experience.startDate, experience.endDate)}
          </p>
        </div>
      </div>

      <div
        className="prose prose-invert mt-8"
        data-slot="experience-content"
        dangerouslySetInnerHTML={{ __html: experience.bodyHtml }}
      />
    </main>
  )
}
