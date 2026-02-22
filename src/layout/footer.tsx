import type { ReactElement, SVGProps } from 'react'
import {
  PixelGitHub,
  PixelLinkedIn,
  PixelMail,
  PixelSourceCode,
} from '@/components/icons'
import { useAchievements } from '@/features/achievements/use-achievements'
import { cn } from '@/lib/utils'

export function Footer() {
  const { unlock } = useAchievements()

  return (
    <footer className="border-t-2 border-border bg-card">
      <div className="container mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 py-12 md:px-0">
        <div className="flex flex-col items-center gap-4">
          <p className="font-head text-sm tracking-widest text-muted-foreground uppercase">
            Let&apos;s connect
          </p>
          <div className="flex items-center gap-0">
            <FooterLink
              href="https://github.com/ntatoud"
              label="GitHub"
              icon={PixelGitHub}
              onClick={() => unlock('social')}
            />
            <FooterLink
              href="https://linkedin.com/in/noetatoud"
              label="LinkedIn"
              icon={PixelLinkedIn}
              onClick={() => unlock('social')}
            />
            <FooterLink
              href="mailto:noe.tatoud@gmail.com"
              label="Email"
              icon={PixelMail}
              onClick={() => unlock('social')}
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4 border-t-2 border-border pt-8">
          <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase">
            <PixelSourceCode size={14} aria-hidden="true" />
            <span>Built with React, TanStack &amp; Tailwind</span>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Noe Tatoud. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

type PixelIconComponent = (
  props: SVGProps<SVGSVGElement> & { size?: number },
) => ReactElement

function FooterLink({
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
