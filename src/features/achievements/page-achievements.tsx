import { Route } from '@/routes/achievements/index'
import { AchievementCard } from './achievement-card'
import { ACHIEVEMENTS } from './achievements'
import {
  EXPLORER_SECTIONS,
  getReadPosts,
  getVisitedSections,
  useAchievements,
} from './use-achievements'
import { PixelProgress } from '@/components/ui/progress'
import { useHydrated } from '@/hooks/use-hydrated'
import { Hero, HeroSubtitle, HeroTitle } from '@/layout/hero'
import { Section, SectionContent } from '@/layout/section'

export function PageAchievements() {
  const { unlockedIds } = useAchievements()
  const { totalBlogPosts } = Route.useLoaderData()
  const hydrated = useHydrated()

  const unlockedCount = hydrated ? unlockedIds.size : 0
  const visitedCount = hydrated ? getVisitedSections().size : 0
  const readCount = hydrated ? getReadPosts().size : 0

  function getProgress(id: string) {
    if (id === 'explorer') {
      return {
        value: visitedCount,
        max: EXPLORER_SECTIONS.length,
        label: `${visitedCount} / ${EXPLORER_SECTIONS.length} sections`,
      }
    }
    if (id === 'completionist') {
      return {
        value: readCount,
        max: totalBlogPosts,
        label: `${readCount} / ${totalBlogPosts} posts`,
      }
    }
    return undefined
  }

  return (
    <div>
      <Hero className="pb-12">
        <HeroTitle>Achievements</HeroTitle>
        <HeroSubtitle>
          {unlockedCount} / {ACHIEVEMENTS.length} unlocked
        </HeroSubtitle>
        <PixelProgress
          value={unlockedCount}
          max={ACHIEVEMENTS.length}
          label={`${unlockedCount} of ${ACHIEVEMENTS.length} achievements unlocked`}
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
