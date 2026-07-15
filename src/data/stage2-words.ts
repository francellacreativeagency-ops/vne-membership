import type { WordItem } from '../types/curriculum'

// Each word's requiredLetterIds must only reference syllables/letters that
// are authored in stage1-syllables.ts — enforced by tests/curriculum.test.ts.
export const WORDS: WordItem[] = [
  // --- checkpoint: b ---
  { id: 'baba', text: 'baba', syllableIds: ['b-ba', 'b-ba'], emoji: '🤤', meaning: 'drool', requiredLetterIds: ['b'] },
  { id: 'bebe', text: 'bebe', syllableIds: ['b-be', 'b-be'], emoji: '👶', meaning: 'baby', requiredLetterIds: ['b'] },
  { id: 'bobo', text: 'bobo', syllableIds: ['b-bo', 'b-bo'], emoji: '🤪', meaning: 'silly (boy)', requiredLetterIds: ['b'] },
  { id: 'boba', text: 'boba', syllableIds: ['b-bo', 'b-ba'], emoji: '🤪', meaning: 'silly (girl)', requiredLetterIds: ['b'] },

  // --- checkpoint: ch ---
  { id: 'bache', text: 'bache', syllableIds: ['b-ba', 'ch-che'], emoji: '🕳️', meaning: 'pothole', requiredLetterIds: ['b', 'ch'] },
  { id: 'bicho', text: 'bicho', syllableIds: ['b-bi', 'ch-cho'], emoji: '🐛', meaning: 'bug', requiredLetterIds: ['b', 'ch'] },

  // --- checkpoint: d ---
  { id: 'dedo', text: 'dedo', syllableIds: ['d-de', 'd-do'], emoji: '☝️', meaning: 'finger', requiredLetterIds: ['d'] },
  { id: 'dado', text: 'dado', syllableIds: ['d-da', 'd-do'], emoji: '🎲', meaning: 'die (dice)', requiredLetterIds: ['d'] },
  { id: 'boda', text: 'boda', syllableIds: ['b-bo', 'd-da'], emoji: '💍', meaning: 'wedding', requiredLetterIds: ['b', 'd'] },

  // --- checkpoint: f ---
  { id: 'ficha', text: 'ficha', syllableIds: ['f-fi', 'ch-cha'], emoji: '🎫', meaning: 'token', requiredLetterIds: ['f', 'ch'] },
  { id: 'fofo', text: 'fofo', syllableIds: ['f-fo', 'f-fo'], emoji: '🧽', meaning: 'squishy (masc)', requiredLetterIds: ['f'] },
  { id: 'fofa', text: 'fofa', syllableIds: ['f-fo', 'f-fa'], emoji: '🧽', meaning: 'squishy (fem)', requiredLetterIds: ['f'] },

  // --- checkpoint: g ---
  { id: 'fuga', text: 'fuga', syllableIds: ['f-fu', 'g-ga'], emoji: '💧', meaning: 'leak', requiredLetterIds: ['f', 'g'] },

  // --- checkpoint: j ---
  { id: 'jefe', text: 'jefe', syllableIds: ['j-je', 'f-fe'], emoji: '🧑‍💼', meaning: 'boss (masc)', requiredLetterIds: ['j', 'f'] },
  { id: 'jefa', text: 'jefa', syllableIds: ['j-je', 'f-fa'], emoji: '👩‍💼', meaning: 'boss (fem)', requiredLetterIds: ['j', 'f'] },
  { id: 'jugo', text: 'jugo', syllableIds: ['j-ju', 'g-go'], emoji: '🧃', meaning: 'juice', requiredLetterIds: ['j', 'g'] },

  // --- checkpoint: l ---
  { id: 'lobo', text: 'lobo', syllableIds: ['l-lo', 'b-bo'], emoji: '🐺', meaning: 'wolf (masc)', requiredLetterIds: ['l', 'b'] },
  { id: 'loba', text: 'loba', syllableIds: ['l-lo', 'b-ba'], emoji: '🐺', meaning: 'wolf (fem)', requiredLetterIds: ['l', 'b'] },
  { id: 'bola', text: 'bola', syllableIds: ['b-bo', 'l-la'], emoji: '⚽', meaning: 'ball', requiredLetterIds: ['b', 'l'] },
  { id: 'fila', text: 'fila', syllableIds: ['f-fi', 'l-la'], emoji: '🚶', meaning: 'line (queue)', requiredLetterIds: ['f', 'l'] },
  { id: 'la', text: 'la', syllableIds: ['l-la'], emoji: '👉', meaning: 'the (fem.)', requiredLetterIds: ['l'], isFunctionWord: true },
]

export function wordById(id: string): WordItem {
  const word = WORDS.find((w) => w.id === id)
  if (!word) throw new Error(`Unknown word id: ${id}`)
  return word
}

export function wordsUpToLetter(maxOrder: number, letterOrderOf: (id: string) => number): WordItem[] {
  return WORDS.filter((w) => !w.isFunctionWord && w.requiredLetterIds.every((id) => letterOrderOf(id) <= maxOrder))
}
