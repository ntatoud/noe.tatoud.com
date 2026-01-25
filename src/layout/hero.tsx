import { Section, SectionTitle } from '@/layout/section'
import { cn } from '@/lib/utils'

function Hero(props: React.ComponentProps<typeof Section>) {
  return <Section {...props} />
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
      className={cn('text-xl text-muted-foreground', props.className)}
    />
  )
}

export { Hero, HeroTitle, HeroSubtitle }
