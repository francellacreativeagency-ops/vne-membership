import { useCallback, useRef } from 'react'

type ToneStep = { freq: number; duration: number }

function playTones(ctx: AudioContext, steps: ToneStep[]) {
  let startTime = ctx.currentTime
  for (const step of steps) {
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(step.freq, startTime)
    gain.gain.setValueAtTime(0.15, startTime)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + step.duration)
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start(startTime)
    oscillator.stop(startTime + step.duration)
    startTime += step.duration
  }
}

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctxRef.current = new AudioCtor()
    }
    return ctxRef.current
  }, [])

  const playCorrect = useCallback(() => {
    playTones(getCtx(), [
      { freq: 523.25, duration: 0.12 },
      { freq: 659.25, duration: 0.12 },
      { freq: 783.99, duration: 0.2 },
    ])
  }, [getCtx])

  const playIncorrect = useCallback(() => {
    playTones(getCtx(), [
      { freq: 220, duration: 0.15 },
      { freq: 180, duration: 0.25 },
    ])
  }, [getCtx])

  const playPurchase = useCallback(() => {
    playTones(getCtx(), [
      { freq: 659.25, duration: 0.1 },
      { freq: 783.99, duration: 0.1 },
      { freq: 987.77, duration: 0.25 },
    ])
  }, [getCtx])

  return { playCorrect, playIncorrect, playPurchase }
}
