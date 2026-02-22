import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Hero, HeroSubtitle, HeroTitle } from '@/layout/hero'

interface PageErrorProps {
  code?: string | number
  title: string
  description?: string
}

export function PageError({
  code = '???',
  title,
  description,
}: PageErrorProps) {
  return (
    <div className="flex flex-1 items-center justify-around">
      <Hero>
        <p className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
          {code}
        </p>
        <HeroTitle>{title}</HeroTitle>
        {description && <HeroSubtitle>{description}</HeroSubtitle>}
        <Button variant="outline" render={<Link to="/" />} nativeButton={false}>
          Go home
        </Button>
      </Hero>
    </div>
  )
}
