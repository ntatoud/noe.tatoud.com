import { cn } from '@/lib/utils'

export function Monogram({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-primary pt-0.5 font-serif leading-none text-primary-foreground select-none',
        className,
      )}
      aria-hidden
      data-slot="monogram"
    >
      N
    </span>
  )
}
