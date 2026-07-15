import { SHOP_ITEMS, type ShopCategory } from '../data/shopItems'
import { ShopItemCard } from '../components/shop/ShopItemCard'
import { useProgressStore } from '../state/progressStore'
import { useNavigation } from '../state/NavigationContext'
import { useSound } from '../hooks/useSound'
import { Button } from '../components/common/Button'

const CATEGORY_LABELS: Record<ShopCategory, string> = {
  sticker: 'Stickers',
  badge: 'Badges',
  theme: 'Themes',
  avatar: 'Avatar',
}

export function ShopScreen() {
  const { navigate } = useNavigation()
  const points = useProgressStore((s) => s.points)
  const ownedItemIds = useProgressStore((s) => s.shop.ownedItemIds)
  const equippedTheme = useProgressStore((s) => s.shop.equippedTheme)
  const equippedAvatarAccessory = useProgressStore((s) => s.shop.equippedAvatarAccessory)
  const spendPoints = useProgressStore((s) => s.spendPoints)
  const equipItem = useProgressStore((s) => s.equipItem)
  const { playPurchase } = useSound()

  const categories: ShopCategory[] = ['sticker', 'badge', 'theme', 'avatar']

  function isEquipped(item: (typeof SHOP_ITEMS)[number]) {
    if (item.category === 'theme') return item.id === `theme-${equippedTheme}`
    if (item.category === 'avatar') return item.id === equippedAvatarAccessory
    return false
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 flex-1 text-white">
      <div className="w-full flex items-center justify-between max-w-2xl">
        <Button variant="ghost" onClick={() => navigate({ name: 'home' })} className="text-base px-4 py-2">
          ← Back
        </Button>
        <h1 className="text-3xl font-extrabold">Shop</h1>
        <div className="bg-white text-slate-800 rounded-full px-4 py-1 font-extrabold">⭐ {points}</div>
      </div>

      {categories.map((category) => (
        <div key={category} className="w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-3">{CATEGORY_LABELS[category]}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SHOP_ITEMS.filter((i) => i.category === category).map((item) => (
              <ShopItemCard
                key={item.id}
                item={item}
                owned={ownedItemIds.includes(item.id)}
                equipped={isEquipped(item)}
                canAfford={points >= item.cost}
                onBuy={() => {
                  if (spendPoints(item.id)) playPurchase()
                }}
                onEquip={() => equipItem(item.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
