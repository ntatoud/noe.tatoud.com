import { ButtonLink } from '@/components/ui/button-link'
import { SocialLinks } from '@/layout/social-links'

const ownerName = 'Noé Tatoud'
const tagline =
  'Fullstack developer crafting pixel-perfect interfaces and thoughtful web experiences.'
const photoSrc = '/pixel-avatar.webp'

export function Hero() {
  return (
    <section
      className="mx-auto max-w-5xl px-4 pt-16 pb-12"
      data-slot="home-hero"
    >
      <img
        src={photoSrc}
        alt={`Pixel art portrait of ${ownerName}`}
        width={160}
        height={160}
        fetchPriority="high"
        className="mb-4 size-40 object-cover"
        data-slot="hero-photo"
      />
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        {ownerName}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">{tagline}</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ButtonLink to="/blog" data-slot="hero-cta-blog">
          Read the blog
        </ButtonLink>
        <SocialLinks />
      </div>
    </section>
  )
}
