export type FeedbackStatus = 'correct' | 'incorrect' | null

export function FeedbackOverlay({ status }: { status: FeedbackStatus }) {
  if (!status) return null
  const isCorrect = status === 'correct'
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center pointer-events-none z-50 ${isCorrect ? 'animate-pop-in' : ''}`}
      aria-live="polite"
    >
      <div
        className={`text-9xl ${isCorrect ? 'animate-pop-in' : 'animate-shake'}`}
        role="status"
      >
        {isCorrect ? '⭐' : '💭'}
      </div>
    </div>
  )
}
