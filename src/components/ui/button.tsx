import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { playClickSound } from '@/lib/sound'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center border-2 border-transparent bg-clip-padding font-mono text-sm font-medium tracking-wide whitespace-nowrap uppercase transition-[filter,transform] duration-75 outline-none select-none clip-pixel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-40 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'border-primary bg-primary text-primary-foreground [filter:drop-shadow(0_4px_0_var(--shelf-secondary))] hover:-translate-y-0.5 hover:brightness-90 hover:[filter:drop-shadow(0_6px_0_var(--shelf-secondary))] active:translate-y-[3px] active:[filter:drop-shadow(0_1px_0_var(--shelf-secondary))]',
        outline:
          'bg-border bg-clip-border text-foreground [filter:drop-shadow(0_4px_0_var(--shelf-neutral))] before:absolute before:inset-0 before:-z-10 before:bg-background before:content-[""] before:clip-pixel hover:-translate-y-0.5 hover:[filter:drop-shadow(0_6px_0_var(--shelf-neutral))] hover:before:bg-muted active:translate-y-[3px] active:[filter:drop-shadow(0_1px_0_var(--shelf-neutral))]',
        secondary:
          'bg-border bg-clip-border text-secondary-foreground [filter:drop-shadow(0_4px_0_var(--shelf-neutral))] before:absolute before:inset-0 before:-z-10 before:bg-secondary before:content-[""] before:clip-pixel hover:-translate-y-0.5 hover:[filter:drop-shadow(0_6px_0_var(--shelf-neutral))] hover:before:bg-secondary/80 active:translate-y-[3px] active:[filter:drop-shadow(0_1px_0_var(--shelf-neutral))]',
        ghost: 'border-transparent hover:bg-muted active:bg-muted/80',
        destructive:
          'border-destructive bg-destructive text-destructive-foreground [filter:drop-shadow(0_4px_0_var(--shelf-destructive))] hover:-translate-y-0.5 hover:bg-destructive/90 hover:[filter:drop-shadow(0_6px_0_var(--shelf-destructive))] active:translate-y-[3px] active:[filter:drop-shadow(0_1px_0_var(--shelf-destructive))]',
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

const SILENT_VARIANTS = new Set(['link'])

function Button({
  className,
  variant = 'default',
  size = 'default',
  onClick,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const handleClick: typeof onClick = SILENT_VARIANTS.has(variant ?? 'default')
    ? onClick
    : (e) => {
        playClickSound()
        onClick?.(e)
      }

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      {...props}
    />
  )
}

export { Button, buttonVariants }
