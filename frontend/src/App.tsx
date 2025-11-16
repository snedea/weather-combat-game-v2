/**
 * Main App Component
 * Weather Combat Game
 */

import { useBattleStore } from './store/battleStore';
import { CitySelector } from './components/CitySelector';
import { CombatArena } from './components/CombatArena';

function App() {
  const stage = useBattleStore((state) => state.stage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          {stage !== 'selection' && stage !== 'loading' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                ⚔️ Weather Combat Game
              </h1>
              <p className="text-gray-600">
                Real-time weather data transformed into epic battles!
              </p>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main>
          <CitySelector />
          <CombatArena />
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-600">
          <p>
            Powered by{' '}
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              OpenWeatherMap API
            </a>
          </p>
          <p className="mt-2">
            Educational weather game - Learn meteorology through gameplay!
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
