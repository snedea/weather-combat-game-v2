/**
 * Error Handling Middleware
 * Centralized error handling for Express
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import { CityNotFoundError, WeatherApiError } from '../services/weatherService';
import { ApiError } from '@shared/types';

/**
 * Error handler middleware
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error(`Error: ${error.message}`, error);

  // Zod validation errors
  if (error instanceof ZodError) {
    const apiError: ApiError = {
      error: 'VALIDATION_ERROR',
      message: error.errors[0].message,
      statusCode: 400,
      details: error.errors,
    };
    res.status(400).json(apiError);
    return;
  }

  // City not found
  if (error instanceof CityNotFoundError) {
    const apiError: ApiError = {
      error: 'CITY_NOT_FOUND',
      message: error.message,
      statusCode: 404,
    };
    res.status(404).json(apiError);
    return;
  }

  // Weather API errors
  if (error instanceof WeatherApiError) {
    const statusCode = error.statusCode || 502;
    const apiError: ApiError = {
      error: 'WEATHER_API_ERROR',
      message: error.message,
      statusCode,
    };
    res.status(statusCode).json(apiError);
    return;
  }

  // Generic errors
  const apiError: ApiError = {
    error: 'INTERNAL_SERVER_ERROR',
    message: error.message || 'An unexpected error occurred',
    statusCode: 500,
  };
  res.status(500).json(apiError);
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  const apiError: ApiError = {
    error: 'NOT_FOUND',
    message: `Cannot ${req.method} ${req.path}`,
    statusCode: 404,
  };
  res.status(404).json(apiError);
}
