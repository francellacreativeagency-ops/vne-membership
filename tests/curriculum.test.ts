import { describe, it, expect } from 'vitest'
import { WORDS } from '../src/data/stage2-words'
import { PHRASES as STAGE3_PHRASES } from '../src/data/stage3-phrases'
import { PHRASES as STAGE4_PHRASES } from '../src/data/stage4-phrases'
import { SENTENCES } from '../src/data/stage5-sentences'
import { syllableById } from '../src/data/stage1-syllables'
import { wordById } from '../src/data/stage2-words'
import {
  computeRequiredLettersForWord,
  computeRequiredLettersForSequence,
  sameLetterSet,
  isAlphabetOrderValid,
  getCheckpointLetter,
} from '../src/utils/curriculumHelpers'
import { letterOrder } from '../src/data/alphabet'

describe('alphabet', () => {
  it('has unique letter order values', () => {
    expect(isAlphabetOrderValid()).toBe(true)
  })
})

describe('words (stage 2)', () => {
  for (const word of WORDS) {
    it(`"${word.text}" concatenates its syllables correctly`, () => {
      const concatenated = word.syllableIds.map((id) => syllableById(id).text).join('')
      expect(concatenated).toBe(word.text)
    })

    it(`"${word.text}" declared requiredLetterIds matches its syllables' letters`, () => {
      const computed = computeRequiredLettersForWord(word)
      expect(sameLetterSet(computed, word.requiredLetterIds)).toBe(true)
    })

    it(`"${word.text}" never references a letter beyond its own checkpoint`, () => {
      const checkpoint = getCheckpointLetter(word.requiredLetterIds)
      const checkpointOrder = letterOrder(checkpoint)
      for (const letterId of word.requiredLetterIds) {
        expect(letterOrder(letterId)).toBeLessThanOrEqual(checkpointOrder)
      }
    })
  }
})

describe('phrases and sentences never reference un-taught vocabulary', () => {
  const sequences = [
    ...STAGE3_PHRASES.map((p) => ({ label: `stage3:${p.id}`, wordIds: p.wordIds, requiredLetterIds: p.requiredLetterIds })),
    ...STAGE4_PHRASES.map((p) => ({ label: `stage4:${p.id}`, wordIds: p.wordIds, requiredLetterIds: p.requiredLetterIds })),
    ...SENTENCES.map((s) => ({ label: `stage5:${s.id}`, wordIds: s.wordIds, requiredLetterIds: s.requiredLetterIds })),
  ]

  for (const seq of sequences) {
    it(`${seq.label} only uses words that exist in the stage2 word bank`, () => {
      for (const id of seq.wordIds) {
        expect(() => wordById(id)).not.toThrow()
      }
    })

    it(`${seq.label} declared requiredLetterIds matches the union of its words' required letters`, () => {
      const computed = computeRequiredLettersForSequence(seq.wordIds)
      expect(sameLetterSet(computed, seq.requiredLetterIds)).toBe(true)
    })

    it(`${seq.label} never references a letter beyond its own checkpoint`, () => {
      const checkpoint = getCheckpointLetter(seq.requiredLetterIds)
      const checkpointOrder = letterOrder(checkpoint)
      for (const letterId of seq.requiredLetterIds) {
        expect(letterOrder(letterId)).toBeLessThanOrEqual(checkpointOrder)
      }
    })
  }
})
