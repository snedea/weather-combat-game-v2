/**
 * API-related type definitions
 * Request/response contracts between frontend and backend
 */
import { WeatherData } from './weather';
import { CombatStats, ElementalType, BattleResult } from './combat';
export interface ApiError {
    error: string;
    message: string;
    statusCode: number;
    details?: any;
}
export interface WeatherApiResponse {
    city: string;
    country: string;
    weather: WeatherData["weather"];
    stats: CombatStats;
    elementalType: ElementalType;
    timestamp: number;
}
export interface CombatSimulateRequest {
    city1: string;
    city2: string;
}
export interface CombatSimulateResponse extends BattleResult {
    city1Data: WeatherApiResponse;
    city2Data: WeatherApiResponse;
}
//# sourceMappingURL=api.d.ts.map