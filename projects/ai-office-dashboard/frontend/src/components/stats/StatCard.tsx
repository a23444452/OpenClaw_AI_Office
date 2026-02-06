import React from 'react';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: string;
  color?: 'cyan' | 'green' | 'orange' | 'red';
  prefix?: string;
  suffix?: string;
}

const colorClasses = {
  cyan: 'text-[#00d9ff]',
  green: 'text-[#00ff88]',
  orange: 'text-[#ffaa00]',
  red: 'text-[#ff6b6b]',
};

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  color = 'cyan',
  prefix = '',
  suffix = '',
}) => {
  return (
    <div className="bg-[#16213e] rounded-lg p-2.5 sm:p-3 md:p-4 border border-[#0f3460] hover:border-[#00d9ff] transition-colors">
      <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
        {icon && <span className="text-base sm:text-lg md:text-xl">{icon}</span>}
        <span className="text-gray-400 text-[10px] sm:text-xs md:text-sm truncate">{label}</span>
      </div>
      <div className={`text-lg sm:text-xl md:text-2xl font-bold ${colorClasses[color]} stat-number`}>
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </div>
    </div>
  );
};
