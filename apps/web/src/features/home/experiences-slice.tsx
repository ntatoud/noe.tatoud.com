import type { Experience } from '@ntatoud/content'

import { formatMonthYear } from '@/lib/format'

import { Slice } from './slice'

type ExperiencesSliceProps = {
  experiences: readonly Experience[]
}

function experienceDateRange(experience: Experience): string {
  const start = formatMonthYear(experience.startDate)
  const end = experience.endDate
    ? formatMonthYear(experience.endDate)
    : 'Present'
  return `${start} – ${end}`
}

export function ExperiencesSlice({ experiences }: ExperiencesSliceProps) {
  return (
    <Slice title="Experiences" data-slot="experiences-slice">
      <ol className="flex flex-col" data-slot="experiences-timeline">
        {experiences.map((exp, index) => {
          const isLast = index === experiences.length - 1
          const content = (
            <>
              <div className="flex flex-col items-center">
                <span
                  className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-md border border-border/50 bg-background transition-transform duration-200 ease-out group-hover:scale-110 group-hover:rotate-3"
                  aria-hidden={!exp.logo}
                >
                  {exp.logo ? (
                    <img
                      src={exp.logo}
                      alt={`${exp.organization} logo`}
                      width={32}
                      height={32}
                      className="size-full rounded-md object-cover"
                    />
                  ) : null}
                </span>
                {!isLast && <span className="w-px flex-1 bg-border" />}
              </div>
              <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 pb-8">
                <time className="text-xs text-muted-foreground tabular-nums group-hover:text-foreground">
                  {experienceDateRange(exp)}
                </time>
                <span className="text-sm text-foreground underline-offset-4 group-hover:underline">
                  {exp.title} · {exp.organization}
                </span>
              </span>
            </>
          )

          return (
            <li key={exp.slug} className="group">
              {exp.url ? (
                <a
                  href={exp.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex gap-3"
                >
                  {content}
                </a>
              ) : (
                <div className="flex gap-3">{content}</div>
              )}
            </li>
          )
        })}
      </ol>
    </Slice>
  )
}
