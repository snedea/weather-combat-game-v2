/**
 * Weather API Routes
 * Endpoints for fetching weather data and simulating battles
 */

import { Router, Request, Response, NextFunction } from 'express';
import { weatherService } from '../services/weatherService';
import { combatEngine } from '../services/combatEngine';
import { validateParams, validateBody, schemas } from '../middleware/validator';
import { WeatherApiResponse, CombatSimulateResponse } from '@shared/types';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/weather/:city
 * Fetch weather data and combat stats for a city
 */
router.get(
  '/weather/:city',
  validateParams(schemas.cityParam),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { city } = req.params;

      logger.info(`API request: GET /weather/${city}`);

      // Fetch weather data
      const weatherData = await weatherService.fetchWeatherData(city);

      // Convert to combat stats
      const stats = combatEngine.weatherToStats(weatherData);

      // Build response
      const response: WeatherApiResponse = {
        city: weatherData.city,
        country: weatherData.country,
        weather: weatherData.weather,
        stats,
        elementalType: stats.elementalType,
        timestamp: weatherData.timestamp,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/combat/simulate
 * Simulate a battle between two cities
 */
router.post(
  '/combat/simulate',
  validateBody(schemas.combatRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { city1, city2 } = req.body;

      logger.info(`API request: POST /combat/simulate - ${city1} vs ${city2}`);

      // Fetch weather data for both cities
      const [weather1, weather2] = await Promise.all([
        weatherService.fetchWeatherData(city1),
        weatherService.fetchWeatherData(city2),
      ]);

      // Convert to combat stats
      const stats1 = combatEngine.weatherToStats(weather1);
      const stats2 = combatEngine.weatherToStats(weather2);

      // Simulate battle
      const battleResult = combatEngine.simulateBattle(
        weather1.city,
        stats1,
        weather2.city,
        stats2
      );

      // Build response
      const response: CombatSimulateResponse = {
        ...battleResult,
        city1Data: {
          city: weather1.city,
          country: weather1.country,
          weather: weather1.weather,
          stats: stats1,
          elementalType: stats1.elementalType,
          timestamp: weather1.timestamp,
        },
        city2Data: {
          city: weather2.city,
          country: weather2.country,
          weather: weather2.weather,
          stats: stats2,
          elementalType: stats2.elementalType,
          timestamp: weather2.timestamp,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    uptime: process.uptime(),
  });
});

export default router;
