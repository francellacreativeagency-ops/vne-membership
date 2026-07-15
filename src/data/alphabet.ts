import type { Letter } from '../types/curriculum'

// Order is not strictly alphabetical: L is pulled forward (after J) so the
// article "la" is available early, letting Stage 5 build real grammatical
// Spanish sentences ("la loba boba") instead of disconnected word strings.
// Letters after L are present so they render as "locked / coming soon" on
// the map, but only B/CH/D/F/G/J/L have full lesson content authored (v1).
export const ALPHABET: Letter[] = [
  { id: 'b', displayLabel: 'B', order: 1 },
  { id: 'ch', displayLabel: 'CH', order: 2 },
  { id: 'd', displayLabel: 'D', order: 3 },
  { id: 'f', displayLabel: 'F', order: 4 },
  { id: 'g', displayLabel: 'G', order: 5 },
  { id: 'j', displayLabel: 'J', order: 6 },
  { id: 'l', displayLabel: 'L', order: 7 },
  { id: 'h', displayLabel: 'H', order: 8 },
  { id: 'k', displayLabel: 'K', order: 9 },
  { id: 'm', displayLabel: 'M', order: 10 },
  { id: 'n', displayLabel: 'N', order: 11 },
  { id: 'ny', displayLabel: 'Ñ', order: 12 },
  { id: 'ng', displayLabel: 'NG', order: 13 },
  { id: 'p', displayLabel: 'P', order: 14 },
  { id: 'r', displayLabel: 'R', order: 15 },
  { id: 's', displayLabel: 'S', order: 16 },
  { id: 't', displayLabel: 'T', order: 17 },
  { id: 'v', displayLabel: 'V', order: 18 },
  { id: 'w', displayLabel: 'W', order: 19 },
  { id: 'x', displayLabel: 'X', order: 20 },
  { id: 'y', displayLabel: 'Y', order: 21 },
  { id: 'z', displayLabel: 'Z', order: 22 },
]

export const AUTHORED_LETTER_IDS = ['b', 'ch', 'd', 'f', 'g', 'j', 'l'] as const

export function letterOrder(id: string): number {
  const letter = ALPHABET.find((l) => l.id === id)
  if (!letter) throw new Error(`Unknown letter id: ${id}`)
  return letter.order
}

export function letterById(id: string): Letter {
  const letter = ALPHABET.find((l) => l.id === id)
  if (!letter) throw new Error(`Unknown letter id: ${id}`)
  return letter
}
