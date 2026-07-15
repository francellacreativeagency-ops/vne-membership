interface ChoiceTileProps {
  label: string
  emoji?: string
  onClick: () => void
  disabled?: boolean
  state?: 'default' | 'correct' | 'incorrect'
}

const STATE_CLASSES: Record<string, string> = {
  default: 'bg-white text-slate-800 hover:scale-105',
  correct: 'bg-green-400 text-white scale-105',
  incorrect: 'bg-red-400 text-white animate-shake',
}

export function ChoiceTile({ label, emoji, onClick, disabled, state = 'default' }: ChoiceTileProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-3xl shadow-lg px-6 py-8 flex flex-col items-center justify-center gap-2 min-h-32 transition-all duration-150 active:scale-95 cursor-pointer disabled:cursor-not-allowed ${STATE_CLASSES[state]}`}
    >
      {emoji && <span className="text-5xl">{emoji}</span>}
      <span className="text-3xl font-extrabold">{label}</span>
    </button>
  )
}
