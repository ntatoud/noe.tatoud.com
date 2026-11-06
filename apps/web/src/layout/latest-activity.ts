import { blogPosts, talks } from 'virtual:content'

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
      title: `${talk.title}, at ${event.event}`,
      date: event.date,
      link: { external: false, to: '/talks/$slug', slug: talk.slug },
    })),
  ),
]

export const latestActivity: Activity | undefined = activities.sort((a, b) =>
  b.date.localeCompare(a.date),
)[0]
