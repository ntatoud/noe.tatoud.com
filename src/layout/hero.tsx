import Grainient from '@/components/ui/grainient'
import { Section, SectionTitle } from '@/layout/section'
import { cn } from '@/lib/utils'

function Hero({ className, ...props }: React.ComponentProps<typeof Section>) {
  return (
    <div
      className={cn(
        'relative flex min-h-[50vh] flex-col items-center justify-center overflow-hidden md:pt-16',
        className,
      )}
    >
      <div className="absolute inset-0 z-0 flex w-full flex-1 mask-[linear-gradient(to_bottom,black_60%,transparent)]">
        <Grainient
          color1="#00D1FF"
          color2="#FFB8F2"
          color3="#00D1FF"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.2}
          grainScale={2}
          grainAnimated
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>
      <Section {...props} className="relative space-y-4 py-0" />
    </div>
  )
}

function HeroTitle(props: React.ComponentProps<typeof SectionTitle>) {
  return (
    <SectionTitle
      render={<h1 />}
      data-slot="hero-title"
      {...props}
      className={cn('text-5xl', props.className)}
    />
  )
}

function HeroSubtitle(props: React.ComponentProps<'p'>) {
  return (
    <p
      {...props}
      className={cn('text-center text-xl text-accent', props.className)}
    />
  )
}

function HeroActions(props: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="hero-actions"
      {...props}
      className={cn('flex flex-row gap-3', props.className)}
    />
  )
}

function HeroMeta(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'flex items-center gap-2 text-sm text-muted-foreground',
        props.className,
      )}
    />
  )
}

export { Hero, HeroTitle, HeroSubtitle, HeroActions, HeroMeta }
