import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ConsonantId, StageNumber } from '../types/curriculum'
import type { ProgressState } from '../types/progress'
import { AUTHORED_LETTER_IDS } from '../data/alphabet'
import { getNextLetterToUnlock } from '../utils/curriculumHelpers'
import { computeLessonPoints } from '../data/pointsConfig'
import { shopItemById, THEME_ID_TO_DATA_THEME } from '../data/shopItems'

interface ProgressActions {
  unlockNextLetter: () => void
  recordLessonResult: (params: {
    letterId: ConsonantId
    stage: StageNumber
    correctCount: number
    reviewCorrectCount: number
    totalCount: number
    mistakeCount: number
  }) => number
  spendPoints: (itemId: string) => boolean
  equipItem: (itemId: string) => void
  setVoice: (voiceURI: string | undefined) => void
  setCurrentLetter: (letterId: ConsonantId) => void
  resetProgress: () => void
}

export type ProgressStore = ProgressState & ProgressActions

const initialState: ProgressState = {
  unlockedLetterIds: [AUTHORED_LETTER_IDS[0]],
  currentLetterId: AUTHORED_LETTER_IDS[0],
  stageProgress: {},
  points: 0,
  lifetimePoints: 0,
  shop: {
    ownedItemIds: [],
    equippedTheme: 'ocean',
  },
  settings: {},
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      unlockNextLetter: () => {
        const next = getNextLetterToUnlock(get().unlockedLetterIds)
        if (!next) return
        set((state) => ({
          unlockedLetterIds: [...state.unlockedLetterIds, next],
          currentLetterId: next,
        }))
      },

      recordLessonResult: ({ letterId, stage, correctCount, reviewCorrectCount, totalCount, mistakeCount }) => {
        const earned = computeLessonPoints({ stage, correctCount, reviewCorrectCount, totalCount, mistakeCount })
        set((state) => {
          const letterProgress = state.stageProgress[letterId] ?? {}
          const prior = letterProgress[stage]
          const scorePct = totalCount > 0 ? correctCount / totalCount : 0
          return {
            points: state.points + earned,
            lifetimePoints: state.lifetimePoints + earned,
            stageProgress: {
              ...state.stageProgress,
              [letterId]: {
                ...letterProgress,
                [stage]: {
                  completed: true,
                  bestScore: Math.max(prior?.bestScore ?? 0, scorePct),
                  attempts: (prior?.attempts ?? 0) + 1,
                },
              },
            },
          }
        })
        return earned
      },

      spendPoints: (itemId) => {
        const item = shopItemById(itemId)
        const state = get()
        if (state.shop.ownedItemIds.includes(itemId)) return false
        if (state.points < item.cost) return false
        set({
          points: state.points - item.cost,
          shop: {
            ...state.shop,
            ownedItemIds: [...state.shop.ownedItemIds, itemId],
          },
        })
        return true
      },

      equipItem: (itemId) => {
        const item = shopItemById(itemId)
        set((state) => {
          if (!state.shop.ownedItemIds.includes(itemId)) return state
          if (item.category === 'theme') {
            return { shop: { ...state.shop, equippedTheme: THEME_ID_TO_DATA_THEME[itemId] ?? state.shop.equippedTheme } }
          }
          if (item.category === 'avatar') {
            return { shop: { ...state.shop, equippedAvatarAccessory: itemId } }
          }
          return state
        })
      },

      setVoice: (voiceURI) => {
        set((state) => ({ settings: { ...state.settings, voiceURI } }))
      },

      setCurrentLetter: (letterId) => set({ currentLetterId: letterId }),

      resetProgress: () => set(initialState),
    }),
    { name: 'vne-membership-store-v1' },
  ),
)
