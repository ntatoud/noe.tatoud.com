import {
  PixelBluesky,
  PixelGitHub,
  PixelLinkedIn,
  PixelMail,
  PixelX,
} from '@/components/icons'

export const socialLinks = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/ntatoud',
    icon: PixelGitHub,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/ntatoud',
    icon: PixelLinkedIn,
  },
  {
    id: 'bluesky',
    label: 'Bluesky',
    href: 'https://bsky.app/profile/ntatoud.bsky.social',
    icon: PixelBluesky,
  },
  {
    id: 'x',
    label: 'X',
    href: 'https://x.com/ntatoud',
    icon: PixelX,
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:noe.tatoud@gmail.com',
    icon: PixelMail,
  },
] as const
