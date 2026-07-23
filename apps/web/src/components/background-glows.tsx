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
      {/* Moss — large diffuse glow top-left */}
      <div
        className="absolute top-[-20%] left-[-15%] h-[60vh] w-[60vh] rounded-full bg-moss-300/15 blur-[80px]"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Honey — medium diffuse glow bottom-right */}
      <div
        className="absolute bottom-[-15%] right-[-10%] h-[50vh] w-[50vh] rounded-full bg-honey-300/12 blur-[60px]"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Moss — small accent top-right */}
      <div
        className="absolute top-[5%] right-[10%] h-[20vh] w-[20vh] rounded-full bg-moss-200/10 blur-[40px]"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Honey — small accent bottom-left */}
      <div
        className="absolute bottom-[5%] left-[10%] h-[25vh] w-[25vh] rounded-full bg-honey-200/10 blur-[40px]"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
