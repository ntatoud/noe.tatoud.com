import type { Experience } from '@ntatoud/content'

import { Badge } from '@/components/ui/badge'
import { resolveContentImage } from '@/lib/content-images'
import { formatMonthYear } from '@/lib/format'

import { Slice } from './slice'

type ExperiencesSliceProps = {
  experiences: Experience[]
}

function dateRange(start: string, end: string | undefined): string {
  const startLabel = formatMonthYear(start)
  const endLabel = end ? formatMonthYear(end) : 'Present'
  return `${startLabel} — ${endLabel}`
}

export function ExperiencesSlice({ experiences }: ExperiencesSliceProps) {
  const latest = experiences.slice(0, 2)

  return (
    <Slice title="Experiences" data-slot="experiences-slice">
      <ul className="flex flex-col divide-y divide-border">
        {latest.map((exp) => {
          const logoSrc = resolveContentImage(exp.logo)
          const content = (
            <>
              {logoSrc && (
                <img
                  src={logoSrc}
                  alt={`${exp.organization} logo`}
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded border border-border object-contain"
                  data-slot="experience-logo"
                />
              )}
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="font-medium group-hover:underline">
                    {exp.title}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {exp.organization}
                  </span>
                  <Badge>{exp.kind}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {dateRange(exp.startDate, exp.endDate)}
                </p>
              </div>
            </>
          )
          return (
            <li key={exp.slug} className="py-4">
              {exp.url ? (
                <a
                  href={exp.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-3"
                  data-slot="experience-link"
                >
                  {content}
                </a>
              ) : (
                <div
                  className="flex items-start gap-3"
                  data-slot="experience-item"
                >
                  {content}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </Slice>
  )
}
