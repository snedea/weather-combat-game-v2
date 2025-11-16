/**
 * Health Bar Component
 * Animated HP bar with color transitions
 */

import { motion } from 'framer-motion';
import { getHealthColor } from '@/utils/formatters';
import { smoothTransition } from '@/utils/animations';

interface HealthBarProps {
  currentHp: number;
  maxHp: number;
  cityName: string;
}

export function HealthBar({ currentHp, maxHp, cityName }: HealthBarProps) {
  const percentage = Math.max(0, (currentHp / maxHp) * 100);
  const color = getHealthColor(currentHp, maxHp);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">{cityName}</span>
        <span className="text-sm font-mono text-gray-600">
          {Math.max(0, currentHp)} / {maxHp}
        </span>
      </div>
      <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full rounded-full flex items-center justify-end px-2"
          style={{ backgroundColor: color }}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={smoothTransition}
        >
          <span className="text-xs font-bold text-white drop-shadow">
            {percentage.toFixed(0)}%
          </span>
        </motion.div>
      </div>
    </div>
  );
}
