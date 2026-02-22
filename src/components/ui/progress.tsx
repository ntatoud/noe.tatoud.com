import { cn } from '@/lib/utils'

export function PixelProgress({
  value,
  max,
  label,
  className,
}: {
  value: number
  max: number
  label?: string
  className?: string
}) {
  const segments = Math.max(1, max)

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="flex gap-px"
      >
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 transition-colors duration-300',
              i < value ? 'bg-primary' : 'bg-muted',
            )}
          />
        ))}
      </div>
      {label && (
        <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          {label}
        </p>
      )}
    </div>
  )
}
