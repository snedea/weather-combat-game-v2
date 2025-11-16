/**
 * Weather Service
 * Fetches and transforms weather data from OpenWeatherMap API
 * Implements caching to reduce API calls
 */

import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { env } from '../config/env';
import { cacheService } from './cacheService';
import { logger } from '../utils/logger';
import { transformWeatherApiResponse } from '../utils/weatherMapper';
import { WeatherData, OpenWeatherApiResponse } from '@shared/types';

/**
 * Custom error classes
 */
export class CityNotFoundError extends Error {
  constructor(city: string) {
    super(`City not found: ${city}`);
    this.name = 'CityNotFoundError';
  }
}

export class WeatherApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

/**
 * Validation schema for city name
 */
const citySchema = z.string()
  .min(1, 'City name cannot be empty')
  .max(100, 'City name too long')
  .regex(/^[a-zA-Z\s\-]+$/, 'City name contains invalid characters');

/**
 * Weather Service class
 */
class WeatherService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.apiUrl = env.openWeather.baseUrl;
    this.apiKey = env.openWeather.apiKey;
  }

  /**
   * Validate city name
   */
  private validateCity(city: string): void {
    try {
      citySchema.parse(city);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message);
      }
      throw error;
    }
  }

  /**
   * Generate cache key for city
   */
  private getCacheKey(city: string): string {
    return `weather:${city.toLowerCase().trim()}`;
  }

  /**
   * Fetch weather data from OpenWeatherMap API
   */
  private async fetchFromApi(city: string): Promise<OpenWeatherApiResponse> {
    try {
      logger.info(`Fetching weather data from API for: ${city}`);

      const response = await axios.get<OpenWeatherApiResponse>(
        `${this.apiUrl}/weather`,
        {
          params: {
            q: city,
            appid: this.apiKey,
          },
          timeout: 5000,
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new CityNotFoundError(city);
        }
        if (error.response?.status === 429) {
          throw new WeatherApiError('Rate limit exceeded', 429);
        }
        throw new WeatherApiError(
          `OpenWeatherMap API error: ${error.message}`,
          error.response?.status
        );
      }
      throw error;
    }
  }

  /**
   * Fetch weather data for a city (with caching)
   */
  async fetchWeatherData(city: string): Promise<WeatherData> {
    // Validate input
    this.validateCity(city);

    const cacheKey = this.getCacheKey(city);

    // Check cache first
    const cached = cacheService.get<WeatherData>(cacheKey);
    if (cached) {
      logger.info(`Returning cached weather data for: ${city}`);
      return cached;
    }

    // Fetch from API
    const rawData = await this.fetchFromApi(city);

    // Transform to internal format
    const weatherData = transformWeatherApiResponse(rawData);

    // Store in cache
    cacheService.set(cacheKey, weatherData);
    logger.info(`Cached weather data for: ${city}`);

    return weatherData;
  }

  /**
   * Clear cache for specific city
   */
  clearCache(city: string): void {
    const cacheKey = this.getCacheKey(city);
    cacheService.del(cacheKey);
  }

  /**
   * Clear all weather cache
   */
  clearAllCache(): void {
    cacheService.flush();
  }
}

// Export singleton instance
export const weatherService = new WeatherService();
