/**
 * Combat Log Component
 * Scrolling feed of battle events
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Shield, Zap } from 'lucide-react';
import type { BattleTurn } from '@/types';
import { fadeIn } from '@/utils/animations';

interface CombatLogProps {
  turns: BattleTurn[];
  maxTurns?: number;
}

export function CombatLog({ turns, maxTurns = 10 }: CombatLogProps) {
  const logRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new turns are added
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [turns]);

  const getEventColor = (turn: BattleTurn): string => {
    if (turn.isCritical) return 'text-red-600 font-bold';
    if (turn.action === 'defend') return 'text-blue-600';
    if (turn.action === 'heavy_attack') return 'text-orange-600';
    return 'text-gray-700';
  };

  const getEventIcon = (turn: BattleTurn) => {
    if (turn.action === 'defend') return <Shield size={16} className="text-blue-500" />;
    if (turn.isCritical) return <Zap size={16} className="text-red-500" />;
    return <Swords size={16} className="text-gray-500" />;
  };

  const displayTurns = turns.slice(-maxTurns);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <Swords size={20} />
        Combat Log
      </h3>

      <div
        ref={logRef}
        className="h-64 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {displayTurns.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Battle events will appear here...
          </div>
        ) : (
          <AnimatePresence>
            {displayTurns.map((turn) => (
              <motion.div
                key={turn.turn}
                className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <div className="mt-0.5">{getEventIcon(turn)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono bg-gray-200 px-2 py-0.5 rounded">
                      Turn {turn.turn}
                    </span>
                    {turn.isCritical && (
                      <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">
                        CRITICAL!
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${getEventColor(turn)}`}>
                    {turn.description}
                  </p>
                  {turn.damage > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {turn.defender}: {turn.defenderHpRemaining} HP remaining
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
