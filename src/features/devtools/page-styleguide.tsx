import { useState } from 'react'
import { ArrowRight, Book, Home } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardList,
  CardTags,
  CardTitle,
} from '@/components/ui/card-list'
import { Input } from '@/components/ui/input'
import { Section, SectionTitle } from '@/layout/section'
import { cn } from '@/lib/utils'

const tabs = [
  'Buttons',
  'Badges',
  'Cards',
  'Inputs',
  'Typography',
  'Colors',
] as const

type Tab = (typeof tabs)[number]

const buttonVariantNames = [
  'default',
  'secondary',
  'outline',
  'ghost',
  'destructive',
  'link',
] as const

const buttonSizes = ['xs', 'sm', 'default', 'lg'] as const
const iconSizes = ['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const

const badgeVariantNames = [
  'default',
  'secondary',
  'destructive',
  'outline',
  'ghost',
  'link',
] as const

function TabButtons({
  active,
  onSelect,
}: {
  active: Tab
  onSelect: (tab: Tab) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant={active === tab ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(tab)}
        >
          {tab}
        </Button>
      ))}
    </div>
  )
}

function ButtonsTab() {
  return (
    <div className="flex w-full flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h3 className="font-head text-lg font-semibold">Variants</h3>
        <div className="flex flex-wrap items-center gap-4">
          {buttonVariantNames.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
          <Button disabled>disabled</Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-head text-lg font-semibold">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          {buttonSizes.map((size) => (
            <Button key={size} size={size}>
              {size}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-head text-lg font-semibold">Icon Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          {iconSizes.map((size) => (
            <Button key={size} size={size} variant="outline">
              <HugeiconsIcon icon={Home} />
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-head text-lg font-semibold">With Icons</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button>
            <HugeiconsIcon icon={Book} data-icon="inline-start" />
            Blog
          </Button>
          <Button variant="secondary">
            Continue
            <HugeiconsIcon icon={ArrowRight} data-icon="inline-end" />
          </Button>
          <Button variant="outline">
            <HugeiconsIcon icon={Home} data-icon="inline-start" />
            Home
          </Button>
          <Button variant="ghost">
            See more
            <HugeiconsIcon icon={ArrowRight} data-icon="inline-end" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-head text-lg font-semibold">
          Variant x Size Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="text-sm">
            <thead>
              <tr>
                <th className="pr-4 pb-2 text-left text-muted-foreground">
                  variant \ size
                </th>
                {buttonSizes.map((size) => (
                  <th
                    key={size}
                    className="px-2 pb-2 text-center text-muted-foreground"
                  >
                    {size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {buttonVariantNames.map((variant) => (
                <tr key={variant}>
                  <td className="py-2 pr-4 font-mono text-muted-foreground">
                    {variant}
                  </td>
                  {buttonSizes.map((size) => (
                    <td key={size} className="px-2 py-2 text-center">
                      <Button variant={variant} size={size}>
                        Label
                      </Button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function BadgesTab() {
  return (
    <div className="flex w-full flex-col gap-4">
      <h3 className="font-head text-lg font-semibold">Variants</h3>
      <div className="flex flex-wrap items-center gap-3">
        {badgeVariantNames.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </div>
    </div>
  )
}

function CardsTab() {
  return (
    <div className="flex w-full flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h3 className="font-head text-lg font-semibold">
          Interactive Cards (with link)
        </h3>
        <CardList>
          <Card>
            <a href="#" className="flex h-full">
              <CardContent>
                <CardTitle>Card with Link</CardTitle>
                <CardDescription>
                  This card is wrapped in a link. Hover to see the lift effect,
                  click to see the press.
                </CardDescription>
                <CardTags tags={['React', 'Tailwind']} />
                <CardFooter>
                  <span>Author</span>
                  <span>&middot;</span>
                  <span>Jan 2026</span>
                </CardFooter>
              </CardContent>
            </a>
          </Card>
          <Card className="border-t-2 border-t-primary">
            <a href="#" className="flex h-full">
              <CardContent>
                <CardTitle>Colored Top Border</CardTitle>
                <CardDescription>
                  Card with a primary-colored top border, like project cards.
                </CardDescription>
                <CardTags tags={['TypeScript', 'Open Source']} />
                <CardFooter>
                  <span>Contribution</span>
                </CardFooter>
              </CardContent>
            </a>
          </Card>
        </CardList>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-head text-lg font-semibold">
          Static Cards (no link)
        </h3>
        <CardList>
          <Card>
            <CardContent>
              <CardTitle>Static Card</CardTitle>
              <CardDescription>
                No link inside, so no hover or press animation. Just the shelf
                shadow.
              </CardDescription>
              <CardFooter className="gap-4">
                <Button variant="link" size="sm">
                  Visit
                </Button>
                <Button variant="link" size="sm">
                  Source
                </Button>
              </CardFooter>
            </CardContent>
          </Card>
          <Card className="border-t-2 border-t-accent">
            <CardContent>
              <CardTitle>Accent Border</CardTitle>
              <CardDescription>
                Card with accent top border and badges inside.
              </CardDescription>
              <div className="mt-3 flex gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
              </div>
            </CardContent>
          </Card>
        </CardList>
      </div>
    </div>
  )
}

function InputsTab() {
  return (
    <div className="flex w-full flex-col gap-4">
      <h3 className="font-head text-lg font-semibold">Text Input</h3>
      <div className="flex max-w-sm flex-col gap-4">
        <Input placeholder="Default input" />
        <Input placeholder="Disabled input" disabled />
      </div>
    </div>
  )
}

function TypographyTab() {
  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="font-head text-5xl font-bold uppercase">
        Heading 1 (Hero)
      </h1>
      <h2 className="font-head text-3xl font-bold uppercase">
        Heading 2 (Section)
      </h2>
      <h3 className="font-head text-xl font-semibold tracking-tight">
        Heading 3 (Card Title)
      </h3>
      <p className="text-base text-foreground">
        Body text in Public Sans. The quick brown fox jumps over the lazy dog.
      </p>
      <p className="text-sm text-muted-foreground">
        Muted text, used for descriptions and secondary content.
      </p>
      <p className="text-xs text-muted-foreground">
        Extra small text, used for footnotes and metadata.
      </p>
    </div>
  )
}

function ColorsTab() {
  return (
    <div className="flex w-full flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h3 className="font-head text-lg font-semibold">Semantic Colors</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              name: 'Primary',
              bg: 'bg-primary',
              fg: 'text-primary-foreground',
            },
            {
              name: 'Secondary',
              bg: 'bg-secondary',
              fg: 'text-secondary-foreground',
            },
            {
              name: 'Accent',
              bg: 'bg-accent',
              fg: 'text-accent-foreground',
            },
            {
              name: 'Destructive',
              bg: 'bg-destructive',
              fg: 'text-destructive-foreground',
            },
            { name: 'Muted', bg: 'bg-muted', fg: 'text-muted-foreground' },
            { name: 'Card', bg: 'bg-card', fg: 'text-card-foreground' },
            { name: 'Border', bg: 'bg-border', fg: 'text-foreground' },
            {
              name: 'Background',
              bg: 'bg-background',
              fg: 'text-foreground',
            },
          ].map((color) => (
            <div
              key={color.name}
              className={`${color.bg} ${color.fg} flex h-16 items-center justify-center rounded-lg border border-border text-sm font-medium`}
            >
              {color.name}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-head text-lg font-semibold">Shelf Shadow Colors</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { name: 'shelf-primary', bg: 'bg-[var(--shelf-primary)]' },
            { name: 'shelf-secondary', bg: 'bg-[var(--shelf-secondary)]' },
            { name: 'shelf-accent', bg: 'bg-[var(--shelf-accent)]' },
            {
              name: 'shelf-destructive',
              bg: 'bg-[var(--shelf-destructive)]',
            },
            { name: 'shelf-neutral', bg: 'bg-[var(--shelf-neutral)]' },
            { name: 'shelf-card', bg: 'bg-[var(--shelf-card)]' },
          ].map((color) => (
            <div
              key={color.name}
              className={`${color.bg} flex h-12 items-center justify-center rounded-lg border border-border text-xs font-medium text-foreground`}
            >
              {color.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const tabContent: Record<Tab, () => React.JSX.Element> = {
  Buttons: ButtonsTab,
  Badges: BadgesTab,
  Cards: CardsTab,
  Inputs: InputsTab,
  Typography: TypographyTab,
  Colors: ColorsTab,
}

export function PageStyleguide() {
  const [activeTab, setActiveTab] = useState<Tab>('Buttons')
  const ActiveContent = tabContent[activeTab]

  return (
    <div>
      <Section>
        <SectionTitle>Styleguide</SectionTitle>
        <p className="text-muted-foreground">
          Dev-only reference for all UI component variants.
        </p>
      </Section>

      <Section className={cn('items-start gap-10')}>
        <TabButtons active={activeTab} onSelect={setActiveTab} />
        <ActiveContent />
      </Section>
    </div>
  )
}
