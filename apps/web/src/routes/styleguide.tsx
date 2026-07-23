import { createFileRoute } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/styleguide')({
  component: StyleguidePage,
  head: () => ({
    meta: [
      { title: 'Moss Design System — Noé Tatoud' },
      {
        name: 'description',
        content:
          'Moss is the design system for noe.tatoud.com. Technical warmth through deep forest green, editorial typography, and systematic precision.',
      },
    ],
  }),
})

function StyleguidePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      {/* Hero */}
      <section className="mb-24">
        <Badge className="mb-4" variant="outline">
          Design System v1
        </Badge>
        <h1 className="mb-4 font-fraunces text-5xl font-semibold tracking-tight">
          Moss
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Technical warmth through deep forest green, editorial typography, and
          systematic precision. Built for noe.tatoud.com and beyond.
        </p>
      </section>

      {/* Color Palette */}
      <section className="mb-24">
        <h2 className="mb-8 font-fraunces text-3xl font-semibold">
          Color Palette
        </h2>

        <div className="mb-12">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            Moss Tones — Primary
          </h3>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-11">
            <ColorSwatch name="50" className="bg-moss-50" />
            <ColorSwatch name="100" className="bg-moss-100" />
            <ColorSwatch name="200" className="bg-moss-200" />
            <ColorSwatch name="300" className="bg-moss-300" />
            <ColorSwatch name="400" className="bg-moss-400" />
            <ColorSwatch name="500" className="bg-moss-500" primary />
            <ColorSwatch name="600" className="bg-moss-600" />
            <ColorSwatch name="700" className="bg-moss-700" />
            <ColorSwatch name="800" className="bg-moss-800" />
            <ColorSwatch name="900" className="bg-moss-900" />
            <ColorSwatch name="950" className="bg-moss-950" />
          </div>
        </div>

        <div className="mb-12">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            Honey Tones — Secondary
          </h3>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-11">
            <ColorSwatch name="50" className="bg-honey-50" />
            <ColorSwatch name="100" className="bg-honey-100" />
            <ColorSwatch name="200" className="bg-honey-200" />
            <ColorSwatch name="300" className="bg-honey-300" />
            <ColorSwatch name="400" className="bg-honey-400" />
            <ColorSwatch name="500" className="bg-honey-500" primary />
            <ColorSwatch name="600" className="bg-honey-600" />
            <ColorSwatch name="700" className="bg-honey-700" />
            <ColorSwatch name="800" className="bg-honey-800" />
            <ColorSwatch name="900" className="bg-honey-900" />
            <ColorSwatch name="950" className="bg-honey-950" />
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
                <strong className="text-foreground">Moss (primary)</strong> is
                your signature. Use for primary actions, links, and brand
                moments.
              </p>
              <p>
                <strong className="text-foreground">Honey (secondary)</strong>{' '}
                is the warm counterpoint. Use for secondary actions, badges, and
                highlights — like sunlight through leaves.
              </p>
              <p>
                <strong className="text-foreground">
                  Muted (moss-100/200)
                </strong>{' '}
                for subtle backgrounds, hover states, and secondary surfaces.
              </p>
              <p>
                <strong className="text-foreground">Deep (moss-800/900)</strong>{' '}
                for emphasis, selected states, and high-contrast text.
              </p>
              <p>
                <strong className="text-foreground">Never</strong> use pure
                black or white — always tint toward moss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-24">
        <h2 className="mb-8 font-fraunces text-3xl font-semibold">
          Typography
        </h2>

        <div className="space-y-12">
          <div>
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              Display — Fraunces
            </h3>
            <div className="space-y-4">
              <TypeSpecimen
                label="Heading 1"
                className="font-fraunces text-5xl font-semibold tracking-tight"
              >
                The quick brown fox jumps over the lazy dog
              </TypeSpecimen>
              <TypeSpecimen
                label="Heading 2"
                className="font-fraunces text-4xl font-semibold tracking-tight"
              >
                The quick brown fox jumps over the lazy dog
              </TypeSpecimen>
              <TypeSpecimen
                label="Heading 3"
                className="font-fraunces text-3xl font-semibold"
              >
                The quick brown fox jumps over the lazy dog
              </TypeSpecimen>
              <TypeSpecimen
                label="Heading 4"
                className="font-fraunces text-2xl font-semibold"
              >
                The quick brown fox jumps over the lazy dog
              </TypeSpecimen>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              Body — Manrope
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
              Mono — Atkinson Hyperlegible Next
            </h3>
            <div className="space-y-4">
              <TypeSpecimen label="Code" className="font-mono text-sm">
                const moss = 'technical warmth'
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
        <h2 className="mb-8 font-fraunces text-3xl font-semibold">Buttons</h2>

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
              (moss) for main actions.{' '}
              <strong className="text-foreground">Secondary</strong> uses honey
              for warm accents.
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
        <h2 className="mb-8 font-fraunces text-3xl font-semibold">
          Spacing & Radius
        </h2>

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
                    className="bg-moss-200 dark:bg-moss-800"
                    style={{ width: `${n * 0.25}rem`, height: '1rem' }}
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
          Moss Design System v1.0 — Built with technical warmth.
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
          primary ? 'ring-2 ring-moss-500 ring-offset-2' : ''
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
      <div className={`size-16 bg-moss-200 dark:bg-moss-800 ${className}`} />
      <span className="text-sm text-muted-foreground">{name}</span>
    </div>
  )
}
