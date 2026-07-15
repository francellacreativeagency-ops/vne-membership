interface LetterNodeProps {
  label: string
  status: 'locked' | 'unlocked' | 'mastered'
  selected: boolean
  onClick: () => void
}

export function LetterNode({ label, status, selected, onClick }: LetterNodeProps) {
  const isLocked = status === 'locked'
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`relative w-20 h-20 rounded-full flex items-center justify-center text-3xl font-extrabold shadow-lg transition-transform duration-150 cursor-pointer disabled:cursor-not-allowed
        ${isLocked ? 'bg-white/20 text-white/50' : 'bg-white text-slate-800 hover:scale-110'}
        ${selected ? 'ring-4 ring-[var(--theme-accent)] scale-110' : ''}
      `}
    >
      {isLocked ? '🔒' : label}
      {status === 'mastered' && <span className="absolute -top-2 -right-2 text-2xl">⭐</span>}
    </button>
  )
}
