import { Section, SectionContent } from '@/layout/section'
import { cn } from '@/lib/utils'

export function PicturesBento() {
  return (
    <Section>
      <SectionContent className="pictures-bento grid w-full grid-cols-3 grid-rows-2 gap-4 overflow-hidden p-2 md:overflow-visible">
        <BentoCard className="md:scale-125 md:-rotate-2">01</BentoCard>
        <BentoCard className="col-span-2 md:rotate-3">02</BentoCard>
        <BentoCard className="col-span-2 md:-rotate-1">03</BentoCard>
        <BentoCard className="md:scale-125 md:rotate-2">04</BentoCard>
      </SectionContent>
    </Section>
  )
}

export function BentoCard(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'flex min-h-60 items-center justify-center overflow-hidden rounded-md border border-white bg-secondary',
        props.className,
      )}
    />
  )
}
