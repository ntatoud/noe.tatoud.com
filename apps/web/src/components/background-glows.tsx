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
      {/* Moss — large diffuse glow top-left (organic oval) */}
      <div className="absolute -top-[25%] -left-[20%] h-[55vh] w-[45vw] rounded-[40%] bg-moss-500/30 blur-[120px] pixelated" />

      {/* Honey — medium diffuse glow bottom-right (organic oval) */}
      <div className="absolute -bottom-[20%] -right-[15%] h-[45vh] w-[40vw] rounded-[35%] bg-honey-500/25 blur-[100px] pixelated" />

      {/* Moss — small accent top-right (rounded rectangle) */}
      <div className="absolute top-[5%] right-[5%] h-[18vh] w-[22vw] rounded-[30%] bg-moss-400/15 blur-[60px] pixelated" />

      {/* Honey — small accent bottom-left (rounded rectangle) */}
      <div className="absolute -bottom-[5%] left-[5%] h-[22vh] w-[20vw] rounded-[30%] bg-honey-400/12 blur-[60px] pixelated" />
    </div>
  )
}
