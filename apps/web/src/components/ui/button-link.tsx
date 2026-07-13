import * as React from 'react'

import { createLink, type LinkComponent } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

type ButtonAnchorProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'color' | 'hidden'
> &
  Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'>

function ButtonAnchor({ variant, size, children, ...rest }: ButtonAnchorProps) {
  return (
    <Button
      variant={variant}
      size={size}
      nativeButton={false}
      render={<a {...rest} />}
    >
      {children}
    </Button>
  )
}

type ButtonLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'color' | 'hidden'
> &
  Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'> & {
    ref?: React.Ref<HTMLAnchorElement>
  }

function ButtonLinkComponent({
  variant,
  size,
  children,
  ref,
  ...rest
}: ButtonLinkProps) {
  return (
    <Button
      variant={variant}
      size={size}
      nativeButton={false}
      render={<a ref={ref} {...rest} />}
    >
      {children}
    </Button>
  )
}

const CreatedLinkComponent = createLink(ButtonLinkComponent)

export const ButtonLink: LinkComponent<typeof ButtonLinkComponent> = (
  props,
) => <CreatedLinkComponent preload="intent" {...props} />

export { ButtonAnchor }
