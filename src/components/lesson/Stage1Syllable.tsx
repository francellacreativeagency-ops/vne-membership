import { useMemo } from 'react'
import { ChoiceLessonRunner, type ChoiceItem } from './ChoiceLessonRunner'
import { getStage1Syllables, getReviewSyllableDistractors } from '../../utils/curriculumHelpers'
import { useProgressStore } from '../../state/progressStore'
import type { ConsonantId } from '../../types/curriculum'

interface LessonResult {
  correctCount: number
  reviewCorrectCount: number
  totalCount: number
  mistakeCount: number
}

export function Stage1Syllable({ letterId, onComplete }: { letterId: ConsonantId; onComplete: (r: LessonResult) => void }) {
  const unlockedLetterIds = useProgressStore((s) => s.unlockedLetterIds)

  const items: ChoiceItem[] = useMemo(
    () => getStage1Syllables(letterId).map((s) => ({ id: s.id, promptText: s.text, displayText: s.text })),
    [letterId],
  )

  const distractorPool: ChoiceItem[] = useMemo(() => {
    const review = getReviewSyllableDistractors(letterId, unlockedLetterIds, 6).map((s) => ({
      id: s.id,
      promptText: s.text,
      displayText: s.text,
      isReview: true,
    }))
    return [...items, ...review]
  }, [letterId, unlockedLetterIds, items])

  return <ChoiceLessonRunner items={items} distractorPool={distractorPool} onComplete={onComplete} />
}
