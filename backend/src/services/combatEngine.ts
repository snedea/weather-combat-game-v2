/**
 * Combat Engine
 * Converts weather data to RPG stats and simulates turn-based battles
 */

import {
  WeatherData,
  CombatStats,
  ElementalType,
  CombatAction,
  BattleTurn,
  BattleResult,
  DamageCalculation,
} from '@shared/types';
import { logger } from '../utils/logger';

/**
 * Determine elemental type based on weather conditions
 */
export function determineElementalType(
  condition: string,
  temp: number,
  windSpeed: number
): ElementalType {
  // Clear and hot weather = Fire
  if (condition === 'Clear' && temp > 25) {
    return 'Fire';
  }

  // Thunderstorm = Lightning
  if (condition === 'Thunderstorm') {
    return 'Lightning';
  }

  // Snow or very cold = Ice
  if (condition === 'Snow' || (condition === 'Clear' && temp < 0)) {
    return 'Ice';
  }

  // Rain or Drizzle = Water
  if (condition === 'Rain' || condition === 'Drizzle') {
    return 'Water';
  }

  // Cloudy with high wind = Wind
  if (condition === 'Clouds' && windSpeed > 10) {
    return 'Wind';
  }

  // Fog or Mist = Shadow
  if (condition === 'Fog' || condition === 'Mist') {
    return 'Shadow';
  }

  // Default: Wind for clouds, Shadow for fog/mist, Fire for clear
  if (condition === 'Clouds') return 'Wind';
  if (condition === 'Clear') return 'Fire';
  return 'Shadow';
}

/**
 * Get base magic value based on weather condition
 */
function getBaseMagic(condition: string): number {
  const magicMap: Record<string, number> = {
    'Clear': 10,
    'Clouds': 15,
    'Drizzle': 25,
    'Rain': 30,
    'Snow': 40,
    'Thunderstorm': 50,
    'Mist': 20,
    'Fog': 20,
  };
  return magicMap[condition] || 15;
}

/**
 * Convert weather data to combat stats
 */
export function weatherToStats(weather: WeatherData): CombatStats {
  const { temp, humidity, pressure, windSpeed, clouds, condition, visibility } = weather.weather;

  // HP: Based on temperature (warmer = more HP, but capped)
  // Formula: 100 + (temp * 2), capped at 200
  const tempNormalized = Math.max(-40, Math.min(50, temp)); // Clamp temp to realistic range
  const hp = Math.min(100 + Math.round(tempNormalized * 2), 200);

  // Attack: Based on wind speed and atmospheric pressure
  // Formula: (windSpeed * 5) + (pressure / 10)
  const attack = Math.round((windSpeed * 5) + (pressure / 10));

  // Defense: Based on humidity and cloud cover (atmosphere protection)
  // Formula: humidity + clouds
  const defense = Math.round(humidity + clouds);

  // Magic: Based on weather condition severity
  const magic = getBaseMagic(condition);

  // Speed: Based on visibility (clearer = faster)
  // Formula: visibility / 100, capped at 100
  const speed = Math.min(Math.round(visibility / 100), 100);

  // Critical Hit Chance: Based on weather variability
  // Formula: 10-20% based on condition severity
  const conditionSeverity = magic / 10; // Higher magic = more severe weather
  const critChance = Math.min(Math.max(10 + conditionSeverity, 10), 20);

  // Determine elemental type
  const elementalType = determineElementalType(condition, temp, windSpeed);

  // Apply 5-15% random variance for unpredictability
  const variance = () => 0.95 + Math.random() * 0.1; // 0.95 to 1.05

  return {
    hp: Math.round(hp * variance()),
    maxHp: Math.round(hp * variance()),
    attack: Math.max(Math.round(attack * variance()), 20), // Min 20 attack
    defense: Math.max(Math.round(defense * variance()), 10), // Min 10 defense
    magic: Math.round(magic * variance()),
    speed: Math.max(Math.round(speed * variance()), 10), // Min 10 speed
    critChance: Math.round(critChance * 10) / 10, // Round to 1 decimal
    elementalType,
  };
}

/**
 * Get elemental advantage multiplier
 * Fire > Ice > Water > Fire (cycle)
 * Lightning > Water, Wind
 * Shadow neutral
 */
function getElementalAdvantage(
  attackerType: ElementalType,
  defenderType: ElementalType
): number {
  const advantages: Record<ElementalType, ElementalType[]> = {
    Fire: ['Ice', 'Wind'],
    Ice: ['Water', 'Wind'],
    Water: ['Fire'],
    Lightning: ['Water', 'Wind'],
    Wind: ['Fire'],
    Shadow: [], // Neutral
  };

  if (advantages[attackerType]?.includes(defenderType)) {
    return 1.5;
  }

  return 1.0;
}

/**
 * Calculate damage for an attack
 */
