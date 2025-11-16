/**
 * Combat Arena Component
 * Main battle display with health bars and animations
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Skull } from 'lucide-react';
import { useBattleStore, useCity1, useCity2, useCurrentTurn } from '@/store/battleStore';
import { CityCard } from './CityCard';
import { HealthBar } from './HealthBar';
import { CombatLog } from './CombatLog';
import { ActionButtons } from './ActionButtons';
import { victory, attackShake } from '@/utils/animations';
import { useEffect, useState } from 'react';

export function CombatArena() {
  const { stage, battleResult, currentTurnIndex, startBattle } = useBattleStore();
  const city1 = useCity1();
  const city2 = useCity2();
  const currentTurn = useCurrentTurn();

  const [city1Hp, setCity1Hp] = useState(0);
  const [city2Hp, setCity2Hp] = useState(0);
  const [attackingCity, setAttackingCity] = useState<'city1' | 'city2' | null>(null);

  // Initialize HP when battle data is available
  useEffect(() => {
    if (city1 && city2 && !battleResult) {
      setCity1Hp(city1.stats.maxHp);
      setCity2Hp(city2.stats.maxHp);
    }
  }, [city1, city2, battleResult]);

  // Update HP based on current turn
  useEffect(() => {
    if (battleResult && currentTurnIndex >= 0) {
      const turn = battleResult.turns[currentTurnIndex];

      // Trigger attack animation
      if (turn.attacker === city1?.city) {
        setAttackingCity('city1');
      } else {
        setAttackingCity('city2');
      }

      // Update HP after brief delay for animation
      setTimeout(() => {
        if (turn.attacker === city1?.city) {
          setCity2Hp(turn.defenderHpRemaining);
        } else {
          setCity1Hp(turn.defenderHpRemaining);
        }
        setAttackingCity(null);
      }, 300);
    }
  }, [battleResult, currentTurnIndex, city1, city2]);

  if (stage === 'selection' || stage === 'loading') {
    return null;
  }

  if (!city1 || !city2) {
    return null;
  }

  const isComplete = stage === 'complete';
  const winner = battleResult?.winner;
  const turns = battleResult?.turns.slice(0, currentTurnIndex + 1) || [];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Ready Stage - Show City Cards */}
      {stage === 'ready' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <CityCard cityData={city1} position="left" />
            <CityCard cityData={city2} position="right" />
          </div>

          <div className="text-center">
            <button
              onClick={startBattle}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              ⚔️ Start Battle!
            </button>
          </div>
        </motion.div>
      )}

      {/* Battle Stage - Show Arena */}
      {(stage === 'battle' || stage === 'complete') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Battle Arena */}
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl shadow-2xl p-8 border-4 border-purple-300">
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              {/* City 1 */}
              <motion.div
                animate={attackingCity === 'city1' ? 'shake' : 'initial'}
                variants={attackShake}
              >
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{city1.city}</h2>
                  <span className="text-sm text-gray-600">{city1.country}</span>
                </div>
                <HealthBar
                  currentHp={city1Hp}
                  maxHp={city1.stats.maxHp}
                  cityName={city1.city}
                />
              </motion.div>

              {/* City 2 */}
              <motion.div
                animate={attackingCity === 'city2' ? 'shake' : 'initial'}
                variants={attackShake}
              >
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{city2.city}</h2>
                  <span className="text-sm text-gray-600">{city2.country}</span>
                </div>
                <HealthBar
                  currentHp={city2Hp}
                  maxHp={city2.stats.maxHp}
                  cityName={city2.city}
                />
              </motion.div>
            </div>

            {/* Turn Counter */}
            {currentTurnIndex >= 0 && (
              <div className="text-center">
                <div className="inline-block bg-white/80 px-6 py-2 rounded-full shadow-md">
                  <span className="text-lg font-bold text-gray-800">
                    Turn {currentTurnIndex + 1}
                    {battleResult && ` / ${battleResult.turns.length}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Victory Overlay */}
          <AnimatePresence>
            {isComplete && winner && (
              <motion.div
                className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-2xl p-8 text-center border-4 border-yellow-600"
                variants={victory}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                  {winner === city1.city ? (
                    <Trophy size={48} className="text-white" />
                  ) : (
                    <Trophy size={48} className="text-white" />
                  )}
                  <h2 className="text-4xl font-bold text-white">
                    {winner} Wins!
                  </h2>
                  {winner === city1.city ? (
                    <Trophy size={48} className="text-white" />
                  ) : (
                    <Trophy size={48} className="text-white" />
                  )}
                </div>
                <p className="text-xl text-white/90">
                  Victory through superior weather conditions!
                </p>
                {battleResult && (
                  <p className="text-white/80 mt-2">
                    Battle lasted {battleResult.turns.length} turns
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Combat Log */}
          <CombatLog turns={turns} />

          {/* Action Buttons */}
          <ActionButtons />
        </motion.div>
      )}
    </div>
  );
}
