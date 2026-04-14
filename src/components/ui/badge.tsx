import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 px-2 py-0.5 font-mono text-xs font-medium tracking-wide whitespace-nowrap uppercase transition-[filter] clip-pixel-xs focus-visible:outline-2 focus-visible:outline-ring has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground pixel-shadow pixel-shadow-secondary pixel-shadow-y-2 [a]:hover:bg-primary/80',
        secondary:
          'bg-secondary text-secondary-foreground pixel-shadow pixel-shadow-neutral pixel-shadow-y-2 [a]:hover:bg-secondary/80',
        destructive:
          'bg-destructive text-destructive-foreground pixel-shadow pixel-shadow-destructive pixel-shadow-y-2 [a]:hover:bg-destructive/90',
        outline:
          'relative bg-border text-foreground pixel-shadow pixel-shadow-neutral pixel-shadow-y-2 before:absolute before:inset-px before:-z-10 before:bg-muted before:content-[""] before:clip-pixel-xs [a]:hover:before:bg-muted/80',
        ghost: 'hover:bg-muted hover:text-muted-foreground',
        link: 'clip-none text-primary underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant = 'default',
  render,
  ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ className, variant })),
      },
      props,
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  })
}

export { Badge }
