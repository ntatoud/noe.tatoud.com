import type { ReactNode } from 'react'

import type { Experience } from '@ntatoud/content'

import { GraduationCapIcon, SparklesIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { formatMonthRange, formatMonthYear, initials } from '@/lib/format'
import { cn } from '@/lib/utils'

import { Slice } from './slice'

type ExperiencesSliceProps = {
  experiences: readonly Experience[]
}

/** The site is static: "today" is the day it was built (see `vite.config.ts`). */
const today = import.meta.env.BUILD_DATE

const time = (date: string) => new Date(date).getTime()

/**
 * One row of the timeline: every role held at one organization, oldest first,
 * so a progression (internship, then a job) reads along a single line.
 */
type Lane = {
  organization: string
  roles: Experience[]
}

function lanes(roles: readonly Experience[]): Lane[] {
  const byOrganization = new Map<string, Experience[]>()
  for (const role of roles) {
    const lane = byOrganization.get(role.organization) ?? []
    lane.push(role)
    byOrganization.set(role.organization, lane)
  }
  // Latest organization on top, school at the bottom: the chart climbs from
  // the bottom left to the current role in the top right.
  const isSchool = (lane: Experience[]) =>
    lane.every((role) => role.kind === 'education')
  return [...byOrganization]
    .map(([organization, lane]) => ({ organization, roles: lane }))
    .reverse()
    .sort((a, b) => Number(isSchool(a.roles)) - Number(isSchool(b.roles)))
}

/** A linear time scale from the earliest experience to today. */
function timeScale(experiences: readonly Experience[]) {
  // A milestone (a graduation, a release) is a point in time; everything
  // with a duration (an exchange semester included) is a bar.
  const isMilestone = (exp: Experience) =>
    exp.kind === 'milestone' ||
    (exp.kind === 'education' &&
      (!exp.endDate || exp.endDate === exp.startDate))
  // Oldest first, so consecutive milestones alternate label rows.
  const milestones = experiences.filter(isMilestone).reverse()
  // Oldest first, so each lane lists its roles left to right.
  const roles = experiences.filter((exp) => !isMilestone(exp)).reverse()

  const origin = Math.min(...experiences.map((exp) => time(exp.startDate)))
  const end = time(today)

  /** Percentage of the scale's width, clamped to it. */
  const position = (date: string) =>
    Math.min(100, Math.max(0, ((time(date) - origin) / (end - origin)) * 100))

  // A tick at every month boundary inside the scale, labelled on January.
  const ticks: { date: string; year?: number }[] = []
  const cursor = new Date(origin)
  cursor.setUTCDate(1)
  cursor.setUTCMonth(cursor.getUTCMonth() + 1)
  while (cursor.getTime() < end) {
    ticks.push({
      date: cursor.toISOString(),
      year: cursor.getUTCMonth() === 0 ? cursor.getUTCFullYear() : undefined,
    })
    cursor.setUTCMonth(cursor.getUTCMonth() + 1)
  }

  return {
    origin: new Date(origin).toISOString(),
    lanes: lanes(roles),
    milestones,
    ticks,
    position,
  }
}

function ExperienceDateRange({ experience }: { experience: Experience }) {
  const { startDate, endDate } = experience
  if (!endDate) {
    return (
      <>
        <time dateTime={startDate}>{formatMonthYear(startDate)}</time> – Present
      </>
    )
  }

  const [start, end] = formatMonthRange(startDate, endDate)
  return (
    <>
      <time dateTime={startDate}>{start}</time> –{' '}
      <time dateTime={endDate}>{end}</time>
    </>
  )
}

function ExperienceLogo({ experience }: { experience: Experience }) {
  return (
    <span
      className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border/50 bg-background text-2xs text-muted-foreground transition-transform duration-200 ease-out group-hover:scale-110 group-hover:rotate-3"
      aria-hidden
    >
      {experience.logo ? (
        <img
          src={experience.logo}
          alt=""
          width={28}
          height={28}
          className="size-full rounded-md object-cover"
        />
      ) : (
        initials(experience.organization)
      )}
    </span>
  )
}

/** Where a link's preview card opens, relative to the link. */
type PreviewPlacement = {
  side: 'above' | 'below'
  align: 'start' | 'end'
}

/**
 * A link to an experience's website that previews it on hover (or keyboard
 * focus) with the site's Open Graph image, stored alongside the entry (see
 * `preview` in the schema).
 *
 * The card is plain CSS, not a popover component: the timeline knows where
 * every link sits, so it picks a side that stays inside the chart instead of
 * measuring the viewport. The card is `display: none` until shown, which also
 * keeps its lazy image from loading before the first hover.
 */
function ExperienceLink({
  experience,
  placement,
  className,
  label,
  children,
}: {
  experience: Experience
  placement: PreviewPlacement
  className?: string
  /** Accessible name, for a link with no text of its own (a bar). */
  label?: string
  children?: ReactNode
}) {
  const { url, preview, title, organization } = experience
  if (!url) return <div className={cn('group', className)}>{children}</div>

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={cn('group/preview group', className)}
    >
      {children}
      <span
        className={cn(
          'pointer-events-none absolute z-50 hidden w-72 flex-col overflow-hidden rounded-lg bg-popover text-left text-popover-foreground shadow-md ring-1 ring-foreground/10 transition-opacity transition-discrete delay-150 duration-150 group-hover/preview:flex group-focus-visible/preview:flex starting:opacity-0',
          placement.side === 'above' ? 'bottom-full mb-2' : 'top-full mt-2',
          placement.align === 'start' ? 'left-0' : 'right-0',
        )}
        aria-hidden
        data-slot="experience-preview"
      >
        {preview && (
          <img
            src={preview}
            alt=""
            width={640}
            height={360}
            loading="lazy"
            className="aspect-video w-full border-b border-border object-cover object-top"
          />
        )}
        <span className="flex flex-col gap-0.5 p-2.5">
          <span className="text-sm text-foreground">
            {title} · {organization}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {new URL(url).host}
          </span>
        </span>
      </span>
    </a>
  )
}

