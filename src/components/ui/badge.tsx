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
          'bg-primary text-primary-foreground [filter:drop-shadow(0_2px_0_var(--shelf-secondary))] [a]:hover:bg-primary/80',
        secondary:
          'bg-secondary text-secondary-foreground [filter:drop-shadow(0_2px_0_var(--shelf-neutral))] [a]:hover:bg-secondary/80',
        destructive:
          'bg-destructive text-destructive-foreground [filter:drop-shadow(0_2px_0_var(--shelf-destructive))] [a]:hover:bg-destructive/90',
        outline:
          'bg-muted text-foreground [filter:drop-shadow(0_1px_0_var(--shelf-neutral))] [a]:hover:bg-muted/80',
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

export { Badge, badgeVariants }
