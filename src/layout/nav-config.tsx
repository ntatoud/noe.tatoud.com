import { linkOptions } from '@tanstack/react-router'
import {
  PixelHome,
  PixelQuoteLeft,
  PixelSourceCode,
  PixelTrophy,
} from '@/components/icons'

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
    label: 'Projects',
    icon: PixelSourceCode,
    to: '/projects',
  },
  {
    label: 'Achievements',
    icon: PixelTrophy,
    to: '/achievements',
  },
])
