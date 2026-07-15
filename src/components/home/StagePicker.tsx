import {
  getAvailableStagesForLetter,
  areAllLettersUnlocked,
  getStage3PhrasesForLetter,
  getStage4PhrasesForLetter,
  getStage5SentencesForLetter,
} from '../../utils/curriculumHelpers'
import { useProgressStore } from '../../state/progressStore'
import { Button } from '../common/Button'
import type { ConsonantId, StageNumber } from '../../types/curriculum'

const STAGE_LABELS: Record<StageNumber, string> = {
  1: 'Stage 1 · Syllables',
  2: 'Stage 2 · Words',
  3: 'Stage 3 · 2-Word Phrases',
  4: 'Stage 4 · 3-Word Phrases',
  5: 'Stage 5 · Sentences',
}

export function StagePicker({ letterId, onPick }: { letterId: ConsonantId; onPick: (stage: StageNumber) => void }) {
  const unlockedLetterIds = useProgressStore((s) => s.unlockedLetterIds)
  const stageProgress = useProgressStore((s) => s.stageProgress[letterId])
  const authoredStages = getAvailableStagesForLetter(letterId)

  function isStageReady(stage: StageNumber): boolean {
    if (stage === 1 || stage === 2) return true
    const phrases =
      stage === 3 ? getStage3PhrasesForLetter(letterId) : stage === 4 ? getStage4PhrasesForLetter(letterId) : getStage5SentencesForLetter(letterId)
    return phrases.every((p) => areAllLettersUnlocked(p.requiredLetterIds, unlockedLetterIds))
  }

  return (
    <div className="flex flex-col items-center gap-3 bg-white/10 rounded-3xl p-6 w-full max-w-md">
      {authoredStages.map((stage) => {
        const ready = isStageReady(stage)
        const completed = stageProgress?.[stage]?.completed
        return (
          <Button key={stage} variant={completed ? 'secondary' : 'primary'} disabled={!ready} onClick={() => onPick(stage)} className="w-full">
            {STAGE_LABELS[stage]} {completed ? '✓' : ''}
          </Button>
        )
      })}
    </div>
  )
}
