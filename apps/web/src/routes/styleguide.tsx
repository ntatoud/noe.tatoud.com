import type { CSSProperties } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { pageMeta } from '@/features/og/metadata'
import { STATIC_PAGES } from '@/lib/site'

export const Route = createFileRoute('/styleguide')({
  component: StyleguidePage,
  head: () => ({ meta: pageMeta(STATIC_PAGES.styleguide.path) }),
})

function StyleguidePage() {
  return (
    <main id="main" className="mx-auto max-w-4xl px-4 py-16">
      {/* Hero */}
      <section className="mb-24">
        <Badge className="mb-4" variant="outline">
          Design System v1
        </Badge>
        <h1 className="mb-4 font-serif text-5xl">Clay</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Technical warmth through deep forest green, editorial typography, and
          systematic precision. Built for noe.tatoud.com and beyond.
        </p>
      </section>

      {/* Color Palette */}
      <section className="mb-24">
        <h2 className="mb-8 font-serif text-3xl">Color Palette</h2>

        <div className="mb-12">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            Clay Tones — Primary
          </h3>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-11">
            <ColorSwatch name="50" className="bg-clay-50" />
            <ColorSwatch name="100" className="bg-clay-100" />
            <ColorSwatch name="200" className="bg-clay-200" />
            <ColorSwatch name="300" className="bg-clay-300" />
            <ColorSwatch name="400" className="bg-clay-400" />
            <ColorSwatch name="500" className="bg-clay-500" primary />
            <ColorSwatch name="600" className="bg-clay-600" />
            <ColorSwatch name="700" className="bg-clay-700" />
            <ColorSwatch name="800" className="bg-clay-800" />
            <ColorSwatch name="900" className="bg-clay-900" />
            <ColorSwatch name="950" className="bg-clay-950" />
          </div>
        </div>

        <div className="mb-12">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            Olive Tones — Secondary
          </h3>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-11">
            <ColorSwatch name="50" className="bg-olive-50" />
            <ColorSwatch name="100" className="bg-olive-100" />
            <ColorSwatch name="200" className="bg-olive-200" />
            <ColorSwatch name="300" className="bg-olive-300" />
            <ColorSwatch name="400" className="bg-olive-400" />
            <ColorSwatch name="500" className="bg-olive-500" primary />
            <ColorSwatch name="600" className="bg-olive-600" />
            <ColorSwatch name="700" className="bg-olive-700" />
            <ColorSwatch name="800" className="bg-olive-800" />
            <ColorSwatch name="900" className="bg-olive-900" />
            <ColorSwatch name="950" className="bg-olive-950" />
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              Semantic Colors
            </h3>
            <div className="space-y-3">
              <SemanticColor name="Background" className="bg-background" />
              <SemanticColor name="Foreground" className="bg-foreground" />
              <SemanticColor name="Card" className="bg-card" />
              <SemanticColor name="Primary" className="bg-primary" />
              <SemanticColor name="Secondary" className="bg-secondary" />
              <SemanticColor name="Muted" className="bg-muted" />
              <SemanticColor name="Accent" className="bg-accent" />
              <SemanticColor name="Border" className="bg-border" />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              Usage Guidelines
            </h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Clay (primary)</strong> is
                your signature. Use for primary actions, links, and brand
                moments.
              </p>
              <p>
                <strong className="text-foreground">Olive (secondary)</strong>{' '}
                is the warm counterpoint. Use for secondary actions, badges, and
                highlights — like olive leaves against terracotta.
              </p>
              <p>
                <strong className="text-foreground">
                  Muted (clay-100/200)
                </strong>{' '}
                for subtle backgrounds, hover states, and secondary surfaces.
              </p>
              <p>
                <strong className="text-foreground">Deep (clay-800/900)</strong>{' '}
                for emphasis, selected states, and high-contrast text.
              </p>
              <p>
                <strong className="text-foreground">Never</strong> use pure
                black or white — always tint toward sand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-24">
        <h2 className="mb-8 font-serif text-3xl">Typography</h2>

        <div className="space-y-12">
          <div>
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              Display — Young Serif
            </h3>
            <div className="space-y-4">
              <TypeSpecimen label="Heading 1" className="font-serif text-5xl">
                The quick brown fox jumps over the lazy dog
              </TypeSpecimen>
              <TypeSpecimen label="Heading 2" className="font-serif text-4xl">
                The quick brown fox jumps over the lazy dog
              </TypeSpecimen>
              <TypeSpecimen label="Heading 3" className="font-serif text-3xl">
                The quick brown fox jumps over the lazy dog
              </TypeSpecimen>
              <TypeSpecimen label="Heading 4" className="font-serif text-2xl">
                The quick brown fox jumps over the lazy dog
              </TypeSpecimen>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              Body — DM Sans
            </h3>
            <div className="space-y-4">
              <TypeSpecimen label="Body Large" className="text-lg">
                The quick brown fox jumps over the lazy dog. Pack my box with
                five dozen liquor jugs.
              </TypeSpecimen>
              <TypeSpecimen label="Body" className="text-base">
                The quick brown fox jumps over the lazy dog. Pack my box with
                five dozen liquor jugs.
              </TypeSpecimen>
              <TypeSpecimen label="Body Small" className="text-sm">
                The quick brown fox jumps over the lazy dog. Pack my box with
                five dozen liquor jugs.
              </TypeSpecimen>
              <TypeSpecimen
                label="Caption"
                className="text-xs text-muted-foreground"
              >
                The quick brown fox jumps over the lazy dog. Pack my box with
                five dozen liquor jugs.
              </TypeSpecimen>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              Mono (system monospace)
            </h3>
            <div className="space-y-4">
              <TypeSpecimen label="Code" className="font-mono text-sm">
                const clay = 'soft warmth'
              </TypeSpecimen>
              <TypeSpecimen
                label="Code Block"
                className="rounded-lg bg-muted p-4 font-mono text-sm"
              >
                {`function greet(name: string) {
  return \`Hello, \${name}!\`
}`}
              </TypeSpecimen>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-24">
        <h2 className="mb-8 font-serif text-3xl">Buttons</h2>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              Variants
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              <strong className="text-foreground">Default</strong> uses primary
              (clay) for main actions.{' '}
              <strong className="text-foreground">Secondary</strong> uses olive
              for calm accents.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              Sizes
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              States
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
              <Button variant="secondary">Secondary Normal</Button>
              <Button variant="secondary" disabled>
                Secondary Disabled
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing & Radius */}
      <section className="mb-24">
        <h2 className="mb-8 font-serif text-3xl">Spacing & Radius</h2>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              Border Radius
            </h3>
            <div className="space-y-4">
              <RadiusDemo name="sm" className="rounded-sm" />
              <RadiusDemo name="md" className="rounded-md" />
              <RadiusDemo name="lg" className="rounded-lg" />
              <RadiusDemo name="xl" className="rounded-xl" />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              Spacing Scale
            </h3>
            <div className="space-y-2">
              {[1, 2, 3, 4, 6, 8, 12, 16].map((n) => (
                <div key={n} className="flex items-center gap-4">
                  <span className="w-12 text-sm text-muted-foreground">
                    {n}
                  </span>
                  <div
                    className="h-4 w-(--swatch-width) bg-clay-200 dark:bg-clay-800"
                    style={
                      { '--swatch-width': `${n * 0.25}rem` } as CSSProperties
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="border-t pt-8">
        <p className="text-sm text-muted-foreground">
          Clay Design System v1.0 — Built with soft warmth.
        </p>
      </section>
    </main>
  )
}

function ColorSwatch({
  name,
  className,
  primary = false,
}: {
  name: string
  className: string
  primary?: boolean
}) {
  return (
    <div className="space-y-1">
      <div
        className={`h-16 rounded-lg border ${className} ${
          primary ? 'ring-2 ring-clay-500 ring-offset-2' : ''
        }`}
      />
      <p className="text-center text-xs text-muted-foreground">{name}</p>
    </div>
  )
}

function SemanticColor({
  name,
  className,
}: {
  name: string
  className: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`size-8 rounded border ${className}`} />
      <span className="text-sm">{name}</span>
    </div>
  )
}

function TypeSpecimen({
  label,
  className,
  children,
}: {
  label: string
  className: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={className}>{children}</p>
    </div>
  )
}

function RadiusDemo({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`size-16 bg-clay-200 dark:bg-clay-800 ${className}`} />
      <span className="text-sm text-muted-foreground">{name}</span>
    </div>
  )
}
