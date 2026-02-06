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
    <div className="bg-[#16213e] rounded-lg p-4 border border-[#0f3460] hover:border-[#00d9ff] transition-colors">
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-xl">{icon}</span>}
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${colorClasses[color]} stat-number`}>
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </div>
    </div>
  );
};
