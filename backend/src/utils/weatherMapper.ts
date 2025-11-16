/**
 * Weather Mapper Utility
 * Transforms OpenWeatherMap API responses to internal format
 */

import { OpenWeatherApiResponse, WeatherData, WeatherCondition } from '@shared/types';

/**
 * Convert Kelvin to Celsius
 */
export function kelvinToCelsius(kelvin: number): number {
  return Math.round((kelvin - 273.15) * 10) / 10;
}

/**
 * Normalize weather condition string to our enum
 */
export function normalizeCondition(condition: string): WeatherCondition {
  const normalized = condition.toLowerCase();

  if (normalized.includes('clear')) return 'Clear';
  if (normalized.includes('cloud')) return 'Clouds';
  if (normalized.includes('rain')) return 'Rain';
  if (normalized.includes('drizzle')) return 'Drizzle';
  if (normalized.includes('thunder') || normalized.includes('storm')) return 'Thunderstorm';
  if (normalized.includes('snow')) return 'Snow';
  if (normalized.includes('mist')) return 'Mist';
  if (normalized.includes('fog') || normalized.includes('haze')) return 'Fog';

  // Default to Clouds if unknown
  return 'Clouds';
}

/**
 * Transform OpenWeatherMap API response to internal WeatherData format
 */
export function transformWeatherApiResponse(raw: OpenWeatherApiResponse): WeatherData {
  const mainWeather = raw.weather[0];

  return {
    city: raw.name,
    country: raw.sys.country,
    weather: {
      temp: kelvinToCelsius(raw.main.temp),
      humidity: raw.main.humidity,
      pressure: raw.main.pressure,
      windSpeed: raw.wind.speed,
      clouds: raw.clouds.all,
      condition: normalizeCondition(mainWeather.main),
      visibility: raw.visibility,
      description: mainWeather.description,
    },
    timestamp: raw.dt * 1000, // Convert to milliseconds
  };
}
