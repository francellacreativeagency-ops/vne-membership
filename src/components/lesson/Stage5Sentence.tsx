import { useMemo } from 'react'
import { OrderLessonRunner, type OrderItem } from './OrderLessonRunner'
import { getStage5SentencesForLetter, textForWordSequence } from '../../utils/curriculumHelpers'
import { wordById } from '../../data/stage2-words'
import type { ConsonantId } from '../../types/curriculum'

interface LessonResult {
  correctCount: number
  reviewCorrectCount: number
  totalCount: number
  mistakeCount: number
}

export function Stage5Sentence({ letterId, onComplete }: { letterId: ConsonantId; onComplete: (r: LessonResult) => void }) {
  const items: OrderItem[] = useMemo(
    () =>
      getStage5SentencesForLetter(letterId).map((s) => ({
        id: s.id,
        promptText: textForWordSequence(s.wordIds),
        tiles: s.wordIds.map((id) => ({ id, text: wordById(id).text })),
        expectedOrder: s.wordIds,
      })),
    [letterId],
  )

  return <OrderLessonRunner items={items} onComplete={onComplete} />
}
