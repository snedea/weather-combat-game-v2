/**
 * Stat Display Component
 * Shows combat stats with progress bars
 */

import { motion } from 'framer-motion';
import { Sword, Shield, Sparkles, Gauge, Target } from 'lucide-react';
import type { CombatStats } from '@/types';
import { fadeIn } from '@/utils/animations';

interface StatDisplayProps {
  stats: CombatStats;
}

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

function StatRow({ icon, label, value, maxValue, color }: StatRowProps) {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="w-6 flex items-center justify-center text-gray-600">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-700">{label}</span>
          <span className="text-xs font-mono text-gray-600">{value}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
        </div>
      </div>
    </div>
  );
}

export function StatDisplay({ stats }: StatDisplayProps) {
  return (
    <motion.div
      className="space-y-3 bg-white/50 p-4 rounded-lg"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-sm font-bold text-gray-800 mb-3">Combat Stats</h3>

      <StatRow
        icon={<Sword size={16} />}
        label="Attack"
        value={stats.attack}
        maxValue={150}
        color="#ef4444"
      />

      <StatRow
        icon={<Shield size={16} />}
        label="Defense"
        value={stats.defense}
        maxValue={200}
        color="#3b82f6"
      />

      <StatRow
        icon={<Sparkles size={16} />}
        label="Magic"
        value={stats.magic}
        maxValue={50}
        color="#a855f7"
      />

      <StatRow
        icon={<Gauge size={16} />}
        label="Speed"
        value={stats.speed}
        maxValue={100}
        color="#22c55e"
      />

      <StatRow
        icon={<Target size={16} />}
        label="Crit Chance"
        value={stats.critChance}
        maxValue={20}
        color="#f59e0b"
      />
    </motion.div>
  );
}
