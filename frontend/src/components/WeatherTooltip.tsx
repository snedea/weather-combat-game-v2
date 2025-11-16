/**
 * Weather Tooltip Component
 * Educational content about weather metrics
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { scaleIn } from '@/utils/animations';

interface WeatherTooltipProps {
  title: string;
  description: string;
  formula?: string;
}

export function WeatherTooltip({ title, description, formula }: WeatherTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Learn more about ${title}`}
      >
        <Info size={14} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 w-64 p-3 bg-white rounded-lg shadow-xl border border-gray-200 bottom-full left-1/2 transform -translate-x-1/2 mb-2"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-gray-200" />

            <h4 className="font-bold text-sm text-gray-900 mb-2">{title}</h4>
            <p className="text-xs text-gray-700 mb-2">{description}</p>

            {formula && (
              <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-800 border border-gray-200">
                {formula}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
