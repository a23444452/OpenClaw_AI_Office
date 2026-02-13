import { motion } from 'framer-motion';
import type { ScheduledTask } from '../types';

interface ScheduledTasksProps {
  tasks: ScheduledTask[];
}

function formatNextRun(timestamp: number): string {
  const now = Date.now();
  const diffMs = timestamp - now;
  
  if (diffMs < 0) return '即將執行';
  
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '即將執行';
  if (diffMins < 60) return `${diffMins} 分鐘後`;
  if (diffHours < 24) return `${diffHours} 小時後`;
  return `${diffDays} 天後`;
}

function getAgentEmoji(agent: string): string {
  const emojiMap: Record<string, string> = {
    '小財': '👨‍💼',
    '阿新': '📰',
    '研研': '🔬',
    '螃蟹': '🦀',
    '小管': '💰',
    'Lucy': '✨',
  };
  return emojiMap[agent] || '🤖';
}

function getStatusBadge(task: ScheduledTask) {
  if (!task.enabled) {
    return <span className="px-2 py-0.5 rounded-full text-xs bg-gray-500/30 text-gray-400">停用</span>;
  }
  if (task.lastStatus === 'error') {
    return <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/30 text-red-400">異常</span>;
  }
  return <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/30 text-green-400">正常</span>;
}

export function ScheduledTasks({ tasks }: ScheduledTasksProps) {
  // Sort by next run time
  const sortedTasks = [...tasks].sort((a, b) => a.nextRunAt - b.nextRunAt);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-4"
    >
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <span>📋</span> 待執行任務
        <span className="ml-auto text-xs text-white/40">{tasks.length} 項排程</span>
      </h3>
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {sortedTasks.slice(0, 10).map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`p-3 rounded-lg ${
              task.enabled ? 'bg-white/5 hover:bg-white/10' : 'bg-white/2 opacity-60'
            } transition`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg">{getAgentEmoji(task.agent)}</span>
                <div className="min-w-0">
                  <div className="text-white text-sm font-medium truncate">
                    {task.name}
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-xs mt-0.5">
                    <span>{task.schedule}</span>
                    <span>•</span>
                    <span className="text-cyan-400">{formatNextRun(task.nextRunAt)}</span>
                  </div>
                </div>
              </div>
              {getStatusBadge(task)}
            </div>
          </motion.div>
        ))}
      </div>
      
      {tasks.length > 10 && (
        <div className="mt-3 text-center text-white/40 text-xs">
          還有 {tasks.length - 10} 項排程任務...
        </div>
      )}
    </motion.div>
  );
}
