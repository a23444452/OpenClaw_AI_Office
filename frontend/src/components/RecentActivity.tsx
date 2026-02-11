import { motion } from 'framer-motion';
import type { RecentJob } from '../types';

interface RecentActivityProps {
  jobs: RecentJob[];
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '剛剛';
  if (diffMins < 60) return `${diffMins} 分鐘前`;
  if (diffHours < 24) return `${diffHours} 小時前`;
  return `${diffDays} 天前`;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'running':
      return 'bg-blue-500 animate-pulse';
    case 'failed':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

export function RecentActivity({ jobs }: RecentActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-4"
    >
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <span>⚡</span> 最近活動
      </h3>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {jobs.slice(0, 8).map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition"
          >
            <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(job.status)}`} />
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">
                {job.title || job.name}
              </div>
              <div className="flex items-center gap-2 text-white/50 text-xs mt-1">
                <span>{job.agent}</span>
                <span>•</span>
                <span>{formatTime(job.timestamp || job.lastRunAt)}</span>
                <span>•</span>
                <span className="text-emerald-400">${job.cost.toFixed(3)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
