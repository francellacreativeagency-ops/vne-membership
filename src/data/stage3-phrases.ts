import type { PhraseItem } from '../types/curriculum'

// Two-word noun+adjective phrases, gender-matched, built only from stage2-words.ts.
export const PHRASES: PhraseItem[] = [
  { id: 'bicho-bobo', wordIds: ['bicho', 'bobo'], meaning: 'silly bug', requiredLetterIds: ['b', 'ch'] },
  { id: 'dedo-fofo', wordIds: ['dedo', 'fofo'], meaning: 'squishy finger', requiredLetterIds: ['d', 'f'] },
  { id: 'ficha-boba', wordIds: ['ficha', 'boba'], meaning: 'silly token', requiredLetterIds: ['f', 'ch', 'b'] },
  { id: 'jefe-fofo', wordIds: ['jefe', 'fofo'], meaning: 'squishy boss (masc)', requiredLetterIds: ['j', 'f'] },
  { id: 'jefa-boba', wordIds: ['jefa', 'boba'], meaning: 'silly boss (fem)', requiredLetterIds: ['j', 'f', 'b'] },
  { id: 'loba-boba', wordIds: ['loba', 'boba'], meaning: 'silly wolf (fem)', requiredLetterIds: ['l', 'b'] },
  { id: 'lobo-fofo', wordIds: ['lobo', 'fofo'], meaning: 'squishy wolf (masc)', requiredLetterIds: ['l', 'b', 'f'] },
  { id: 'bola-boba', wordIds: ['bola', 'boba'], meaning: 'silly ball', requiredLetterIds: ['b', 'l'] },
]

export function phraseById(id: string): PhraseItem {
  const phrase = PHRASES.find((p) => p.id === id)
  if (!phrase) throw new Error(`Unknown phrase id: ${id}`)
  return phrase
}
