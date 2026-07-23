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
        className="absolute top-[-20%] left-[-15%] h-[60vh] w-[60vh] rounded-full bg-moss-100/25 blur-[100px]"
        style={{ mixBlendMode: 'screen', imageRendering: 'pixelated' }}
      />

      {/* Honey — medium diffuse glow bottom-right */}
      <div
        className="absolute bottom-[-15%] right-[-10%] h-[50vh] w-[50vh] rounded-full bg-honey-100/20 blur-[80px]"
        style={{ mixBlendMode: 'screen', imageRendering: 'pixelated' }}
      />

      {/* Moss — small accent top-right */}
      <div
        className="absolute top-[5%] right-[10%] h-[20vh] w-[20vh] rounded-full bg-moss-100/15 blur-[50px]"
        style={{ mixBlendMode: 'screen', imageRendering: 'pixelated' }}
      />

      {/* Honey — small accent bottom-left */}
      <div
        className="absolute bottom-[5%] left-[10%] h-[25vh] w-[25vh] rounded-full bg-honey-100/15 blur-[50px]"
        style={{ mixBlendMode: 'screen', imageRendering: 'pixelated' }}
      />
    </div>
  )
}
