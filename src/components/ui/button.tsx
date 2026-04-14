import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center border-2 border-transparent bg-clip-padding font-mono text-sm font-medium tracking-wide whitespace-nowrap uppercase transition-[filter,transform] duration-75 outline-none select-none clip-pixel focus-visible:[outline:2px_solid_currentColor] focus-visible:-outline-offset-4 disabled:pointer-events-none disabled:opacity-40 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'border-primary bg-primary text-primary-foreground pixel-shadow pixel-shadow-secondary hover:-translate-y-0.5 hover:brightness-90 hover:pixel-shadow-y-6 active:translate-y-0.75 active:pixel-shadow-y-1',
        outline:
          'bg-border bg-clip-border text-foreground pixel-shadow pixel-shadow-neutral before:absolute before:inset-0 before:-z-10 before:bg-background before:content-[""] before:clip-pixel hover:-translate-y-0.5 hover:pixel-shadow-y-6 hover:before:bg-muted active:translate-y-0.75 active:pixel-shadow-y-1',
        secondary:
          'bg-border bg-clip-border text-secondary-foreground pixel-shadow pixel-shadow-neutral before:absolute before:inset-0 before:-z-10 before:bg-secondary before:content-[""] before:clip-pixel hover:-translate-y-0.5 hover:pixel-shadow-y-6 hover:before:bg-secondary/80 active:translate-y-0.75 active:pixel-shadow-y-1',
        ghost:
          'border-transparent hover:-translate-y-0.5 hover:bg-muted active:translate-y-0.5 active:bg-muted/80',
        destructive:
          'border-destructive bg-destructive text-destructive-foreground pixel-shadow pixel-shadow-destructive hover:-translate-y-0.5 hover:bg-destructive/90 hover:pixel-shadow-y-6 active:translate-y-0.75 active:pixel-shadow-y-1',
        link: 'clip-none border-transparent text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 gap-2 px-4',
        xs: 'h-6 gap-1 px-2 text-xs',
        sm: 'h-7 gap-1.5 px-3 text-xs',
        lg: 'h-11 gap-2 px-6 text-base',
        icon: 'size-9',
        'icon-xs': 'size-6',
        'icon-sm': 'size-7',
        'icon-lg': 'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
