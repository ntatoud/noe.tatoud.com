import { PixelHome, PixelQuoteLeft } from '@/components/icons'
import { linkOptions } from '@tanstack/react-router'

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
])
