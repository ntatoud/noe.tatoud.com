import { useState } from 'react'

import { Link } from '@tanstack/react-router'

import { HugeiconsIcon } from '@hugeicons/react'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { ButtonLink } from '@/components/ui/button-link'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { menuIcon, navItems, trophyIcon } from './site-config'

const logoLabel = 'noe.tatoud.com — home'

export function Header() {
  return (
    <header className="w-full" data-slot="header">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-4 px-4">
        <Logo />
        <PrimaryNav className="hidden md:flex" />
        <div className="ml-auto hidden items-center gap-1 md:flex">
          <ThemeToggle />
          <TrophyLink />
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
      aria-label={logoLabel}
      className="font-mono text-sm font-bold tracking-tight"
      data-slot="logo"
    >
      noe.tatoud.com
    </Link>
  )
}

function PrimaryNav({ className }: { className?: string }) {
  return (
    <nav className={cn('items-center gap-1', className)} aria-label="Primary">
      {navItems.map((item) => (
        <ButtonLink
          key={item.href}
          to={item.href}
          variant="ghost"
          size="sm"
          className="text-sm text-muted-foreground hover:text-foreground"
          data-nav={item.label.toLowerCase()}
        >
          {item.label}
        </ButtonLink>
      ))}
    </nav>
  )
}

export function TrophyLink({ className }: { className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn('opacity-50', className)}
            aria-label="Achievements"
            aria-disabled="true"
            data-slot="trophy-link"
          />
        }
      >
        <HugeiconsIcon icon={trophyIcon} size={18} />
      </TooltipTrigger>
      <TooltipContent>Available soon</TooltipContent>
    </Tooltip>
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
          <HugeiconsIcon icon={menuIcon} size={20} />
        </SheetTrigger>
        <SheetContent
          side="top"
          className="w-full sm:max-w-none"
          data-slot="mobile-menu"
        >
          <div className="flex flex-col gap-4 p-4">
            <nav className="flex flex-col gap-1" aria-label="Mobile primary">
              {navItems.map((item) => (
                <ButtonLink
                  key={item.href}
                  to={item.href}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setOpen(false)}
                  data-nav={item.label.toLowerCase()}
                >
                  {item.label}
                </ButtonLink>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <ThemeToggle />
              <TrophyLink />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
