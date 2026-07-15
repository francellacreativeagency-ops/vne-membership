// Phonetic English-spelling fallbacks, used only when no Spanish (es-*) voice
// is available so the browser's default (usually English) TTS voice comes
// closer to correct pronunciation. Keyed by the raw text spoken.
// Expand this as cross-browser QA (Chrome/Edge/Safari) turns up mispronunciations.
export const SPEECH_OVERRIDES: Record<string, string> = {
  // CH digraph syllables — English voices often read "chi" as "kai" etc.
  cha: 'chah',
  che: 'cheh',
  chi: 'chee',
  cho: 'choh',
  chu: 'choo',

  // Spanish J ≈ a breathy "h" sound — English voices read literal "j"/"dʒ".
  ja: 'hah',
  je: 'heh',
  ji: 'hee',
  jo: 'hoh',
  ju: 'hoo',

  // G before e/i is a breathy "h" sound in Spanish, not a hard "g".
  ge: 'heh',
  gi: 'hee',
}

export function applySpeechOverride(text: string): string {
  const lower = text.toLowerCase()
  if (SPEECH_OVERRIDES[lower]) return SPEECH_OVERRIDES[lower]

  // Multi-syllable words/phrases: override each word's matching syllable chunks.
  return text
    .split(' ')
    .map((word) => SPEECH_OVERRIDES[word.toLowerCase()] ?? word)
    .join(' ')
}
