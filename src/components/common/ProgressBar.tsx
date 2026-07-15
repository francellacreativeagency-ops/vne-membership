export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="w-full h-4 rounded-full bg-white/30 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-[var(--theme-accent)] transition-all duration-300" style={{ width: `${pct}%` }} />
    </div>
  )
}
