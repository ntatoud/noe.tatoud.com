import { create } from 'zustand'
import type { AchievementId } from './achievements'

const STORAGE_KEY = 'achievements'
const READ_POSTS_KEY = 'read-posts'
const VISITED_SECTIONS_KEY = 'visited-sections'
const CLICK_COUNT_KEY = 'click-count'

function readSet<T extends string>(key: string): Set<T> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as Array<T>)
  } catch {
    return new Set()
  }
}

function writeSet(key: string, set: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]))
  } catch {
    // storage unavailable
  }
}

type AchievementsStore = {
  unlockedIds: Set<AchievementId>
  toastQueue: Array<AchievementId>
  actions: {
    unlock: (id: AchievementId) => void
    dismissToast: (id: AchievementId) => void
  }
}

export const useAchievementsStore = create<AchievementsStore>((set, get) => ({
  unlockedIds: readSet<AchievementId>(STORAGE_KEY),
  toastQueue: [],
  actions: {
    unlock: (id) => {
      if (get().unlockedIds.has(id)) return
      const next = new Set(get().unlockedIds)
      next.add(id)
      writeSet(STORAGE_KEY, next)
      set({ unlockedIds: next, toastQueue: [...get().toastQueue, id] })
    },
    dismissToast: (id) =>
      set((state) => ({
        toastQueue: state.toastQueue.filter((i) => i !== id),
      })),
  },
}))

export function useAchievements() {
  const unlockedIds = useAchievementsStore((s) => s.unlockedIds)
  const unlock = useAchievementsStore((s) => s.actions.unlock)
  return { unlockedIds, unlock }
}

// localStorage helpers for tracking read posts and visited sections

export const EXPLORER_SECTIONS = ['/', '/blog', '/achievements'] as const

export function getReadPosts(): Set<string> {
  return readSet(READ_POSTS_KEY)
}

export function addReadPost(slug: string) {
  const posts = getReadPosts()
  posts.add(slug)
  writeSet(READ_POSTS_KEY, posts)
}

export function getVisitedSections(): Set<string> {
  return readSet(VISITED_SECTIONS_KEY)
}

export function addVisitedSection(section: string) {
  const sections = getVisitedSections()
  sections.add(section)
  writeSet(VISITED_SECTIONS_KEY, sections)
}

export const CLICK_FRENZY_TARGET = 100

export function getClickCount(): number {
  if (typeof window === 'undefined') return 0
  try {
    return Number(localStorage.getItem(CLICK_COUNT_KEY)) || 0
  } catch {
    return 0
  }
}

export function incrementClickCount(): number {
  const count = getClickCount() + 1
  try {
    localStorage.setItem(CLICK_COUNT_KEY, String(count))
  } catch {
    // storage unavailable
  }
  return count
}
