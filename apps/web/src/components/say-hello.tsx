import { useId, type ReactNode } from 'react'

import { Mail01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { ButtonAnchor } from '@/components/ui/button-link'
import { CONTACT_EMAIL, emailHref } from '@/layout/site-config'
import { cn } from '@/lib/utils'

type SayHelloProps = {
  title: string
  children: ReactNode
  subject?: string
  className?: string
}

export function SayHello({
  title,
  children,
  subject,
  className,
}: SayHelloProps) {
  const titleId = useId()
  const href = emailHref(subject)

  return (
    <aside
      aria-labelledby={titleId}
      className={cn(
        'flex flex-col gap-3 rounded-3xl border border-clay-200/70 bg-clay-50 p-6 sm:p-8 dark:border-clay-900 dark:bg-clay-950/60',
        className,
      )}
      data-slot="say-hello"
    >
      <h2 id={titleId} className="text-2xl text-foreground sm:text-3xl">
        {title}
      </h2>
      <div className="max-w-prose text-base text-pretty text-muted-foreground sm:text-lg">
        {children}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-3">
        <ButtonAnchor href={href} size="lg">
          <HugeiconsIcon icon={Mail01Icon} size={18} data-icon="inline-start" />
          Write to me
        </ButtonAnchor>
        <a
          href={href}
          className="rounded-sm text-sm text-muted-foreground underline decoration-border underline-offset-4 outline-none hover:text-foreground hover:decoration-current focus-visible:ring-3 focus-visible:ring-ring"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
      <p className="text-sm text-muted-foreground">
        I read every message and usually answer within a few days.
      </p>
    </aside>
  )
}
