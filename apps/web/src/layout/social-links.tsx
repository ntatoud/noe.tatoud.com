import { HugeiconsIcon } from '@hugeicons/react'

import { ButtonAnchor } from '@/components/ui/button-link'
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
    <ButtonAnchor
      href={link.href}
      variant="ghost"
      size="icon"
      aria-label={link.label}
      data-social={link.id}
      {...externalProps}
    >
      <HugeiconsIcon icon={link.icon} size={18} />
    </ButtonAnchor>
  )
}
