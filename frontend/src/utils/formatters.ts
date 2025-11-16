/**
 * Formatting Utilities
 * Helper functions for displaying data
 */

import type { ElementalType } from '@/types';

/**
 * Format temperature with unit
 */
export function formatTemperature(celsius: number): string {
  return `${celsius.toFixed(1)}°C`;
}

/**
 * Format wind speed
 */
export function formatWindSpeed(metersPerSecond: number): string {
  return `${metersPerSecond.toFixed(1)} m/s`;
}

/**
 * Format pressure
 */
export function formatPressure(hpa: number): string {
  return `${hpa} hPa`;
}

/**
 * Format humidity
 */
export function formatHumidity(percentage: number): string {
  return `${percentage}%`;
}

/**
 * Format visibility
 */
export function formatVisibility(meters: number): string {
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

/**
 * Get elemental type color
 */
export function getElementalColor(type: ElementalType): string {
  const colors: Record<ElementalType, string> = {
    Fire: '#FF6B35',
    Water: '#4ECDC4',
    Ice: '#95E1D3',
    Wind: '#F7DC6F',
    Lightning: '#E74C3C',
    Shadow: '#5D4E6D',
  };
  return colors[type];
}

/**
 * Get health bar color based on HP percentage
 */
export function getHealthColor(currentHp: number, maxHp: number): string {
  const percentage = (currentHp / maxHp) * 100;

  if (percentage > 60) return '#22c55e'; // Green
  if (percentage > 30) return '#eab308'; // Yellow
  return '#ef4444'; // Red
}

/**
 * Format battle duration
 */
export function formatDuration(milliseconds: number): string {
  const seconds = (milliseconds / 1000).toFixed(2);
  return `${seconds}s`;
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format action name for display
 */
export function formatActionName(action: string): string {
  return action
    .split('_')
    .map(capitalize)
    .join(' ');
}
