// Draft written from the author's own posts, talks and experiences: the author reviews it before publishing.
export const NOW_UPDATED = '2026-11-06'

export type NowEntry = {
  heading: string
  body: string
  source?: {
    label: string
    to: '/blog/$slug' | '/talks/$slug'
    slug: string
  }
}

export const NOW: ReadonlyArray<NowEntry> = [
  {
    heading: 'Working',
    body: 'Software engineer at Peinture since June 2026, and still a fullstack developer at BearStudio, where I started as an intern in 2023.',
  },
  {
    heading: 'Learning',
    body: "To get better at working with coding agents: specs and tests first, then reviewing every diff the way I would review a colleague's pull request.",
    source: {
      label: 'How AI is changing the way I work',
      to: '/blog/$slug',
      slug: 'how-is-ai-changing-the-way-i-work-as-a-developer',
    },
  },
  {
    heading: 'Doubting',
    body: 'Skill atrophy. Am I losing the ability to debug deeply because I let agents handle it? I still work through some problems by hand, not because it is efficient but because it is exercise.',
  },
  {
    heading: 'Giving back',
    body: 'Volunteering with the Fork it! Community, where I help kids aged 14 to 16 build their first game in the browser.',
    source: {
      label: 'The workshop',
      to: '/talks/$slug',
      slug: 'build-your-first-game-with-kaplay',
    },
  },
  {
    heading: 'Curious about',
    body: 'Server Components in TanStack Start, and whether this site ever needs them.',
    source: {
      label: 'Why I moved this site to TanStack Start',
      to: '/blog/$slug',
      slug: 'why-i-migrated-from-astro-to-tanstack-start',
    },
  },
]
