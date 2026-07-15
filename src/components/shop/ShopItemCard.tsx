import type { ShopItem } from '../../data/shopItems'
import { Button } from '../common/Button'

interface ShopItemCardProps {
  item: ShopItem
  owned: boolean
  equipped: boolean
  canAfford: boolean
  onBuy: () => void
  onEquip: () => void
}

export function ShopItemCard({ item, owned, equipped, canAfford, onBuy, onEquip }: ShopItemCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-4 flex flex-col items-center gap-2 text-slate-800">
      <div className="text-5xl">{item.icon}</div>
      <div className="font-extrabold text-center">{item.name}</div>
      <div className="text-sm text-slate-500 text-center">{item.description}</div>
      {owned ? (
        item.category === 'theme' || item.category === 'avatar' ? (
          <Button variant={equipped ? 'secondary' : 'primary'} onClick={onEquip} className="text-base px-4 py-2 w-full">
            {equipped ? 'Equipped ✓' : 'Equip'}
          </Button>
        ) : (
          <div className="font-bold text-green-600">Owned ✓</div>
        )
      ) : (
        <Button variant="primary" disabled={!canAfford} onClick={onBuy} className="text-base px-4 py-2 w-full">
          ⭐ {item.cost}
        </Button>
      )}
    </div>
  )
}
