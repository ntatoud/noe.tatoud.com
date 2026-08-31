import { SocialLinks } from './social-links'

const buildYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer
      className="mt-auto w-full border-t border-border bg-background"
      data-slot="footer"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-4 py-10">
        <h2 className="text-sm font-medium text-muted-foreground">
          Let's connect
        </h2>
        <SocialLinks />
        <p className="text-xs text-muted-foreground">
          © {buildYear} Noé Tatoud
        </p>
      </div>
    </footer>
  )
}
