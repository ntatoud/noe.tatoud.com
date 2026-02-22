export type AchievementId =
  | 'first-visit'
  | 'returning'
  | 'night-owl'
  | 'audiophile'
  | 'explorer'
  | 'reader'
  | 'completionist'
  | 'pixel-clicker'
  | 'social'
  | 'keyboard'
  | 'secret'

export type Achievement = {
  id: AchievementId
  label: string
  description: string
  hidden: boolean
}

export const ACHIEVEMENTS: Array<Achievement> = [
  {
    id: 'first-visit',
    label: 'Welcome',
    description: 'Visited the site for the first time.',
    hidden: false,
  },
  {
    id: 'returning',
    label: "I'm Back",
    description: 'Returned for a second visit.',
    hidden: false,
  },
  {
    id: 'night-owl',
    label: 'Night Owl',
    description: 'Visited between midnight and 5 AM.',
    hidden: false,
  },
  {
    id: 'audiophile',
    label: 'Audiophile',
    description: 'Toggled the sound on.',
    hidden: false,
  },
  {
    id: 'explorer',
    label: 'Explorer',
    description: 'Visited every section of the site.',
    hidden: false,
  },
  {
    id: 'reader',
    label: 'Reader',
    description: 'Read a blog post all the way through.',
    hidden: false,
  },
  {
    id: 'completionist',
    label: 'Completionist',
    description: 'Read every blog post.',
    hidden: false,
  },
  {
    id: 'pixel-clicker',
    label: 'Pixel Perfect',
    description: 'Found the clickable avatar.',
    hidden: true,
  },
  {
    id: 'social',
    label: 'Social Butterfly',
    description: 'Clicked a social link.',
    hidden: false,
  },
  {
    id: 'keyboard',
    label: 'Keyboard Warrior',
    description: 'Navigated the site with the keyboard.',
    hidden: true,
  },
  {
    id: 'secret',
    label: 'Konami',
    description: '↑ ↑ ↓ ↓ ← → ← → B A',
    hidden: true,
  },
]
