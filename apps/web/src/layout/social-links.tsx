import { HugeiconsIcon } from '@hugeicons/react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { socialLinks, type SocialLink } from './site-config'

type SocialLinksProps = {
  className?: string
}

export function SocialLinks({ className }: SocialLinksProps) {
  return (
    <div
      className={cn('flex items-center gap-1', className)}
      data-slot="social-links"
    >
      {socialLinks.map((link) => (
        <SocialLinkButton key={link.id} link={link} />
      ))}
    </div>
  )
}

function SocialLinkButton({ link }: { link: SocialLink }) {
  const isExternal = !link.href.startsWith('mailto:')
  const externalProps = isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Button
      variant="ghost"
      size="icon"
      render={
        <a
          href={link.href}
          aria-label={link.label}
          data-social={link.id}
          {...externalProps}
        />
      }
    >
      <HugeiconsIcon icon={link.icon} size={18} />
    </Button>
  )
}
