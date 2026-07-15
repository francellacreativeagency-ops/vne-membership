import type { SentenceItem } from '../types/curriculum'

// Real grammatical Spanish noun phrases ("la" + fem. noun + fem. adjective[s]),
// built only from stage2-words.ts. Genuinely readable "full sentences" for a
// beginning reader without inventing non-CV syllables (el/es/un need VC forms
// outside the taught syllabary — deferred to a future irregular-sight-word batch).
export const SENTENCES: SentenceItem[] = [
  { id: 'la-loba-boba', wordIds: ['la', 'loba', 'boba'], meaning: 'the silly wolf', requiredLetterIds: ['l', 'b'] },
  { id: 'la-jefa-fofa', wordIds: ['la', 'jefa', 'fofa'], meaning: 'the squishy boss', requiredLetterIds: ['l', 'j', 'f'] },
  { id: 'la-bola-boba', wordIds: ['la', 'bola', 'boba'], meaning: 'the silly ball', requiredLetterIds: ['l', 'b'] },
  { id: 'la-ficha-fofa', wordIds: ['la', 'ficha', 'fofa'], meaning: 'the squishy token', requiredLetterIds: ['l', 'f', 'ch'] },
]

export function sentenceById(id: string): SentenceItem {
  const sentence = SENTENCES.find((s) => s.id === id)
  if (!sentence) throw new Error(`Unknown sentence id: ${id}`)
  return sentence
}
