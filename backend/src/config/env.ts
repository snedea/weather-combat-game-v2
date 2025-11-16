/**
 * Environment configuration
 * Validates and exports environment variables
 */

import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3001').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  OPENWEATHER_API_KEY: z.string().min(1, 'OpenWeatherMap API key is required'),
  OPENWEATHER_BASE_URL: z.string().url().default('https://api.openweathermap.org/data/2.5'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
  CACHE_TTL: z.string().default('600').transform(Number),
  CACHE_CHECK_PERIOD: z.string().default('120').transform(Number),
  RATE_LIMIT_WINDOW_MS: z.string().default('60000').transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),
});

type EnvConfig = z.infer<typeof envSchema>;

let config: EnvConfig;

try {
  config = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export const env = {
  port: config.PORT,
  nodeEnv: config.NODE_ENV,
  openWeather: {
    apiKey: config.OPENWEATHER_API_KEY,
    baseUrl: config.OPENWEATHER_BASE_URL,
  },
  cors: {
    allowedOrigins: config.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()),
  },
  cache: {
    ttl: config.CACHE_TTL,
    checkPeriod: config.CACHE_CHECK_PERIOD,
  },
  rateLimit: {
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    maxRequests: config.RATE_LIMIT_MAX_REQUESTS,
  },
  isDevelopment: config.NODE_ENV === 'development',
  isProduction: config.NODE_ENV === 'production',
  isTest: config.NODE_ENV === 'test',
};
