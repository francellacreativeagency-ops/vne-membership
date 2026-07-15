import { useState } from 'react'
import { useProgressStore } from '../../state/progressStore'
import { useNavigation } from '../../state/NavigationContext'
import { useAvailableVoices } from '../../hooks/useSpeech'
import { SHOP_ITEMS } from '../../data/shopItems'

export function TopBar() {
  const points = useProgressStore((s) => s.points)
  const equippedAvatarAccessory = useProgressStore((s) => s.shop.equippedAvatarAccessory)
  const voiceURI = useProgressStore((s) => s.settings.voiceURI)
  const setVoice = useProgressStore((s) => s.setVoice)
  const { navigate } = useNavigation()
  const voices = useAvailableVoices()
  const [showSettings, setShowSettings] = useState(false)

  const accessoryIcon = equippedAvatarAccessory ? SHOP_ITEMS.find((i) => i.id === equippedAvatarAccessory)?.icon : null

  return (
    <div className="w-full flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-sm">
      <button onClick={() => navigate({ name: 'home' })} className="flex items-center gap-2 cursor-pointer" aria-label="Home">
        <span className="text-3xl">🧑{accessoryIcon}</span>
      </button>

      <div className="flex items-center gap-3">
        <div className="bg-white text-slate-800 rounded-full px-4 py-1 font-extrabold text-lg flex items-center gap-1">
          ⭐ {points}
        </div>
        <button
          onClick={() => navigate({ name: 'shop' })}
          className="bg-white text-slate-800 rounded-full px-4 py-1 font-extrabold text-lg cursor-pointer hover:scale-105 transition-transform"
        >
          🛍️ Shop
        </button>
        <div className="relative">
          <button
            onClick={() => setShowSettings((s) => !s)}
            className="bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl cursor-pointer"
            aria-label="Voice settings"
          >
            ⚙️
          </button>
          {showSettings && (
            <div className="absolute right-0 mt-2 bg-white text-slate-800 rounded-xl shadow-lg p-3 w-64 z-50">
              <label className="text-sm font-bold block mb-1">Voice</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={voiceURI ?? ''}
                onChange={(e) => setVoice(e.target.value || undefined)}
              >
                <option value="">Auto (best Spanish voice)</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
