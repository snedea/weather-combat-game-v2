/**
 * Weather-related type definitions
 * Shared between frontend and backend to ensure type safety
 */

export type WeatherCondition =
  | "Clear"
  | "Clouds"
  | "Rain"
  | "Drizzle"
  | "Thunderstorm"
  | "Snow"
  | "Mist"
  | "Fog";

export interface WeatherData {
  city: string;
  country: string;
  weather: {
    temp: number;          // Celsius
    humidity: number;      // 0-100
    pressure: number;      // hPa
    windSpeed: number;     // m/s
    clouds: number;        // 0-100
    condition: WeatherCondition;
    visibility: number;    // meters
    description: string;
  };
  timestamp: number;
}

/**
 * OpenWeatherMap API response structure (external)
 */
export interface OpenWeatherApiResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;         // Kelvin
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
  };
  name: string;
}
