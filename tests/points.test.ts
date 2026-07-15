import { describe, it, expect } from 'vitest'
import { computeLessonPoints } from '../src/data/pointsConfig'

describe('computeLessonPoints', () => {
  it('awards per-item points plus completion bonus for a stage 1 lesson', () => {
    const points = computeLessonPoints({ stage: 1, correctCount: 5, reviewCorrectCount: 0, totalCount: 5, mistakeCount: 2 })
    // 5 * 10 (per-correct) + 20 (completion) = 70; no mistake-free bonus since mistakeCount > 0
    expect(points).toBe(70)
  })

  it('adds the mistake-free bonus when there were zero mistakes', () => {
    const points = computeLessonPoints({ stage: 1, correctCount: 5, reviewCorrectCount: 0, totalCount: 5, mistakeCount: 0 })
    // 5 * 10 + 20 + 30 = 100
    expect(points).toBe(100)
  })

  it('adds review-item bonuses on top of the per-correct points', () => {
    const points = computeLessonPoints({ stage: 2, correctCount: 6, reviewCorrectCount: 2, totalCount: 6, mistakeCount: 0 })
    // 6 * 10 + 2 * 5 (review bonus) + 20 + 30 = 60 + 10 + 20 + 30 = 120
    expect(points).toBe(120)
  })

  it('uses higher per-correct rates for later stages', () => {
    const stage3 = computeLessonPoints({ stage: 3, correctCount: 1, reviewCorrectCount: 0, totalCount: 1, mistakeCount: 0 })
    const stage5 = computeLessonPoints({ stage: 5, correctCount: 1, reviewCorrectCount: 0, totalCount: 1, mistakeCount: 0 })
    expect(stage5).toBeGreaterThan(stage3)
  })

  it('returns 0 for an empty lesson', () => {
    const points = computeLessonPoints({ stage: 1, correctCount: 0, reviewCorrectCount: 0, totalCount: 0, mistakeCount: 0 })
    expect(points).toBe(0)
  })
})
