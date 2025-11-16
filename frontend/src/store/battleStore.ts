/**
 * Battle Store
 * Zustand store for managing battle state
 */

import { create } from 'zustand';
import type {
  WeatherApiResponse,
  CombatSimulateResponse,
  BattleTurn,
} from '@/types';
import { api } from '@/utils/api';

interface BattleState {
  // City data
  city1: WeatherApiResponse | null;
  city2: WeatherApiResponse | null;

  // Battle data
  battleResult: CombatSimulateResponse | null;
  currentTurnIndex: number;
  isPlaying: boolean;

  // UI state
  isLoading: boolean;
  error: string | null;
  stage: 'selection' | 'loading' | 'ready' | 'battle' | 'complete';

  // Actions
  fetchCities: (city1Name: string, city2Name: string) => Promise<void>;
  startBattle: () => Promise<void>;
  playNextTurn: () => void;
  playAllTurns: () => void;
  pauseBattle: () => void;
  resetBattle: () => void;
  setError: (error: string | null) => void;
}

export const useBattleStore = create<BattleState>((set, get) => ({
  // Initial state
  city1: null,
  city2: null,
  battleResult: null,
  currentTurnIndex: -1,
  isPlaying: false,
  isLoading: false,
  error: null,
  stage: 'selection',

  /**
   * Fetch weather data for both cities
   */
  fetchCities: async (city1Name: string, city2Name: string) => {
    set({ isLoading: true, error: null, stage: 'loading' });

    try {
      // Fetch both cities in parallel
      const [city1Data, city2Data] = await Promise.all([
        api.getWeather(city1Name),
        api.getWeather(city2Name),
      ]);

      set({
        city1: city1Data,
        city2: city2Data,
        isLoading: false,
        stage: 'ready',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch city data';
      set({
        error: errorMessage,
        isLoading: false,
        stage: 'selection',
      });
    }
  },

  /**
   * Start battle simulation
   */
  startBattle: async () => {
    const { city1, city2 } = get();

    if (!city1 || !city2) {
      set({ error: 'Please select two cities first' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const result = await api.simulateCombat({
        city1: city1.city,
        city2: city2.city,
      });

      set({
        battleResult: result,
        currentTurnIndex: -1,
        isLoading: false,
        stage: 'battle',
      });

      // Auto-play first turn
      setTimeout(() => {
        get().playNextTurn();
      }, 500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start battle';
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  /**
   * Play next turn in battle
   */
  playNextTurn: () => {
    const { battleResult, currentTurnIndex } = get();

    if (!battleResult) return;

    const nextIndex = currentTurnIndex + 1;

    if (nextIndex >= battleResult.turns.length) {
      set({ stage: 'complete', isPlaying: false });
      return;
    }

    set({ currentTurnIndex: nextIndex });

    // Auto-play next turn if playing
    if (get().isPlaying) {
      setTimeout(() => {
        get().playNextTurn();
      }, 1500); // 1.5 second delay between turns
    }
  },

  /**
   * Auto-play all remaining turns
   */
  playAllTurns: () => {
    set({ isPlaying: true });
    get().playNextTurn();
  },

  /**
   * Pause auto-play
   */
  pauseBattle: () => {
    set({ isPlaying: false });
  },

  /**
   * Reset battle to initial state
   */
  resetBattle: () => {
    set({
      city1: null,
      city2: null,
      battleResult: null,
      currentTurnIndex: -1,
      isPlaying: false,
      isLoading: false,
      error: null,
      stage: 'selection',
    });
  },

  /**
   * Set error message
   */
  setError: (error: string | null) => {
    set({ error });
  },
}));

/**
 * Selector hooks for better performance
 */
export const useCity1 = () => useBattleStore((state) => state.city1);
export const useCity2 = () => useBattleStore((state) => state.city2);
export const useBattleResult = () => useBattleStore((state) => state.battleResult);
export const useCurrentTurn = () => {
  const battleResult = useBattleStore((state) => state.battleResult);
  const currentTurnIndex = useBattleStore((state) => state.currentTurnIndex);
  return battleResult?.turns[currentTurnIndex];
};
export const useBattleStage = () => useBattleStore((state) => state.stage);
export const useIsLoading = () => useBattleStore((state) => state.isLoading);
export const useBattleError = () => useBattleStore((state) => state.error);
