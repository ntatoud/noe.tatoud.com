import { Link } from '@tanstack/react-router'

import { inlineLink } from '@/lib/link-styles'
import { FEEDS } from '@/lib/site'

import { LatestActivity } from './latest-activity'
import { CONTACT_EMAIL, emailHref, navItems } from './site-config'
import { SocialLinks } from './social-links'

const buildYear = import.meta.env.BUILD_DATE.slice(0, 4)

const footerLink =
  'rounded-sm underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring'

export function Footer() {
  return (
    <footer
      className="mt-auto w-full border-t border-border bg-muted/40"
      data-slot="footer"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12 sm:flex-row sm:flex-wrap sm:justify-between">
        <div className="flex flex-col gap-3">
          <p className="font-serif text-2xl">Thanks for stopping by.</p>
          <p className="max-w-md text-muted-foreground">
            Something on your mind about a post, a talk or a project? Write to
            me at{' '}
            <a href={emailHref()} className={inlineLink}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <SocialLinks className="-ml-2" withEmail={false} />
        </div>
        <nav
          aria-label="Footer"
          className="flex gap-10 text-sm text-muted-foreground"
        >
          <ul className="flex flex-col gap-2">
            <li>
              <Link to="/" className={footerLink}>
                Home
              </Link>
            </li>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className={footerLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-2">
            <li>
              <a href={FEEDS.rss.path} className={footerLink}>
                RSS feed
              </a>
            </li>
            <li>
              <a href={FEEDS.atom.path} className={footerLink}>
                Atom feed
              </a>
            </li>
            <li>
              <Link to="/styleguide" className={footerLink}>
                Styleguide
              </Link>
            </li>
          </ul>
        </nav>
        <p className="w-full text-xs text-muted-foreground">
          © {buildYear} Noé Tatoud
          <LatestActivity linkClassName={footerLink} />
        </p>
      </div>
    </footer>
  )
}
