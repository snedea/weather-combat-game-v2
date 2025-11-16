/**
 * Combat-related type definitions
 * RPG mechanics for turn-based weather battles
 */

export type ElementalType =
  | "Fire"
  | "Water"
  | "Ice"
  | "Wind"
  | "Lightning"
  | "Shadow";

export type CombatAction = "attack" | "heavy_attack" | "defend";

export interface CombatStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  magic: number;
  speed: number;
  critChance: number;
  elementalType: ElementalType;
}

export interface BattleTurn {
  turn: number;
  attacker: string;
  defender: string;
  action: CombatAction;
  damage: number;
  isCritical: boolean;
  attackerHpRemaining: number;
  defenderHpRemaining: number;
  description: string;
}

export interface BattleResult {
  winner: string;
  loser: string;
  turns: BattleTurn[];
  finalStats: {
    city1Hp: number;
    city2Hp: number;
  };
  battleDuration: number;
}

export interface DamageCalculation {
  baseDamage: number;
  elementalMultiplier: number;
  critMultiplier: number;
  actionMultiplier: number;
  defenseMultiplier: number;
  finalDamage: number;
  isCritical: boolean;
}
