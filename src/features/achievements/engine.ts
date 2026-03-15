import {
  createAchievements,
  defineAchievements,
  localStorageAdapter,
} from 'achievements-react'
import { notificationPopSound } from '@/lib/notification-pop'
import { getSoundMuted } from '@/hooks/use-sound-muted'
import { playSound } from '@/lib/sound-engine'

const definitions = defineAchievements([
  {
    id: 'first-visit',
    label: 'Welcome',
    description: 'Visited the site for the first time.',
    hidden: false,
    hint: false,
  },
  {
    id: 'returning',
    label: "I'm Back",
    description: 'Returned for a second visit.',
    hidden: false,
    hint: false,
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
    hint: false,
  },
  {
    id: 'explorer',
    label: 'Explorer',
    description: 'Visited every section of the site.',
    hidden: false,
    maxProgress: 3,
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
    hint: false,
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
  {
    id: 'click-frenzy',
    label: 'Click Frenzy',
    description: 'Clicked 100 times on the site.',
    hidden: false,
    maxProgress: 100,
  },
  {
    id: 'lost',
    label: 'How did I get here??',
    description: 'Stumbled onto a 404 page.',
    hidden: true,
  },
  {
    id: 'command-palette',
    label: 'Power User',
    description: 'Opened the command palette.',
    hidden: true,
  },
  {
    id: 'riddle',
    label: 'Riddlemaster',
    description:
      'Make an offering to the shrine by solving the riddle for 7 days.',
    hidden: false,
    hint: true,
    maxProgress: 7,
  },
])

export type AchievementId = (typeof definitions)[number]['id']

export { definitions }

export const {
  engine,
  Provider,
  useAchievements,
  useIsUnlocked,
  useProgress,
  useAchievementToast,
  useUnlockedCount,
} = createAchievements({
  definitions,
  storage: localStorageAdapter('noe.tatoud.com'),
  onUnlock: () => {
    if (!getSoundMuted()) {
      void playSound(notificationPopSound.dataUri, { volume: 0.3 })
    }
  },
})
