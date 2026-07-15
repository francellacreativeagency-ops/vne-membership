import { ALPHABET } from '../../data/alphabet'
import { LetterNode } from './LetterNode'
import { isLetterMastered } from '../../utils/curriculumHelpers'
import { useProgressStore } from '../../state/progressStore'
import type { ConsonantId } from '../../types/curriculum'

export function LetterMap({ selectedLetterId, onSelect }: { selectedLetterId: ConsonantId | null; onSelect: (id: ConsonantId) => void }) {
  const unlockedLetterIds = useProgressStore((s) => s.unlockedLetterIds)
  const stageProgress = useProgressStore((s) => s.stageProgress)

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 justify-items-center p-4 w-full max-w-2xl">
      {ALPHABET.map((letter) => {
        const isUnlocked = unlockedLetterIds.includes(letter.id)
        const mastered = isUnlocked && isLetterMastered(letter.id, stageProgress[letter.id])
        return (
          <LetterNode
            key={letter.id}
            label={letter.displayLabel}
            status={mastered ? 'mastered' : isUnlocked ? 'unlocked' : 'locked'}
            selected={selectedLetterId === letter.id}
            onClick={() => isUnlocked && onSelect(letter.id)}
          />
        )
      })}
    </div>
  )
}
