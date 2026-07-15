import { NavigationProvider, useNavigation } from './state/NavigationContext'
import { AppShell } from './components/layout/AppShell'
import { HomeScreen } from './screens/HomeScreen'
import { LessonScreen } from './screens/LessonScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import { ShopScreen } from './screens/ShopScreen'

function Router() {
  const { view } = useNavigation()

  switch (view.name) {
    case 'home':
      return <HomeScreen />
    case 'lesson':
      return <LessonScreen letterId={view.letterId} stage={view.stage} />
    case 'results':
      return (
        <ResultsScreen
          letterId={view.letterId}
          stage={view.stage}
          correctCount={view.correctCount}
          totalCount={view.totalCount}
          pointsEarned={view.pointsEarned}
        />
      )
    case 'shop':
      return <ShopScreen />
  }
}

function App() {
  return (
    <NavigationProvider>
      <AppShell>
        <Router />
      </AppShell>
    </NavigationProvider>
  )
}

export default App
