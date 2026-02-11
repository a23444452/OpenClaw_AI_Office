import { motion } from 'framer-motion';
import type { DashboardData } from '../types';

interface StatsPanelProps {
  data: DashboardData;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

function formatCurrency(num: number): string {
  if (num >= 10000) {
    return 'NT$' + (num / 10000).toFixed(1) + '萬';
  }
  return 'NT$' + num.toLocaleString();
}

export function StatsPanel({ data }: StatsPanelProps) {
  const stats = [
    {
      label: '總任務數',
      value: data.totalTasks.toString(),
      icon: '📋',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Token 使用',
      value: formatNumber(data.totalTokens),
      icon: '🔤',
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'API 成本',
      value: '$' + data.totalCost.toFixed(2),
      icon: '💵',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: '節省金額',
      value: formatCurrency(data.totalSavings),
      icon: '💰',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">{stat.icon}</span>
            <div className="text-right">
              <div className="text-white/80 text-xs">{stat.label}</div>
              <div className="text-white font-bold text-lg md:text-xl">{stat.value}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
