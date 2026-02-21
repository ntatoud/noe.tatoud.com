import { Section, SectionTitle } from '@/layout/section'
import { cn } from '@/lib/utils'

function Hero({ className, ...props }: React.ComponentProps<typeof Section>) {
  return (
    <div
      className={cn(
        'relative flex min-h-[50vh] flex-col items-center justify-center overflow-hidden pt-12 md:pt-16',
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
      className={cn('text-5xl text-balance', props.className)}
    />
  )
}

function HeroSubtitle(props: React.ComponentProps<'p'>) {
  return (
    <p
      {...props}
      className={cn(
        'text-center text-xl text-pretty text-primary',
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
