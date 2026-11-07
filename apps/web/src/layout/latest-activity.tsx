import { Link } from '@tanstack/react-router'

import { blogPosts, talks } from 'virtual:content'

import { eventPlace } from '@/features/talks/event-place'
import { formatMonthYear } from '@/lib/format'

type Activity = {
  kind: 'post' | 'talk'
  title: string
  date: string
  link:
    | { external: true; href: string }
    | { external: false; to: '/blog/$slug' | '/talks/$slug'; slug: string }
}

const activities: Activity[] = [
  ...blogPosts.map((post): Activity => ({
    kind: 'post',
    title: post.title,
    date: post.date,
    link:
      post.externalUrl !== null
        ? { external: true, href: post.externalUrl }
        : { external: false, to: '/blog/$slug', slug: post.slug },
  })),
  ...talks.flatMap((talk) =>
    talk.events.map((event): Activity => ({
      kind: 'talk',
      title: `${talk.title}, at ${eventPlace(event)}`,
      date: event.date,
      link: { external: false, to: '/talks/$slug', slug: talk.slug },
    })),
  ),
]

const latest: Activity | undefined = activities
  .filter((activity) => activity.date <= import.meta.env.BUILD_DATE)
  .sort((a, b) => b.date.localeCompare(a.date))[0]

export function LatestActivity({ linkClassName }: { linkClassName: string }) {
  if (!latest) return null
  const { kind, title, date, link } = latest
  return (
    <>
      {' '}
      · Latest {kind}:{' '}
      {link.external ? (
        <a
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className={linkClassName}
        >
          {title}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <Link
          to={link.to}
          params={{ slug: link.slug }}
          className={linkClassName}
        >
          {title}
        </Link>
      )}
      , <time dateTime={date}>{formatMonthYear(date)}</time>
    </>
  )
}
