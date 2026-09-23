import * as React from 'react'

import { createLink, type LinkComponent } from '@tanstack/react-router'

import type { VariantProps } from 'class-variance-authority'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ButtonLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'color' | 'hidden'
> &
  VariantProps<typeof buttonVariants> & {
    ref?: React.Ref<HTMLAnchorElement>
  }

// A link is not a button, so it doesn't go through base-ui's `Button`
// (which would add `role="button"`).
function ButtonLinkComponent({
  variant,
  size,
  className,
  children,
  ref,
  ...rest
}: ButtonLinkProps) {
  return (
    <a
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...rest}
    >
      {children}
    </a>
  )
}

const CreatedLinkComponent = createLink(ButtonLinkComponent)

export const ButtonLink: LinkComponent<typeof ButtonLinkComponent> = (
  props,
) => <CreatedLinkComponent preload="intent" {...props} />

export { ButtonLinkComponent as ButtonAnchor }
