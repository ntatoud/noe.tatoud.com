import { linkOptions } from '@tanstack/react-router'

import { PixelHome, PixelQuoteLeft, PixelTrophy } from '@/components/icons'

export const nav = linkOptions([
  {
    label: 'Home',
    icon: PixelHome,
    to: '/',
    activeOptions: { exact: true },
  },
  {
    label: 'Blog',
    icon: PixelQuoteLeft,
    to: '/blog',
  },
  {
    label: 'Achievements',
    icon: PixelTrophy,
    to: '/achievements',
  },
])
