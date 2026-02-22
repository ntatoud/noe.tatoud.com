import { Section, SectionTitle } from '@/layout/section'
import { cn } from '@/lib/utils'

function Hero({ className, ...props }: React.ComponentProps<typeof Section>) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden pt-28 pb-12 md:pt-36 md:pb-16',
        className,
      )}
    >
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
      className={cn(
        'text-4xl leading-tight tracking-wide text-balance sm:text-5xl',
        props.className,
      )}
    />
  )
}

function HeroSubtitle(props: React.ComponentProps<'p'>) {
  return (
    <p
      {...props}
      className={cn(
        'text-center font-mono text-base text-pretty text-muted-foreground',
        props.className,
      )}
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
