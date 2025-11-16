/**
 * Elemental Icon Component
 * Displays elemental type with icon
 */

import { Flame, Droplet, Snowflake, Wind, Zap, Moon } from 'lucide-react';
import type { ElementalType } from '@/types';
import { getElementalColor } from '@/utils/formatters';

interface ElementalIconProps {
  type: ElementalType;
  size?: number;
  showLabel?: boolean;
}

export function ElementalIcon({ type, size = 24, showLabel = false }: ElementalIconProps) {
  const color = getElementalColor(type);

  const icons: Record<ElementalType, React.ReactNode> = {
    Fire: <Flame size={size} color={color} fill={color} />,
    Water: <Droplet size={size} color={color} fill={color} />,
    Ice: <Snowflake size={size} color={color} fill={color} />,
    Wind: <Wind size={size} color={color} />,
    Lightning: <Zap size={size} color={color} fill={color} />,
    Shadow: <Moon size={size} color={color} fill={color} />,
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center">
        {icons[type]}
      </div>
      {showLabel && (
        <span className="font-semibold" style={{ color }}>
          {type}
        </span>
      )}
    </div>
  );
}
