import { PixelProgress } from '@/components/ui/progress'
import { useHydrated } from '@/hooks/use-hydrated'
import { Hero, HeroSubtitle, HeroTitle } from '@/layout/hero'
import { Section, SectionContent } from '@/layout/section'
import { Route } from '@/routes/achievements/index'

import { AchievementCard } from './achievement-card'
import { ACHIEVEMENTS } from './achievements'
import { engine, useProgress, useUnlockedCount } from './engine'
import type { AchievementId } from './engine'

export function PageAchievements() {
  const { totalBlogPosts } = Route.useLoaderData()
  const hydrated = useHydrated()
  const unlockedCount = useUnlockedCount()
  const { progress: visitedCount, max: explorerMax } = useProgress('explorer')
  const { progress: clickCount, max: clickMax } = useProgress('click-frenzy')
  const { progress: solvedRiddleCount, max: riddleMax } = useProgress('riddle')

  const unlockedIds = hydrated
    ? (engine.getUnlocked() as Set<AchievementId>)
    : new Set<AchievementId>()
  const readCount = hydrated ? engine.getItems('completionist').size : 0

  function getProgress(id: string) {
    if (id === 'explorer') {
      const max = explorerMax ?? 3
      const value = hydrated ? visitedCount : 0
      return { value, max, label: `${value} / ${max} sections` }
    }
    if (id === 'completionist') {
      return {
        value: readCount,
        max: totalBlogPosts,
        label: `${readCount} / ${totalBlogPosts} posts`,
      }
    }
    if (id === 'click-frenzy') {
      const max = clickMax ?? 100
      const value = hydrated ? clickCount : 0
      return { value, max, label: `${value} / ${max} clicks` }
    }
    if (id === 'riddle') {
      const max = riddleMax ?? 7
      const value = hydrated ? solvedRiddleCount : 0
      return { value, max, label: `${value} / ${max} days` }
    }
    return undefined
  }

  const displayUnlockedCount = hydrated ? unlockedCount : 0

  return (
    <div>
      <Hero className="pb-12">
        <HeroTitle>Achievements</HeroTitle>
        <HeroSubtitle>
          {displayUnlockedCount} / {ACHIEVEMENTS.length} unlocked
        </HeroSubtitle>
        <PixelProgress
          value={displayUnlockedCount}
          max={ACHIEVEMENTS.length}
          label={`${displayUnlockedCount} of ${ACHIEVEMENTS.length} achievements unlocked`}
          className="w-full max-w-xs"
        />
      </Hero>
      <Section>
        <SectionContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[...ACHIEVEMENTS]
              .sort((a, b) => {
                const rank = (achievement: (typeof ACHIEVEMENTS)[number]) => {
                  if (!hydrated) return achievement.hidden ? 2 : 1
                  if (unlockedIds.has(achievement.id)) return 0
                  if (!achievement.hidden) return 1
                  return 2
                }
                return rank(a) - rank(b)
              })
              .map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={hydrated && unlockedIds.has(achievement.id)}
                  progress={hydrated ? getProgress(achievement.id) : undefined}
                />
              ))}
          </div>
        </SectionContent>
      </Section>
    </div>
  )
}
