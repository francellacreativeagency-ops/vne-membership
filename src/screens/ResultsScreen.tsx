import { useEffect } from 'react'
import { useProgressStore } from '../state/progressStore'
import { useNavigation } from '../state/NavigationContext'
import { Button } from '../components/common/Button'
import type { ConsonantId, StageNumber } from '../types/curriculum'

interface ResultsScreenProps {
  letterId: ConsonantId
  stage: StageNumber
  correctCount: number
  totalCount: number
  pointsEarned: number
}

export function ResultsScreen({ letterId, stage, correctCount, totalCount, pointsEarned }: ResultsScreenProps) {
  const { navigate } = useNavigation()
  const unlockedLetterIds = useProgressStore((s) => s.unlockedLetterIds)
  const stageProgress = useProgressStore((s) => s.stageProgress)
  const unlockNextLetter = useProgressStore((s) => s.unlockNextLetter)

  const isPerfect = totalCount > 0 && correctCount === totalCount
  const isLatestLetter = unlockedLetterIds[unlockedLetterIds.length - 1] === letterId

  useEffect(() => {
    if (stage !== 2 || !isLatestLetter) return
    const stage1Done = stageProgress[letterId]?.[1]?.completed
    const stage2Done = stageProgress[letterId]?.[2]?.completed
    if (stage1Done && stage2Done) {
      unlockNextLetter()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 flex-1 text-white text-center">
      <div className="text-8xl animate-pop-in">{isPerfect ? '🏆' : '🎉'}</div>
      <h1 className="text-4xl font-extrabold">{isPerfect ? '¡Perfecto!' : '¡Buen trabajo!'}</h1>
      <p className="text-2xl">
        {correctCount} / {totalCount} correct
      </p>
      <p className="text-3xl font-bold text-[var(--theme-accent)]">+{pointsEarned} points</p>
      <div className="flex gap-4 mt-4">
        <Button onClick={() => navigate({ name: 'lesson', letterId, stage })}>Play Again</Button>
        <Button variant="secondary" onClick={() => navigate({ name: 'home' })}>
          Continue
        </Button>
      </div>
    </div>
  )
}
