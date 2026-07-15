import type { PhraseItem } from '../types/curriculum'

// Three-word noun+adjective+adjective phrases, gender-matched, built only from stage2-words.ts.
export const PHRASES: PhraseItem[] = [
  { id: 'bicho-bobo-fofo', wordIds: ['bicho', 'bobo', 'fofo'], meaning: 'silly squishy bug', requiredLetterIds: ['b', 'ch', 'f'] },
  { id: 'jefa-boba-fofa', wordIds: ['jefa', 'boba', 'fofa'], meaning: 'silly squishy boss (fem)', requiredLetterIds: ['j', 'f', 'b'] },
  { id: 'loba-boba-fofa', wordIds: ['loba', 'boba', 'fofa'], meaning: 'silly squishy wolf (fem)', requiredLetterIds: ['l', 'b', 'f'] },
  { id: 'lobo-bobo-fofo', wordIds: ['lobo', 'bobo', 'fofo'], meaning: 'silly squishy wolf (masc)', requiredLetterIds: ['l', 'b', 'f'] },
]

export function phraseById(id: string): PhraseItem {
  const phrase = PHRASES.find((p) => p.id === id)
  if (!phrase) throw new Error(`Unknown phrase id: ${id}`)
  return phrase
}
