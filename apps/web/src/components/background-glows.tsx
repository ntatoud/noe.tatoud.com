import { cn } from '@/lib/utils'

type GlowProps = {
  className?: string
}

export function BackgroundGlows({ className }: GlowProps) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 -z-10 overflow-hidden',
        className,
      )}
      aria-hidden="true"
    >
      {/* Moss — large glow top-left */}
      <div
        className="absolute top-[-20%] left-[-15%] h-[60vh] w-[60vh] rounded-full bg-moss-500/50 blur-[40px]"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Honey — medium glow bottom-right */}
      <div
        className="absolute bottom-[-15%] right-[-10%] h-[50vh] w-[50vh] rounded-full bg-honey-500/40 blur-[30px]"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Moss — small accent top-right */}
      <div
        className="absolute top-[5%] right-[10%] h-[20vh] w-[20vh] rounded-full bg-moss-400/30 blur-[20px]"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Honey — small accent bottom-left */}
      <div
        className="absolute bottom-[5%] left-[10%] h-[25vh] w-[25vh] rounded-full bg-honey-400/25 blur-[20px]"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
