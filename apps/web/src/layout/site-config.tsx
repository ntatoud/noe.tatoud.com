import {
  BlueskyIcon,
  ChampionIcon,
  Github01Icon,
  Linkedin01Icon,
  Mail01Icon,
  Menu01Icon,
  NewTwitterIcon,
} from '@hugeicons/core-free-icons'

export type NavItem = {
  label: string
  href: string
}

/** Primary header navigation, in display order. */
export const navItems: readonly NavItem[] = [
  { label: 'Blog', href: '/blog' },
  { label: 'Projects', href: '/projects' },
  { label: 'Talks', href: '/talks' },
  { label: 'Experiences', href: '/experiences' },
] as const

export type SocialLink = {
  id: string
  label: string
  href: string
  icon: typeof Github01Icon
}

/** Social links, in display order. GitHub → LinkedIn → Bluesky → X → email. */
export const socialLinks: readonly SocialLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/ntatoud',
    icon: Github01Icon,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/ntatoud',
    icon: Linkedin01Icon,
  },
  {
    id: 'bluesky',
    label: 'Bluesky',
    href: 'https://bsky.app/profile/ntatoud.bsky.social',
    icon: BlueskyIcon,
  },
  {
    id: 'x',
    label: 'X',
    href: 'https://x.com/ntatoud',
    icon: NewTwitterIcon,
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:noe@bearstudio.fr',
    icon: Mail01Icon,
  },
] as const

/** Trophy icon used by the header for the `/achievements` link. */
export const trophyIcon = ChampionIcon
export const menuIcon = Menu01Icon
