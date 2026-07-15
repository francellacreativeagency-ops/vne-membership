import type { StageNumber } from '../types/curriculum'

export const POINTS_PER_CORRECT: Record<StageNumber, number> = {
  1: 10,
  2: 10,
  3: 15,
  4: 15,
  5: 20,
}

export const LESSON_COMPLETION_BONUS = 20
export const MISTAKE_FREE_BONUS = 30
export const REVIEW_ITEM_BONUS = 5

export function computeLessonPoints(params: {
  stage: StageNumber
  correctCount: number
  reviewCorrectCount: number
  totalCount: number
  mistakeCount: number
}): number {
  const { stage, correctCount, reviewCorrectCount, totalCount, mistakeCount } = params
  let points = correctCount * POINTS_PER_CORRECT[stage]
  points += reviewCorrectCount * REVIEW_ITEM_BONUS
  if (totalCount > 0) points += LESSON_COMPLETION_BONUS
  if (totalCount > 0 && mistakeCount === 0) points += MISTAKE_FREE_BONUS
  return points
}
