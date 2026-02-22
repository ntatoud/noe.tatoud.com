import { linkOptions } from '@tanstack/react-router'
import { PixelHome, PixelQuoteLeft } from '@/components/icons'

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
