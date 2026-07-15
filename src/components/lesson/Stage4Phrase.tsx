import { useMemo } from 'react'
import { OrderLessonRunner, type OrderItem } from './OrderLessonRunner'
import { getStage4PhrasesForLetter, textForWordSequence } from '../../utils/curriculumHelpers'
import { wordById } from '../../data/stage2-words'
import type { ConsonantId } from '../../types/curriculum'

interface LessonResult {
  correctCount: number
  reviewCorrectCount: number
  totalCount: number
  mistakeCount: number
}

export function Stage4Phrase({ letterId, onComplete }: { letterId: ConsonantId; onComplete: (r: LessonResult) => void }) {
  const items: OrderItem[] = useMemo(
    () =>
      getStage4PhrasesForLetter(letterId).map((p) => ({
        id: p.id,
        promptText: textForWordSequence(p.wordIds),
        tiles: p.wordIds.map((id) => ({ id, text: wordById(id).text })),
        expectedOrder: p.wordIds,
      })),
    [letterId],
  )

  return <OrderLessonRunner items={items} onComplete={onComplete} />
}
