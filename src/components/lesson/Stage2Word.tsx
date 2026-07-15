import { useMemo } from 'react'
import { ChoiceLessonRunner, type ChoiceItem } from './ChoiceLessonRunner'
import { getStage2WordsForLetter, getReviewWordDistractors } from '../../utils/curriculumHelpers'
import { useProgressStore } from '../../state/progressStore'
import type { ConsonantId } from '../../types/curriculum'

interface LessonResult {
  correctCount: number
  reviewCorrectCount: number
  totalCount: number
  mistakeCount: number
}

export function Stage2Word({ letterId, onComplete }: { letterId: ConsonantId; onComplete: (r: LessonResult) => void }) {
  const unlockedLetterIds = useProgressStore((s) => s.unlockedLetterIds)

  const items: ChoiceItem[] = useMemo(
    () => getStage2WordsForLetter(letterId).map((w) => ({ id: w.id, promptText: w.text, displayText: w.text, emoji: w.emoji })),
    [letterId],
  )

  const distractorPool: ChoiceItem[] = useMemo(() => {
    const review = getReviewWordDistractors(letterId, unlockedLetterIds, 6).map((w) => ({
      id: w.id,
      promptText: w.text,
      displayText: w.text,
      emoji: w.emoji,
      isReview: true,
    }))
    return [...items, ...review]
  }, [letterId, unlockedLetterIds, items])

  return <ChoiceLessonRunner items={items} distractorPool={distractorPool} onComplete={onComplete} />
}
