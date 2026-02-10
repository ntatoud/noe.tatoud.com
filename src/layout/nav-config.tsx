import { Book, Home } from '@hugeicons/core-free-icons'
import { linkOptions } from '@tanstack/react-router'

export const nav = linkOptions([
  {
    label: 'Home',
    icon: Home,
    to: '/',
    activeOptions: { exact: true },
  },
  {
    label: 'Blog',
    icon: Book,
    to: '/blog',
  },
])
