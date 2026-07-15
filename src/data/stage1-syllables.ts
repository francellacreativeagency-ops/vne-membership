import type { ConsonantId, Syllable } from '../types/curriculum'

const VOWELS = ['a', 'e', 'i', 'o', 'u'] as const

function makeSet(letterId: ConsonantId, prefix: string): Syllable[] {
  return VOWELS.map((v) => ({
    id: `${letterId}-${prefix}${v}`,
    letterId,
    text: `${prefix}${v}`,
  }))
}

export const SYLLABLES_BY_LETTER: Record<string, Syllable[]> = {
  b: makeSet('b', 'b'),
  ch: makeSet('ch', 'ch'),
  d: makeSet('d', 'd'),
  f: makeSet('f', 'f'),
  g: makeSet('g', 'g'),
  j: makeSet('j', 'j'),
  l: makeSet('l', 'l'),
}

export function syllablesFor(letterId: string): Syllable[] {
  return SYLLABLES_BY_LETTER[letterId] ?? []
}

export function allAuthoredSyllables(): Syllable[] {
  return Object.values(SYLLABLES_BY_LETTER).flat()
}

export function syllableById(id: string): Syllable {
  const syllable = allAuthoredSyllables().find((s) => s.id === id)
  if (!syllable) throw new Error(`Unknown syllable id: ${id}`)
  return syllable
}
