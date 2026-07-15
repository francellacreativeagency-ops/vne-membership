export type ConsonantId =
  | 'b'
  | 'ch'
  | 'd'
  | 'f'
  | 'g'
  | 'j'
  | 'k'
  | 'h'
  | 'l'
  | 'm'
  | 'n'
  | 'ny'
  | 'ng'
  | 'p'
  | 'r'
  | 's'
  | 't'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'

export type StageNumber = 1 | 2 | 3 | 4 | 5

export interface Letter {
  id: ConsonantId
  displayLabel: string
  order: number
}

export interface Syllable {
  id: string
  letterId: ConsonantId
  text: string
  ttsOverride?: string
}

export interface WordItem {
  id: string
  text: string
  syllableIds: string[]
  emoji: string
  meaning: string
  ttsOverride?: string
  requiredLetterIds: ConsonantId[]
  /** Function words (e.g. "la") aren't quizzed standalone in Stage 2 — they only appear inside Stage 5 sentences. */
  isFunctionWord?: boolean
}

export interface PhraseItem {
  id: string
  wordIds: string[]
  meaning: string
  requiredLetterIds: ConsonantId[]
}

export interface SentenceItem {
  id: string
  wordIds: string[]
  meaning: string
  requiredLetterIds: ConsonantId[]
}

export interface StageLesson<T> {
  id: string
  stage: StageNumber
  checkpointLetterId: ConsonantId
  items: T[]
}
