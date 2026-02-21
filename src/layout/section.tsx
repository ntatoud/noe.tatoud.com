import { cn } from '@/lib/utils'
import { Text } from '@/components/ui/text'

function Section(props: React.ComponentProps<'section'>) {
  return (
    <section
      {...props}
      className={cn(
        'container mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-20 md:px-0',
        props.className,
      )}
    />
  )
}

function SectionTitle(props: React.ComponentProps<typeof Text>) {
  return (
    <Text
      render={<h2 />}
      data-slot="section-title"
      {...props}
      className={cn(
        'font-head text-3xl font-bold text-balance uppercase',
        props.className,
      )}
    />
  )
}

function SectionHeader(props: React.ComponentProps<'header'>) {
  return (
    <header
      data-slot="section-header"
      {...props}
      className={cn(
        'flex w-full flex-col items-center justify-center',
        'has-data-[slot=section-actions]:flex-row has-data-[slot=section-actions]:justify-between',
        props.className,
      )}
    />
  )
}

function SectionActions(props: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="section-actions"
      {...props}
      className={cn('flex flex-row gap-2', props.className)}
    />
  )
}

function SectionContent(props: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="section-content"
      {...props}
      className={cn('flex w-full flex-col py-8', props.className)}
    />
  )
}
export { Section, SectionTitle, SectionHeader, SectionContent, SectionActions }
