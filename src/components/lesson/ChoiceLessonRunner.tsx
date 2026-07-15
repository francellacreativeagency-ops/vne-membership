import { useMemo, useState } from 'react'
import { SpeakButton } from './SpeakButton'
import { ChoiceTile } from './ChoiceTile'
import { FeedbackOverlay, type FeedbackStatus } from './FeedbackOverlay'
import { ProgressBar } from '../common/ProgressBar'
import { useSound } from '../../hooks/useSound'
import { shuffle } from '../../utils/curriculumHelpers'

export interface ChoiceItem {
  id: string
  promptText: string
  displayText: string
  emoji?: string
  isReview?: boolean
}

interface ChoiceLessonRunnerProps {
  items: ChoiceItem[]
  distractorPool: ChoiceItem[]
  choiceCount?: number
  onComplete: (result: { correctCount: number; reviewCorrectCount: number; totalCount: number; mistakeCount: number }) => void
}

export function ChoiceLessonRunner({ items, distractorPool, choiceCount = 4, onComplete }: ChoiceLessonRunnerProps) {
  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackStatus>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [reviewCorrectCount, setReviewCorrectCount] = useState(0)
  const [mistakeCount, setMistakeCount] = useState(0)
  const { playCorrect, playIncorrect } = useSound()

  const current = items[index]

  const choices = useMemo(() => {
    if (!current) return []
    const others = distractorPool.filter((d) => d.id !== current.id)
    const distractors = shuffle(others).slice(0, choiceCount - 1)
    return shuffle([current, ...distractors])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id])

  if (!current) return null

  function handlePick(choice: ChoiceItem) {
    if (feedback) return
    const isCorrect = choice.id === current.id
    setSelectedId(choice.id)
    setFeedback(isCorrect ? 'correct' : 'incorrect')

    if (isCorrect) {
      playCorrect()
      setCorrectCount((c) => c + 1)
      if (current.isReview) setReviewCorrectCount((c) => c + 1)
    } else {
      playIncorrect()
      setMistakeCount((m) => m + 1)
    }

    setTimeout(
      () => {
        if (isCorrect) {
          setFeedback(null)
          setSelectedId(null)
          if (index + 1 < items.length) {
            setIndex((i) => i + 1)
          } else {
            onComplete({
              correctCount: correctCount + 1,
              reviewCorrectCount: reviewCorrectCount + (current.isReview ? 1 : 0),
              totalCount: items.length,
              mistakeCount,
            })
          }
        } else {
          setFeedback(null)
          setSelectedId(null)
        }
      },
      isCorrect ? 900 : 1100,
    )
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <ProgressBar current={index} total={items.length} />
      <SpeakButton text={current.promptText} />
      <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
        {choices.map((choice) => (
          <ChoiceTile
            key={choice.id}
            label={choice.displayText}
            emoji={choice.emoji}
            onClick={() => handlePick(choice)}
            disabled={!!feedback}
            state={selectedId === choice.id ? (feedback === 'correct' ? 'correct' : 'incorrect') : 'default'}
          />
        ))}
      </div>
      <FeedbackOverlay status={feedback} />
    </div>
  )
}
