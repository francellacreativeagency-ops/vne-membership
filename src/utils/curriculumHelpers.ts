import type { ConsonantId, StageNumber, WordItem, PhraseItem, SentenceItem } from '../types/curriculum'
import type { LetterStageProgress } from '../types/progress'
import { ALPHABET, AUTHORED_LETTER_IDS, letterOrder } from '../data/alphabet'
import { syllablesFor, syllableById, allAuthoredSyllables } from '../data/stage1-syllables'
import { WORDS, wordById, wordsUpToLetter } from '../data/stage2-words'
import { PHRASES as STAGE3_PHRASES } from '../data/stage3-phrases'
import { PHRASES as STAGE4_PHRASES } from '../data/stage4-phrases'
import { SENTENCES } from '../data/stage5-sentences'

export function getCheckpointLetter(requiredLetterIds: ConsonantId[]): ConsonantId {
  return requiredLetterIds.reduce((max, id) => (letterOrder(id) > letterOrder(max) ? id : max))
}

export function isLetterUnlocked(letterId: string, unlockedLetterIds: string[]): boolean {
  return unlockedLetterIds.includes(letterId)
}

export function areAllLettersUnlocked(requiredLetterIds: ConsonantId[], unlockedLetterIds: string[]): boolean {
  return requiredLetterIds.every((id) => isLetterUnlocked(id, unlockedLetterIds))
}

export function getNextLetterToUnlock(unlockedLetterIds: string[]): ConsonantId | null {
  const authored = AUTHORED_LETTER_IDS as readonly string[]
  const next = authored.find((id) => !unlockedLetterIds.includes(id))
  return (next as ConsonantId) ?? null
}

export function getStage1Syllables(letterId: string) {
  return syllablesFor(letterId)
}

/** Words newly introduced at this letter (checkpoint === letterId). */
export function getStage2WordsForLetter(letterId: string): WordItem[] {
  return WORDS.filter((w) => !w.isFunctionWord && getCheckpointLetter(w.requiredLetterIds) === letterId)
}

export function getStage3PhrasesForLetter(letterId: string): PhraseItem[] {
  return STAGE3_PHRASES.filter((p) => getCheckpointLetter(p.requiredLetterIds) === letterId)
}

export function getStage4PhrasesForLetter(letterId: string): PhraseItem[] {
  return STAGE4_PHRASES.filter((p) => getCheckpointLetter(p.requiredLetterIds) === letterId)
}

export function getStage5SentencesForLetter(letterId: string): SentenceItem[] {
  return SENTENCES.filter((s) => getCheckpointLetter(s.requiredLetterIds) === letterId)
}

/** Pulls in syllables/words from earlier unlocked letters (excluding currentLetterId) to mix in as review. */
export function getReviewSyllableDistractors(currentLetterId: string, unlockedLetterIds: string[], count: number) {
  const pool = allAuthoredSyllables().filter(
    (s) => s.letterId !== currentLetterId && unlockedLetterIds.includes(s.letterId),
  )
  return shuffle(pool).slice(0, count)
}

export function getReviewWordDistractors(currentLetterId: string, unlockedLetterIds: string[], count: number) {
  const currentOrder = letterOrder(currentLetterId)
  const pool = wordsUpToLetter(currentOrder, letterOrder).filter(
    (w) => getCheckpointLetter(w.requiredLetterIds) !== currentLetterId && areAllLettersUnlocked(w.requiredLetterIds, unlockedLetterIds),
  )
  return shuffle(pool).slice(0, count)
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function textForWordSequence(wordIds: string[]): string {
  return wordIds.map((id) => wordById(id).text).join(' ')
}

// --- Curriculum integrity checks (used by tests/curriculum.test.ts) ---

export function computeRequiredLettersForWord(word: WordItem): ConsonantId[] {
  const ids = new Set(word.syllableIds.map((sid) => syllableById(sid).letterId))
  return [...ids].sort((a, b) => letterOrder(a) - letterOrder(b))
}

export function computeRequiredLettersForSequence(wordIds: string[]): ConsonantId[] {
  const ids = new Set(wordIds.flatMap((id) => wordById(id).requiredLetterIds))
  return [...ids].sort((a, b) => letterOrder(a) - letterOrder(b))
}

export function sameLetterSet(a: ConsonantId[], b: ConsonantId[]): boolean {
  if (a.length !== b.length) return false
  const sortedA = [...a].sort()
  const sortedB = [...b].sort()
  return sortedA.every((v, i) => v === sortedB[i])
}

/** Which stages have any authored content for this letter (used to decide what "mastered" requires). */
export function getAvailableStagesForLetter(letterId: string): StageNumber[] {
  const stages: StageNumber[] = [1]
  if (getStage2WordsForLetter(letterId).length > 0) stages.push(2)
  if (getStage3PhrasesForLetter(letterId).length > 0) stages.push(3)
  if (getStage4PhrasesForLetter(letterId).length > 0) stages.push(4)
  if (getStage5SentencesForLetter(letterId).length > 0) stages.push(5)
  return stages
}

export function isLetterMastered(letterId: string, letterProgress: LetterStageProgress | undefined): boolean {
  if (!letterProgress) return false
  return getAvailableStagesForLetter(letterId).every((stage) => letterProgress[stage]?.completed)
}

export function isAlphabetOrderValid(): boolean {
  const orders = ALPHABET.map((l) => l.order)
  return new Set(orders).size === orders.length
}
