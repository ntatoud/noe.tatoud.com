import { useState } from 'react'

import { Link } from '@tanstack/react-router'

import { Mail01Icon, Menu01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Monogram } from '@/components/monogram'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { ButtonAnchor, ButtonLink } from '@/components/ui/button-link'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

import { emailHref, navItems } from './site-config'

export function Header() {
  return (
    <header className="w-full" data-slot="header">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-6 px-4">
        <Logo />
        <PrimaryNav className="hidden md:flex" />
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <SayHelloButton />
          <ThemeToggle />
        </div>
        <MobileMenu className="md:hidden" />
      </div>
    </header>
  )
}

function Logo() {
  return (
    <Link
      to="/"
      aria-label="Noé Tatoud, home"
      className="-ml-1 flex items-center gap-2.5 rounded-full py-1 pr-2 pl-1 outline-none focus-visible:ring-3 focus-visible:ring-ring"
      data-slot="logo"
    >
      <Monogram className="size-8 text-base" />
      <span className="font-serif text-lg leading-none">Noé Tatoud</span>
    </Link>
  )
}

function SayHelloButton({ className }: { className?: string }) {
  return (
    <ButtonAnchor
      href={emailHref()}
      variant="outline"
      size="sm"
      className={className}
      data-slot="header-say-hello"
    >
      <HugeiconsIcon icon={Mail01Icon} size={16} data-icon="inline-start" />
      Say hello
    </ButtonAnchor>
  )
}

function PrimaryNav({ className }: { className?: string }) {
  return (
    <nav className={cn('items-center gap-1', className)} aria-label="Primary">
      {navItems.map((item) => (
        <ButtonLink
          key={item.href}
          to={item.href}
          variant="nav"
          data-nav={item.label.toLowerCase()}
        >
          {item.label}
        </ButtonLink>
      ))}
    </nav>
  )
}

function MobileMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('ml-auto flex items-center', className)}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              data-slot="menu-button"
            />
          }
        >
          <HugeiconsIcon icon={Menu01Icon} size={20} />
        </SheetTrigger>
        <SheetContent
          side="top"
          className="w-full sm:max-w-none"
          data-slot="mobile-menu"
        >
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="flex flex-col gap-4 p-4">
            <nav className="flex flex-col gap-1" aria-label="Mobile primary">
              {navItems.map((item) => (
                <ButtonLink
                  key={item.href}
                  to={item.href}
                  variant="nav"
                  size="lg"
                  className="w-full justify-start"
                  onClick={() => setOpen(false)}
                  data-nav={item.label.toLowerCase()}
                >
                  {item.label}
                </ButtonLink>
              ))}
            </nav>

            <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
              <SayHelloButton />
              <ThemeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
