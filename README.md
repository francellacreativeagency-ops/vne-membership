# Word Quest — Learn to Read

An interactive reading game for young kids, built around a Spanish syllabary
("silabario") method: each consonant is taught as a full set of five
syllables (ba/be/bi/bo/bu, cha/che/chi/cho/chu, ...), then combined into
words, phrases, and sentences as more letters unlock.

## How it works

- **Stage 1 — Syllables**: hear a syllable, tap the matching one among a few
  choices.
- **Stage 2 — Words**: same tap-to-match mechanic, now with whole words and
  emoji.
- **Stage 3–5 — Phrases & sentences**: tap word tiles in the correct order to
  build 2-word phrases, 3-word phrases, and full sentences.
- Correct answers earn points; points are spent in an in-game shop for
  stickers, badges, color themes, and avatar accessories.
- All progress is saved locally in the browser (no login, no backend).

## Curriculum

Letters unlock in sequence: **B, CH, D, F, G, J, L, ...**. A letter unlocks
the next once its Stage 1 and Stage 2 lessons are both completed. Stages 3–5
for a given phrase/sentence become available once every letter it needs has
been unlocked, so vocabulary is never used before it's been taught (enforced
by `tests/curriculum.test.ts`).

Content lives in `src/data/`:
- `alphabet.ts` — letter order
- `stage1-syllables.ts` — syllable sets per letter
- `stage2-words.ts` — words, each referencing the syllables that make it up
- `stage3-phrases.ts` / `stage4-phrases.ts` / `stage5-sentences.ts` — word
  sequences for phrase/sentence-building lessons
- `shopItems.ts`, `pointsConfig.ts` — the rewards shop and scoring rules

Audio is spoken via the browser's built-in Web Speech API (prefers an
installed Spanish voice; falls back to a phonetic respelling otherwise — see
`src/data/speechOverrides.ts`).

## Development

```bash
npm install
npm run dev       # start the dev server
npm run build     # typecheck + production build
npm test          # run the test suite
npm run lint      # oxlint
```
