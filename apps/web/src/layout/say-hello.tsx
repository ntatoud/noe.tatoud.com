import type { ReactNode } from 'react'

import { Mail01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Monogram } from '@/components/monogram'
import { ButtonAnchor } from '@/components/ui/button-link'
import { cn } from '@/lib/utils'

import { CONTACT_EMAIL, emailHref } from './site-config'

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
  return (
    <aside
      id="say-hello"
      aria-labelledby="say-hello-title"
      className={cn(
        'relative flex scroll-mt-8 flex-col gap-6 overflow-hidden rounded-3xl border border-clay-200/70 bg-clay-50 p-6 sm:flex-row sm:items-start sm:p-8 dark:border-clay-900 dark:bg-clay-950/60',
        className,
      )}
      data-slot="say-hello"
    >
      <Monogram className="size-14 text-2xl" />
      <div className="flex min-w-0 flex-col gap-3">
        <h2
          id="say-hello-title"
          className="text-2xl text-foreground sm:text-3xl"
        >
          {title}
        </h2>
        <div className="max-w-prose text-base text-pretty text-muted-foreground sm:text-lg">
          {children}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-3">
          <ButtonAnchor href={emailHref(subject)} size="lg">
            <HugeiconsIcon
              icon={Mail01Icon}
              size={18}
              data-icon="inline-start"
            />
            Write to me
          </ButtonAnchor>
          <a
            href={emailHref(subject)}
            className="rounded-sm text-sm text-muted-foreground underline decoration-border underline-offset-4 outline-none hover:text-foreground hover:decoration-current focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
        <p className="text-sm text-muted-foreground">
          I read every message and usually answer within a few days.
        </p>
      </div>
    </aside>
  )
}