export function ExperiencesSlice({ experiences }: ExperiencesSliceProps) {
  const { origin, lanes, milestones, ticks, position } = timeScale(experiences)

  return (
    <Slice title="Experiences" data-slot="experiences-slice">
      <div className="-mx-4 overflow-x-auto px-4 pb-2">
        <div
          className={cn(
            'relative min-w-3xl',
            milestones.length > 1 ? 'pt-26' : 'pt-16',
          )}
          data-slot="experiences-timeline"
        >
          {milestones.map((exp, index) => {
            const date = exp.endDate ?? exp.startDate
            // Every other milestone drops a row, so two close milestones never
            // print their labels over each other.
            const lower = index % 2 === 1
            const at = position(date)
            // In the right half the label hangs off the icon's left side, so
            // it never runs past the scale.
            const alignEnd = at > 50
            return (
              <div
                key={exp.slug}
                className="absolute inset-y-0 left-(--at) w-0"
                style={{ '--at': `${at}%`, '--brand': exp.color }}
                data-slot="experiences-milestone"
              >
                <span
                  className={cn(
                    'absolute bottom-6 left-0 border-l border-dashed',
                    lower ? 'top-19' : 'top-9',
                    exp.color ? 'border-(--brand)/60' : 'border-olive-500/60',
                  )}
                  aria-hidden
                />
                <ExperienceLink
                  experience={exp}
                  // Milestones sit above every lane: their card opens below.
                  placement={{
                    side: 'below',
                    align: alignEnd ? 'end' : 'start',
                  }}
                  // Shifted by half the icon, so the icon sits on the line.
                  // Lifted over the lanes, which come later in the page and
                  // would otherwise paint over its card.
                  className={cn(
                    'absolute z-10 flex w-max items-center gap-2',
                    alignEnd
                      ? 'right-0 translate-x-3.5 flex-row-reverse text-right'
                      : 'left-0 -translate-x-3.5',
                    lower ? 'top-10' : 'top-0',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-7 items-center justify-center rounded-full',
                      exp.color
                        ? 'brand-fill text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground',
                    )}
                  >
                    <HugeiconsIcon
                      icon={
                        exp.kind === 'education'
                          ? GraduationCapIcon
                          : SparklesIcon
                      }
                      size={16}
                    />
                  </span>
                  <span className="flex flex-col">
                    <time
                      dateTime={date}
                      className="text-xs text-muted-foreground tabular-nums group-hover:text-foreground"
                    >
                      {formatMonthYear(date)}
                    </time>
                    <span className="text-sm text-foreground underline-offset-4 group-hover:underline">
                      {exp.title} · {exp.organization}
                    </span>
                  </span>
                </ExperienceLink>
              </div>
            )
          })}

          <ol className="relative flex flex-col gap-6 pt-4 pb-6">
            {lanes.map(({ organization, roles }, laneIndex) => {
              const [first] = roles as [Experience, ...Experience[]]
              const last = roles.at(-1) ?? first
              const start = position(first.startDate)
              const end = position(last.endDate ?? today)
              // A lane in the right half hangs its labels off its end, so the
              // text never runs past the scale.
              const alignEnd = start > 50
              // Cards open toward the middle of the chart, never off an edge
              // of its scroll container, which would clip them.
              const side = laneIndex < lanes.length / 2 ? 'below' : 'above'

              return (
                <li
                  key={organization}
                  style={{ '--start': `${start}%`, '--after': `${100 - end}%` }}
                  data-slot="experiences-lane"
                >
                  <div
                    className={cn(
                      'mb-2 flex',
                      alignEnd ? 'justify-end pr-(--after)' : 'pl-(--start)',
                    )}
                  >
                    <ExperienceLink
                      experience={last}
                      placement={{ side, align: alignEnd ? 'end' : 'start' }}
                      className={cn(
                        'relative flex items-center gap-2 rounded-md bg-background',
                        alignEnd && 'flex-row-reverse',
                      )}
                    >
                      <ExperienceLogo experience={last} />
                      <span className="text-sm text-foreground underline-offset-4 group-hover:underline">
                        {organization}
                      </span>
                    </ExperienceLink>
                  </div>

                  <ol className="relative h-3">
                    {roles.map((exp, index) => {
                      const from = position(exp.startDate)
                      const to = position(exp.endDate ?? today)
                      const next = roles[index + 1]
                      // A label stops short of the next role on its lane and
                      // wraps instead of running into it. The width is a share
                      // of this role's own box, which is the label's parent.
                      const room =
                        next && to > from
                          ? `calc(${((position(next.startDate) - from) / (to - from)) * 100}% - 0.75rem)`
                          : 'none'
                      return (
                        <li
                          key={exp.slug}
                          className="absolute inset-y-0 left-(--from) w-(--span)"
                          style={{
                            '--from': `${from}%`,
                            '--span': `${to - from}%`,
                            '--brand': exp.color,
                            '--room': room,
                          }}
                          data-slot="experiences-role"
                        >
                          <ExperienceLink
                            experience={exp}
                            label={`${exp.title} at ${exp.organization}`}
                            placement={{
                              side,
                              align: from > 50 ? 'end' : 'start',
                            }}
                            className="relative block h-full"
                          >
                            {/* The fill is its own element: opacity or a
                                filter on the link would also apply to, and
                                trap, its preview card. */}
                            <span
                              className={cn(
                                'block h-full rounded-full transition group-hover:brightness-110',
                                exp.color
                                  ? 'brand-fill'
                                  : exp.kind === 'work' ||
                                      exp.kind === 'internship'
                                    ? 'bg-primary'
                                    : 'bg-secondary',
                                exp.kind === 'internship' && 'opacity-50',
                                !exp.endDate && 'rounded-r-none',
                              )}
                            />
                          </ExperienceLink>
                          <span
                            className={cn(
                              'absolute top-4 flex w-max max-w-(--room) flex-col bg-background',
                              alignEnd ? 'right-0 text-right' : 'left-0',
                            )}
                          >
                            <span className="text-xs text-muted-foreground tabular-nums">
                              <ExperienceDateRange experience={exp} />
                            </span>
                            <span className="text-sm text-foreground">
                              {exp.title}
                            </span>
                          </span>
                        </li>
                      )
                    })}
                  </ol>
                  <div className="h-16" aria-hidden />
                </li>
              )
            })}
          </ol>

          <div
            className="relative h-6 border-t border-border text-xs text-muted-foreground tabular-nums"
            aria-hidden
            data-slot="experiences-axis"
          >
            {ticks.map((tick) => (
              <span
                key={tick.date}
                className={cn(
                  'absolute top-0 left-(--at) w-px bg-border',
                  tick.year ? 'h-2' : 'h-1',
                )}
                style={{ '--at': `${position(tick.date)}%` }}
              >
                {tick.year && (
                  <span className="absolute top-2.5 -translate-x-1/2">
                    {tick.year}
                  </span>
                )}
              </span>
            ))}
            <time dateTime={origin} className="absolute top-2.5 left-0">
              {formatMonthYear(origin)}
            </time>
            <span className="absolute top-2.5 right-0">Today</span>
          </div>
        </div>
      </div>
    </Slice>
  )
}
