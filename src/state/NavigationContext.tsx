import { createContext, useContext, useState, type ReactNode } from 'react'
import type { ConsonantId, StageNumber } from '../types/curriculum'

export type View =
  | { name: 'home' }
  | { name: 'lesson'; letterId: ConsonantId; stage: StageNumber }
  | { name: 'results'; letterId: ConsonantId; stage: StageNumber; correctCount: number; totalCount: number; pointsEarned: number }
  | { name: 'shop' }

interface NavigationContextValue {
  view: View
  navigate: (view: View) => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>({ name: 'home' })
  return <NavigationContext.Provider value={{ view, navigate: setView }}>{children}</NavigationContext.Provider>
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider')
  return ctx
}
