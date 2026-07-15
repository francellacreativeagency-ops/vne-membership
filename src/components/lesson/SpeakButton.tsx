import { useEffect, useRef } from 'react'
import { useSpeech } from '../../hooks/useSpeech'

export function SpeakButton({ text, autoSpeak = true }: { text: string; autoSpeak?: boolean }) {
  const { speak } = useSpeech()
  const lastSpoken = useRef<string | null>(null)

  useEffect(() => {
    if (!autoSpeak) return
    if (lastSpoken.current === text) return
    lastSpoken.current = text
    speak(text)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, autoSpeak])

  return (
    <button
      onClick={() => speak(text)}
      aria-label="Hear it again"
      className="text-5xl bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer"
    >
      🔊
    </button>
  )
}
