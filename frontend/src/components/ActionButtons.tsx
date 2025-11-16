/**
 * Action Buttons Component
 * Control buttons for battle playback
 */

import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { useBattleStore } from '@/store/battleStore';
import { scaleIn } from '@/utils/animations';

export function ActionButtons() {
  const {
    isPlaying,
    battleResult,
    currentTurnIndex,
    stage,
    playNextTurn,
    playAllTurns,
    pauseBattle,
    resetBattle,
  } = useBattleStore();

  if (stage !== 'battle' && stage !== 'complete') {
    return null;
  }

  const isComplete = stage === 'complete';
  const hasMoreTurns = battleResult && currentTurnIndex < battleResult.turns.length - 1;

  return (
    <motion.div
      className="flex items-center justify-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-200"
      variants={scaleIn}
      initial="hidden"
      animate="visible"
    >
      {!isComplete && (
        <>
          {/* Play/Pause */}
          <button
            onClick={isPlaying ? pauseBattle : playAllTurns}
            disabled={!hasMoreTurns}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play All'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            {isPlaying ? 'Pause' : 'Play All'}
          </button>

          {/* Next Turn */}
          <button
            onClick={playNextTurn}
            disabled={!hasMoreTurns || isPlaying}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            aria-label="Next Turn"
          >
            <SkipForward size={20} />
            Next Turn
          </button>
        </>
      )}

      {/* Reset */}
      <button
        onClick={resetBattle}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
        aria-label="New Battle"
      >
        <RotateCcw size={20} />
        New Battle
      </button>
    </motion.div>
  );
}
