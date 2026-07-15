import { useCallback, useEffect, useState } from 'react'
import { applySpeechOverride } from '../data/speechOverrides'
import { useProgressStore } from '../state/progressStore'

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []
  return window.speechSynthesis.getVoices()
}

export function useAvailableVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(loadVoices)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const handler = () => setVoices(loadVoices())
    window.speechSynthesis.addEventListener('voiceschanged', handler)
    handler()
    return () => window.speechSynthesis.removeEventListener('voiceschanged', handler)
  }, [])

  return voices
}

function pickBestVoice(voices: SpeechSynthesisVoice[], preferredURI: string | undefined): SpeechSynthesisVoice | null {
  if (preferredURI) {
    const preferred = voices.find((v) => v.voiceURI === preferredURI)
    if (preferred) return preferred
  }
  const spanish = voices.find((v) => v.lang.toLowerCase().startsWith('es'))
  if (spanish) return spanish
  return voices[0] ?? null
}

export function useSpeech() {
  const voices = useAvailableVoices()
  const voiceURI = useProgressStore((s) => s.settings.voiceURI)

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return
      window.speechSynthesis.cancel()

      const voice = pickBestVoice(voices, voiceURI)
      const isSpanishVoice = voice?.lang.toLowerCase().startsWith('es') ?? false
      const spokenText = isSpanishVoice ? text : applySpeechOverride(text)

      const utterance = new SpeechSynthesisUtterance(spokenText)
      if (voice) utterance.voice = voice
      utterance.rate = 0.85
      utterance.pitch = 1.1
      window.speechSynthesis.speak(utterance)
    },
    [voices, voiceURI],
  )

  return { speak, voices }
}
