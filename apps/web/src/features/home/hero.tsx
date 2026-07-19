import { ButtonAnchor, ButtonLink } from '@/components/ui/button-link'
import { SocialLinks } from '@/layout/social-links'

const ownerName = 'Noé Tatoud'
const tagline =
  'Fullstack developer crafting pixel-perfect interfaces and thoughtful web experiences.'
const photoSrc = '/pixel-avatar.webp'
const resumeHref = '/Noe_Tatoud_CV_React_EN.pdf'

export function Hero() {
  return (
    <section
      className="mx-auto max-w-3xl px-4 pt-16 pb-12"
      data-slot="home-hero"
    >
      <img
        src={photoSrc}
        alt={`Pixel art portrait of ${ownerName}`}
        width={160}
        height={160}
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
        <ButtonAnchor
          href={resumeHref}
          variant="outline"
          download
          data-slot="hero-cta-resume"
        >
          Download resume
        </ButtonAnchor>
        <SocialLinks />
      </div>
    </section>
  )
}
