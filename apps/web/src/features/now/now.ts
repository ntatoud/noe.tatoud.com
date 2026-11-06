// Draft written from the author's own posts, talks and experiences: the author reviews it before publishing.
export const NOW_UPDATED = '2026-11-06'

export type NowEntry = {
  heading: string
  body: string
}

export const NOW: ReadonlyArray<NowEntry> = [
  {
    heading: 'Working',
    body: 'Software engineer at Peinture since June 2026.',
  },
  {
    heading: 'Learning',
    body: 'To work with coding agents as my main way of writing code: specs and tests first, then reviewing every diff the way I would review a colleague’s pull request.',
  },
  {
    heading: 'Doubting',
    body: 'Skill atrophy. Am I losing the ability to debug deeply because I let agents handle it? I still work through some problems by hand, not because it is efficient but because it is exercise.',
  },
  {
    heading: 'Giving back',
    body: 'Volunteering with the Fork it! Community, where I help kids aged 14 to 16 build their first game in the browser.',
  },
  {
    heading: 'Curious about',
    body: 'Server Components in TanStack Start, and whether this site ever needs them.',
  },
]
