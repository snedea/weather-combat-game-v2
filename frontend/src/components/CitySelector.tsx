/**
 * City Selector Component
 * Input form for selecting cities to battle
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Swords } from 'lucide-react';
import { useBattleStore } from '@/store/battleStore';
import { LoadingSpinner } from './LoadingSpinner';
import { fadeIn } from '@/utils/animations';

export function CitySelector() {
  const [city1Input, setCity1Input] = useState('');
  const [city2Input, setCity2Input] = useState('');

  const { fetchCities, isLoading, error, stage } = useBattleStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const city1 = city1Input.trim();
    const city2 = city2Input.trim();

    if (!city1 || !city2) {
      return;
    }

    await fetchCities(city1, city2);
  };

  if (stage !== 'selection' && stage !== 'loading') {
    return null;
  }

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Swords size={36} />
            Weather Combat Game
          </h1>
          <p className="text-blue-100">
            Turn real-time weather data into epic RPG battles!
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* City 1 Input */}
            <div>
              <label htmlFor="city1" className="block text-sm font-semibold mb-2">
                <MapPin size={16} className="inline mr-1" />
                City 1
              </label>
              <input
                id="city1"
                type="text"
                value={city1Input}
                onChange={(e) => setCity1Input(e.target.value)}
                placeholder="e.g., London"
                className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
                maxLength={100}
              />
            </div>

            {/* VS Divider */}
            <div className="text-center">
              <span className="inline-block bg-white/20 px-6 py-2 rounded-full font-bold text-xl">
                VS
              </span>
            </div>

            {/* City 2 Input */}
            <div>
              <label htmlFor="city2" className="block text-sm font-semibold mb-2">
                <MapPin size={16} className="inline mr-1" />
                City 2
              </label>
              <input
                id="city2"
                type="text"
                value={city2Input}
                onChange={(e) => setCity2Input(e.target.value)}
                placeholder="e.g., Tokyo"
                className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
                maxLength={100}
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="bg-red-500 text-white px-4 py-3 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="font-semibold">Error:</p>
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!city1Input.trim() || !city2Input.trim()}
              className="w-full bg-white text-blue-600 font-bold py-4 px-6 rounded-lg hover:bg-blue-50 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              Start Battle!
            </button>
          </form>
        )}

        {/* Educational Note */}
        <div className="mt-6 text-center text-sm text-blue-100">
          <p>
            Learn how weather conditions like temperature, humidity, and wind speed
            translate into combat stats!
          </p>
        </div>
      </div>
    </motion.div>
  );
}
