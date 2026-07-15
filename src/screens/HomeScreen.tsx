import { useState } from 'react'
import { LetterMap } from '../components/home/LetterMap'
import { StagePicker } from '../components/home/StagePicker'
import { useNavigation } from '../state/NavigationContext'
import type { ConsonantId, StageNumber } from '../types/curriculum'

export function HomeScreen() {
  const { navigate } = useNavigation()
  const [selectedLetterId, setSelectedLetterId] = useState<ConsonantId | null>(null)

  function handleSelectLetter(id: ConsonantId) {
    setSelectedLetterId((prev) => (prev === id ? null : id))
  }

  function handlePickStage(stage: StageNumber) {
    if (!selectedLetterId) return
    navigate({ name: 'lesson', letterId: selectedLetterId, stage })
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 flex-1 text-white">
      <h1 className="text-3xl font-extrabold text-center">Word Quest</h1>
      <p className="text-lg opacity-90 text-center">Tap a letter to start reading!</p>
      <LetterMap selectedLetterId={selectedLetterId} onSelect={handleSelectLetter} />
      {selectedLetterId && <StagePicker letterId={selectedLetterId} onPick={handlePickStage} />}
    </div>
  )
}
