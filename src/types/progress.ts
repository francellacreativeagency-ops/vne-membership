import type { ConsonantId, StageNumber } from './curriculum'

export interface StageResult {
  completed: boolean
  bestScore: number
  attempts: number
}

export type LetterStageProgress = Partial<Record<StageNumber, StageResult>>

export interface ShopState {
  ownedItemIds: string[]
  equippedTheme: string
  equippedAvatarAccessory?: string
}

export interface Settings {
  voiceURI?: string
}

export interface ProgressState {
  unlockedLetterIds: ConsonantId[]
  currentLetterId: ConsonantId
  stageProgress: Partial<Record<ConsonantId, LetterStageProgress>>
  points: number
  lifetimePoints: number
  shop: ShopState
  settings: Settings
}
