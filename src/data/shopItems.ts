export type ShopCategory = 'sticker' | 'badge' | 'theme' | 'avatar'

export interface ShopItem {
  id: string
  name: string
  category: ShopCategory
  cost: number
  icon: string
  description: string
}

export const SHOP_ITEMS: ShopItem[] = [
  // Stickers
  { id: 'sticker-star', name: 'Star Sticker', category: 'sticker', cost: 20, icon: '⭐', description: 'A shiny star for your collection.' },
  { id: 'sticker-rainbow', name: 'Rainbow Sticker', category: 'sticker', cost: 25, icon: '🌈', description: 'A colorful rainbow.' },
  { id: 'sticker-rocket', name: 'Rocket Sticker', category: 'sticker', cost: 30, icon: '🚀', description: 'Blast off!' },
  { id: 'sticker-unicorn', name: 'Unicorn Sticker', category: 'sticker', cost: 40, icon: '🦄', description: 'A magical unicorn.' },

  // Badges
  { id: 'badge-gold-star', name: 'Gold Star Badge', category: 'badge', cost: 50, icon: '🏅', description: 'For trying your best.' },
  { id: 'badge-reading-champ', name: 'Reading Champ', category: 'badge', cost: 65, icon: '🏆', description: 'A true reading champion.' },
  { id: 'badge-super-speller', name: 'Super Speller', category: 'badge', cost: 80, icon: '🥇', description: 'Amazing spelling skills!' },

  // Themes (one equipped at a time)
  { id: 'theme-ocean', name: 'Ocean Blue Theme', category: 'theme', cost: 60, icon: '🌊', description: 'Cool ocean colors.' },
  { id: 'theme-sunset', name: 'Sunset Orange Theme', category: 'theme', cost: 60, icon: '🌅', description: 'Warm sunset colors.' },
  { id: 'theme-candy', name: 'Candy Pink Theme', category: 'theme', cost: 60, icon: '🍬', description: 'Sweet candy colors.' },
  { id: 'theme-jungle', name: 'Jungle Green Theme', category: 'theme', cost: 60, icon: '🌴', description: 'Wild jungle colors.' },

  // Avatar accessories (one equipped at a time)
  { id: 'avatar-party-hat', name: 'Party Hat', category: 'avatar', cost: 100, icon: '🎉', description: 'Time to celebrate!' },
  { id: 'avatar-cape', name: 'Super Cape', category: 'avatar', cost: 100, icon: '🦸', description: 'Fly like a hero.' },
  { id: 'avatar-wizard-hat', name: 'Wizard Hat', category: 'avatar', cost: 120, icon: '🧙', description: 'Reading magic!' },
  { id: 'avatar-sunglasses', name: 'Cool Sunglasses', category: 'avatar', cost: 120, icon: '😎', description: 'Too cool for school.' },
]

export function shopItemById(id: string): ShopItem {
  const item = SHOP_ITEMS.find((i) => i.id === id)
  if (!item) throw new Error(`Unknown shop item id: ${id}`)
  return item
}

export const THEME_ID_TO_DATA_THEME: Record<string, string> = {
  'theme-ocean': 'ocean',
  'theme-sunset': 'sunset',
  'theme-candy': 'candy',
  'theme-jungle': 'jungle',
}
