/**
 * API Client
 * Axios instance configured for backend communication
 */

import axios, { AxiosError } from 'axios';
import type { WeatherApiResponse, CombatSimulateRequest, CombatSimulateResponse, ApiError } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * Configured axios instance
 */
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Error handler for API calls
 */
export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;
    if (apiError?.message) {
      return apiError.message;
    }
    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * API Methods
 */
export const api = {
  /**
   * Fetch weather data for a city
   */
  async getWeather(city: string): Promise<WeatherApiResponse> {
    try {
      const response = await apiClient.get<WeatherApiResponse>(`/weather/${encodeURIComponent(city)}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Simulate combat between two cities
   */
  async simulateCombat(request: CombatSimulateRequest): Promise<CombatSimulateResponse> {
    try {
      const response = await apiClient.post<CombatSimulateResponse>('/combat/simulate', request);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; timestamp: number }> {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
