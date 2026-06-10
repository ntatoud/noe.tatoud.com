import type { SVGProps } from 'react'

import {
  PixelBluesky,
  PixelGitHub,
  PixelLinkedIn,
  PixelMail,
  PixelX,
} from '@/components/icons'
import { useAchievements } from '@/features/achievements/engine'
import { cn } from '@/lib/utils'

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

type SocialId = (typeof socialLinks)[number]['id']

export function SocialLinks({
  exclude = [],
  className,
}: {
  exclude?: ReadonlyArray<SocialId>
  className?: string
}) {
  const { unlock } = useAchievements()

  return (
    <div className={cn('flex items-center gap-0', className)}>
      {socialLinks
        .filter((link) => !exclude.includes(link.id))
        .map((link) => (
          <SocialLink
            key={link.id}
            href={link.href}
            label={link.label}
            icon={link.icon}
            onClick={() => unlock('social')}
          />
        ))}
    </div>
  )
}

type PixelIconComponent = (
  props: SVGProps<SVGSVGElement> & { size?: number },
) => React.ReactElement

function SocialLink({
  href,
  label,
  icon: Icon,
  onClick,
}: {
  href: string
  label: string
  icon: PixelIconComponent
  onClick?: () => void
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'group relative flex size-10 items-center justify-center border-2 border-transparent',
        'text-muted-foreground',
        'transition-colors duration-100',
        'hover:border-border hover:bg-muted hover:text-foreground',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      )}
    >
      <Icon size={20} />
    </a>
  )
}
