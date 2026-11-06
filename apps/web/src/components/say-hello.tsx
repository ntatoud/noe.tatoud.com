import { useId, useState, type ReactNode } from 'react'

import { Copy01Icon, Mail01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Button } from '@/components/ui/button'
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
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <span className="select-all">{CONTACT_EMAIL}</span>
          <CopyEmailButton />
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        I read every message and usually answer within a few days.
      </p>
    </aside>
  )
}

function CopyEmailButton() {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={copied ? 'Email address copied' : 'Copy email address'}
      onClick={() => {
        void navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
          setCopied(true)
        })
      }}
    >
      <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={16} />
    </Button>
  )
}
