import { useState } from 'react'
import { SpeakButton } from './SpeakButton'
import { TileBuilder, type BuilderTile } from './TileBuilder'
import { FeedbackOverlay, type FeedbackStatus } from './FeedbackOverlay'
import { ProgressBar } from '../common/ProgressBar'
import { useSound } from '../../hooks/useSound'
import { shuffle } from '../../utils/curriculumHelpers'

export interface OrderItem {
  id: string
  promptText: string
  tiles: BuilderTile[]
  expectedOrder: string[]
}

interface OrderLessonRunnerProps {
  items: OrderItem[]
  onComplete: (result: { correctCount: number; reviewCorrectCount: number; totalCount: number; mistakeCount: number }) => void
}

export function OrderLessonRunner({ items, onComplete }: OrderLessonRunnerProps) {
  const [index, setIndex] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackStatus>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [mistakeCount, setMistakeCount] = useState(0)
  const { playCorrect, playIncorrect } = useSound()

  const current = items[index]
  if (!current) return null

  function handleSubmit(isCorrect: boolean) {
    setFeedback(isCorrect ? 'correct' : 'incorrect')
    if (isCorrect) {
      playCorrect()
    } else {
      playIncorrect()
      setMistakeCount((m) => m + 1)
    }

    setTimeout(() => {
      setFeedback(null)
      if (isCorrect) {
        const newCorrectCount = correctCount + 1
        setCorrectCount(newCorrectCount)
        if (index + 1 < items.length) {
          setIndex((i) => i + 1)
        } else {
          onComplete({ correctCount: newCorrectCount, reviewCorrectCount: 0, totalCount: items.length, mistakeCount })
        }
      } else {
        setAttempt((a) => a + 1)
      }
    }, 1200)
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <ProgressBar current={index} total={items.length} />
      <SpeakButton text={current.promptText} />
      <TileBuilder key={`${current.id}-${attempt}`} tiles={shuffle(current.tiles)} expectedOrder={current.expectedOrder} onSubmit={handleSubmit} />
      <FeedbackOverlay status={feedback} />
    </div>
  )
}
