import { useProgressStore } from '../state/progressStore'
import { useNavigation } from '../state/NavigationContext'
import { Stage1Syllable } from '../components/lesson/Stage1Syllable'
import { Stage2Word } from '../components/lesson/Stage2Word'
import { Stage3Phrase } from '../components/lesson/Stage3Phrase'
import { Stage4Phrase } from '../components/lesson/Stage4Phrase'
import { Stage5Sentence } from '../components/lesson/Stage5Sentence'
import type { ConsonantId, StageNumber } from '../types/curriculum'
import { Button } from '../components/common/Button'

interface LessonResult {
  correctCount: number
  reviewCorrectCount: number
  totalCount: number
  mistakeCount: number
}

export function LessonScreen({ letterId, stage }: { letterId: ConsonantId; stage: StageNumber }) {
  const { navigate } = useNavigation()
  const recordLessonResult = useProgressStore((s) => s.recordLessonResult)

  function handleComplete(result: LessonResult) {
    const pointsEarned = recordLessonResult({ letterId, stage, ...result })
    navigate({ name: 'results', letterId, stage, correctCount: result.correctCount, totalCount: result.totalCount, pointsEarned })
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 w-full flex-1">
      <Button variant="ghost" onClick={() => navigate({ name: 'home' })} className="self-start text-base px-4 py-2">
        ← Back
      </Button>
      {stage === 1 && <Stage1Syllable letterId={letterId} onComplete={handleComplete} />}
      {stage === 2 && <Stage2Word letterId={letterId} onComplete={handleComplete} />}
      {stage === 3 && <Stage3Phrase letterId={letterId} onComplete={handleComplete} />}
      {stage === 4 && <Stage4Phrase letterId={letterId} onComplete={handleComplete} />}
      {stage === 5 && <Stage5Sentence letterId={letterId} onComplete={handleComplete} />}
    </div>
  )
}
