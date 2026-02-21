import {
  Github01Icon,
  Linkedin01Icon,
  Mail01Icon,
  SourceCodeIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '@/lib/utils'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 py-12 md:px-0">
        <div className="flex flex-col items-center gap-4">
          <p className="font-head text-lg font-semibold text-balance">
            Let&apos;s connect
          </p>
          <div className="flex items-center gap-1">
            <FooterLink
              href="https://github.com/ntatoud"
              label="GitHub"
              icon={Github01Icon}
            />
            <FooterLink
              href="https://linkedin.com/in/noetatoud"
              label="LinkedIn"
              icon={Linkedin01Icon}
            />
            <FooterLink
              href="mailto:noe.tatoud@gmail.com"
              label="Email"
              icon={Mail01Icon}
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4 border-t border-border pt-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <HugeiconsIcon icon={SourceCodeIcon} size={16} />
            <span>Built with React, TanStack & Tailwind</span>
          </div>
          <p className="text-sm text-pretty text-muted-foreground">
            &copy; {new Date().getFullYear()} Noe Tatoud. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({
  href,
  label,
  icon,
}: {
  href: string
  label: string
  icon: typeof Github01Icon
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        'group relative flex size-10 items-center justify-center',
        'text-muted-foreground',
        'transition-colors duration-200',
        'hover:text-primary',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      )}
    >
      <HugeiconsIcon icon={icon} size={22} />
      <span
        className={cn(
          'absolute -bottom-1 left-1/2 h-0.5 w-5 origin-center -translate-x-1/2 scale-x-0 rounded-full bg-primary',
          'transition-transform duration-200',
          'group-hover:scale-x-100',
        )}
      />
    </a>
  )
}
