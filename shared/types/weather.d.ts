/**
 * Weather-related type definitions
 * Shared between frontend and backend to ensure type safety
 */
export type WeatherCondition = "Clear" | "Clouds" | "Rain" | "Drizzle" | "Thunderstorm" | "Snow" | "Mist" | "Fog";
export interface WeatherData {
    city: string;
    country: string;
    weather: {
        temp: number;
        humidity: number;
        pressure: number;
        windSpeed: number;
        clouds: number;
        condition: WeatherCondition;
        visibility: number;
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
        temp: number;
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
//# sourceMappingURL=weather.d.ts.map