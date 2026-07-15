import { useState } from 'react'

export interface BuilderTile {
  id: string
  text: string
}

interface TileBuilderProps {
  tiles: BuilderTile[]
  expectedOrder: string[]
  onSubmit: (isCorrect: boolean) => void
}

export function TileBuilder({ tiles, expectedOrder, onSubmit }: TileBuilderProps) {
  const [chosenIds, setChosenIds] = useState<string[]>([])
  const [locked, setLocked] = useState(false)

  const bankTiles = tiles.filter((t) => !chosenIds.includes(t.id))

  function placeTile(id: string) {
    if (locked) return
    const next = [...chosenIds, id]
    setChosenIds(next)
    if (next.length === tiles.length) {
      setLocked(true)
      const isCorrect = next.every((tileId, i) => tileId === expectedOrder[i])
      setTimeout(() => onSubmit(isCorrect), 400)
    }
  }

  function removeTile(index: number) {
    if (locked) return
    setChosenIds((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
      <div className="flex flex-wrap justify-center gap-3 min-h-20 w-full">
        {Array.from({ length: tiles.length }).map((_, i) => {
          const tileId = chosenIds[i]
          const tile = tileId ? tiles.find((t) => t.id === tileId) : null
          return (
            <button
              key={i}
              onClick={() => tile && removeTile(i)}
              disabled={!tile || locked}
              className="min-w-24 min-h-16 rounded-2xl border-4 border-dashed border-white/60 bg-white/20 flex items-center justify-center px-4 cursor-pointer disabled:cursor-not-allowed"
            >
              {tile && <span className="text-2xl font-extrabold text-white">{tile.text}</span>}
            </button>
          )
        })}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {bankTiles.map((tile) => (
          <button
            key={tile.id}
            onClick={() => placeTile(tile.id)}
            disabled={locked}
            className="rounded-2xl bg-white text-slate-800 shadow-lg px-6 py-4 text-2xl font-extrabold hover:scale-105 active:scale-95 transition-transform cursor-pointer disabled:cursor-not-allowed"
          >
            {tile.text}
          </button>
        ))}
      </div>
    </div>
  )
}
