import { Book, Home } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link, linkOptions } from '@tanstack/react-router'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const nav = linkOptions([
  {
    label: 'Home',
    icon: Home,
    to: '/',
    activeOptions: { exact: true },
  },
  {
    label: 'Blog',
    icon: Book,
    to: '/blog',
  },
])

export const navGlassStyles = 'bg-background/80 backdrop-blur-lg'

const navLinkVariants = cva(
  cn(
    'flex items-center rounded-lg text-muted-foreground',
    'transition-colors duration-200',
    'hover:text-foreground',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  ),
  {
    variants: {
      variant: {
        desktop: 'group relative flex-row gap-2 px-3 py-2 text-sm font-medium',
        mobile: 'min-h-11 min-w-11 flex-col justify-center gap-1 px-3 py-1.5',
      },
    },
    defaultVariants: { variant: 'desktop' },
  },
)

export function NavLink({
  variant = 'desktop',
  className,
  ...item
}: (typeof nav)[number] & {
  variant?: 'desktop' | 'mobile'
  className?: string
}) {
  return (
    <Link
      {...item}
      activeProps={{ className: 'text-primary' }}
      className={cn(navLinkVariants({ variant }), className)}
    >
      <HugeiconsIcon icon={item.icon} size={variant === 'mobile' ? 22 : 18} />
      {variant === 'mobile' ? (
        <span className="text-[0.625rem] leading-none font-medium">
          {item.label}
        </span>
      ) : (
        item.label
      )}
      {variant === 'desktop' && (
        <span
          className={cn(
            'absolute -bottom-0.5 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-primary',
            'transition-all duration-200',
            'group-hover:w-5',
            'group-data-[status=active]:w-5',
          )}
        />
      )}
    </Link>
  )
}
