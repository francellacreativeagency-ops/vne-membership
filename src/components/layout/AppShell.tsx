import { useEffect, type ReactNode } from 'react'
import { useProgressStore } from '../../state/progressStore'
import { TopBar } from './TopBar'

export function AppShell({ children }: { children: ReactNode }) {
  const equippedTheme = useProgressStore((s) => s.shop.equippedTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', equippedTheme)
  }, [equippedTheme])

  return (
    <div className="min-h-svh flex flex-col">
      <TopBar />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}
