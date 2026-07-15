import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HomeScreen } from '../src/screens/HomeScreen'
import { NavigationProvider } from '../src/state/NavigationContext'
import { useProgressStore } from '../src/state/progressStore'

beforeEach(() => {
  window.localStorage.clear()
  useProgressStore.getState().resetProgress()
})

describe('HomeScreen', () => {
  it('shows only the first letter unlocked and the rest locked', () => {
    render(
      <NavigationProvider>
        <HomeScreen />
      </NavigationProvider>,
    )

    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.queryByText('CH')).not.toBeInTheDocument()

    const lockedNodes = screen.getAllByText('🔒')
    // 21 of the 22 letters are locked at the very start (only B is unlocked)
    expect(lockedNodes.length).toBe(21)
  })

  it('opens the stage picker for the unlocked letter and gates stage 2 as always available', () => {
    render(
      <NavigationProvider>
        <HomeScreen />
      </NavigationProvider>,
    )

    fireEvent.click(screen.getByText('B'))
    expect(screen.getByText(/Stage 1/)).toBeInTheDocument()
    expect(screen.getByText(/Stage 2/)).toBeInTheDocument()
  })
})