export function calculateDamage(
  attacker: CombatStats & { isDefending?: boolean },
  defender: CombatStats & { isDefending?: boolean },
  action: CombatAction
): DamageCalculation {
  // Base damage: attacker's attack - (defender's defense * 0.5)
  const baseDamage = attacker.attack - (defender.defense * 0.5);

  // Elemental multiplier
  const elementalMultiplier = getElementalAdvantage(
    attacker.elementalType,
    defender.elementalType
  );

  // Critical hit check
  const isCritical = Math.random() * 100 < attacker.critChance;
  const critMultiplier = isCritical ? 2.0 : 1.0;

  // Action multiplier
  let actionMultiplier = 1.0;
  if (action === 'heavy_attack') {
    actionMultiplier = 1.5;
  } else if (action === 'defend') {
    actionMultiplier = 0; // Defend doesn't deal damage
  }

  // Defense stance multiplier (if defender is defending)
  const defenseMultiplier = defender.isDefending ? 0.5 : 1.0;

  // Calculate final damage
  const finalDamage = Math.max(
    Math.round(
      baseDamage * elementalMultiplier * critMultiplier * actionMultiplier * defenseMultiplier
    ),
    action === 'defend' ? 0 : 5 // Minimum 5 damage (except for defend)
  );

  return {
    baseDamage: Math.round(baseDamage),
    elementalMultiplier,
    critMultiplier,
    actionMultiplier,
    defenseMultiplier,
    finalDamage,
    isCritical,
  };
}

/**
 * AI action selection (weighted random)
 */
function selectAiAction(currentHp: number, maxHp: number): CombatAction {
  const hpPercentage = (currentHp / maxHp) * 100;

  // If HP is low, higher chance to defend
  if (hpPercentage < 30) {
    const rand = Math.random();
    if (rand < 0.3) return 'defend';
    if (rand < 0.7) return 'attack';
    return 'heavy_attack';
  }

  // Normal HP: weighted random
  const rand = Math.random();
  if (rand < 0.6) return 'attack';      // 60%
  if (rand < 0.9) return 'heavy_attack'; // 30%
  return 'defend';                       // 10%
}

/**
 * Generate battle description
 */
function generateDescription(
  attacker: string,
  defender: string,
  action: CombatAction,
  damage: number,
  isCritical: boolean,
  elementalAdvantage: number
): string {
  const actionText = action === 'attack' ? 'attacks' : action === 'heavy_attack' ? 'unleashes a heavy attack on' : 'defends';

  if (action === 'defend') {
    return `${attacker} takes a defensive stance!`;
  }

  let description = `${attacker} ${actionText} ${defender} for ${damage} damage`;

  if (isCritical) {
    description += ' (CRITICAL HIT!)';
  }

  if (elementalAdvantage > 1.0) {
    description += ' (Super effective!)';
  }

  return description + '!';
}

/**
 * Simulate a complete battle between two cities
 */
export function simulateBattle(
  city1Name: string,
  city1Stats: CombatStats,
  city2Name: string,
  city2Stats: CombatStats
): BattleResult {
  const startTime = Date.now();
  const turns: BattleTurn[] = [];
  const maxTurns = 50;

  // Create mutable copies with defending state
  let fighter1 = { ...city1Stats, isDefending: false };
  let fighter2 = { ...city2Stats, isDefending: false };

  // Randomly determine who goes first (higher speed = better chance)
  const speedTotal = fighter1.speed + fighter2.speed;
  const city1GoesFirst = Math.random() * speedTotal < fighter1.speed;

  logger.info(`Battle started: ${city1Name} vs ${city2Name}`);
  logger.info(`${city1GoesFirst ? city1Name : city2Name} goes first!`);

  let currentTurn = 1;
  let city1Turn = city1GoesFirst;

  while (fighter1.hp > 0 && fighter2.hp > 0 && currentTurn <= maxTurns) {
    const attacker = city1Turn ? fighter1 : fighter2;
    const defender = city1Turn ? fighter2 : fighter1;
    const attackerName = city1Turn ? city1Name : city2Name;
    const defenderName = city1Turn ? city2Name : city1Name;

    // AI selects action
    const action = selectAiAction(attacker.hp, attacker.maxHp);

    // Calculate damage
    const damageCalc = calculateDamage(attacker, defender, action);

    // Apply damage
    if (action !== 'defend') {
      defender.hp = Math.max(0, defender.hp - damageCalc.finalDamage);
      defender.isDefending = false; // Reset defending state after being attacked
    } else {
      attacker.isDefending = true; // Set defending state
    }

    // Record turn
    const turn: BattleTurn = {
      turn: currentTurn,
      attacker: attackerName,
      defender: defenderName,
      action,
      damage: damageCalc.finalDamage,
      isCritical: damageCalc.isCritical,
      attackerHpRemaining: attacker.hp,
      defenderHpRemaining: defender.hp,
      description: generateDescription(
        attackerName,
        defenderName,
        action,
        damageCalc.finalDamage,
        damageCalc.isCritical,
        damageCalc.elementalMultiplier
      ),
    };

    turns.push(turn);
    logger.debug(`Turn ${currentTurn}: ${turn.description}`);

    // Check for winner
    if (defender.hp <= 0) {
      break;
    }

    // Reset defending state if attacker didn't defend this turn
    if (action !== 'defend') {
      attacker.isDefending = false;
    }

    // Next turn
    city1Turn = !city1Turn;
    currentTurn++;
  }

  const battleDuration = Date.now() - startTime;
  const winner = fighter1.hp > 0 ? city1Name : city2Name;
  const loser = fighter1.hp > 0 ? city2Name : city1Name;

  logger.info(`Battle ended: ${winner} wins! Duration: ${battleDuration}ms`);

  return {
    winner,
    loser,
    turns,
    finalStats: {
      city1Hp: fighter1.hp,
      city2Hp: fighter2.hp,
    },
    battleDuration,
  };
}

/**
 * Combat Engine exports
 */
export const combatEngine = {
  weatherToStats,
  determineElementalType,
  calculateDamage,
  simulateBattle,
};
