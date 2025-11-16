/**
 * City Card Component
 * Displays city weather data and combat stats
 */

import { motion } from 'framer-motion';
import { MapPin, Thermometer, Droplets, Wind, Eye, Cloud } from 'lucide-react';
import type { WeatherApiResponse } from '@/types';
import { ElementalIcon } from './ElementalIcon';
import { StatDisplay } from './StatDisplay';
import { WeatherTooltip } from './WeatherTooltip';
import {
  formatTemperature,
  formatWindSpeed,
  formatHumidity,
  formatVisibility,
  formatPressure,
} from '@/utils/formatters';
import { slideInLeft, slideInRight } from '@/utils/animations';

interface CityCardProps {
  cityData: WeatherApiResponse;
  position: 'left' | 'right';
}

export function CityCard({ cityData, position }: CityCardProps) {
  const animation = position === 'left' ? slideInLeft : slideInRight;

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-200"
      variants={animation}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      {/* City Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={20} className="text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {cityData.city}
            </h2>
          </div>
          <p className="text-sm text-gray-600">{cityData.country}</p>
        </div>
        <ElementalIcon type={cityData.elementalType} size={32} showLabel />
      </div>

      {/* Weather Conditions */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-800">Current Weather</h3>
          <span className="text-xs text-gray-600 capitalize">
            {cityData.weather.description}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Thermometer size={16} className="text-red-500" />
            <span className="text-gray-700">
              {formatTemperature(cityData.weather.temp)}
            </span>
            <WeatherTooltip
              title="Temperature"
              description="Temperature affects HP in combat. Warmer climates get more health points!"
              formula="HP = 100 + (temp × 2)"
            />
          </div>

          <div className="flex items-center gap-2">
            <Droplets size={16} className="text-blue-500" />
            <span className="text-gray-700">
              {formatHumidity(cityData.weather.humidity)}
            </span>
            <WeatherTooltip
              title="Humidity"
              description="Humidity contributes to defense. Higher humidity provides better protection!"
              formula="Defense = humidity + clouds"
            />
          </div>

          <div className="flex items-center gap-2">
            <Wind size={16} className="text-green-500" />
            <span className="text-gray-700">
              {formatWindSpeed(cityData.weather.windSpeed)}
            </span>
            <WeatherTooltip
              title="Wind Speed"
              description="Wind speed increases attack power. Stronger winds mean more damage!"
              formula="Attack = (windSpeed × 5) + (pressure / 10)"
            />
          </div>

          <div className="flex items-center gap-2">
            <Cloud size={16} className="text-gray-500" />
            <span className="text-gray-700">
              {cityData.weather.clouds}%
            </span>
            <WeatherTooltip
              title="Cloud Cover"
              description="Cloud cover adds to defense, providing atmospheric protection."
              formula="Defense = humidity + clouds"
            />
          </div>

          <div className="flex items-center gap-2">
            <Eye size={16} className="text-purple-500" />
            <span className="text-gray-700">
              {formatVisibility(cityData.weather.visibility)}
            </span>
            <WeatherTooltip
              title="Visibility"
              description="Visibility determines speed. Clear conditions allow faster reactions!"
              formula="Speed = visibility / 100"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            Pressure: {formatPressure(cityData.weather.pressure)}
          </div>
        </div>
      </div>

      {/* Combat Stats */}
      <StatDisplay stats={cityData.stats} />

      {/* HP Display */}
      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Max HP</span>
          <span className="text-2xl font-bold text-green-600">
            {cityData.stats.maxHp}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
