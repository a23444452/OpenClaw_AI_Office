import { motion, AnimatePresence } from 'framer-motion';
import type { Agent, RecentJob } from '../types';

interface CharacterModalProps {
  agent: Agent | null;
  recentJobs: RecentJob[];
  onClose: () => void;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function formatCurrency(num: number): string {
  if (num >= 10000) {
    return 'NT$' + (num / 10000).toFixed(1) + '萬';
  }
  return 'NT$' + num.toLocaleString();
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-TW', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CharacterModal({ agent, recentJobs, onClose }: CharacterModalProps) {
  if (!agent) return null;

  const agentJobs = recentJobs.filter(
    (job) => job.agent === agent.name || job.agent.toLowerCase() === agent.id
  ).slice(0, 5);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 bg-gradient-to-r from-indigo-600/30 to-purple-600/30">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-xl"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-4">
              <img
                src={`/avatars/chibi-${agent.id}.png`}
                alt={agent.name}
                className="w-20 h-20 object-contain"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
                <p className="text-white/70">{agent.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      agent.status === 'active'
                        ? 'bg-green-500'
                        : agent.status === 'busy'
                        ? 'bg-yellow-500'
                        : 'bg-gray-400'
                    }`}
                  />
                  <span className="text-sm text-white/60">
                    {agent.status === 'active' ? '工作中' : agent.status === 'busy' ? '忙碌' : '待命'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 border-b border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/60 text-sm">完成任務</div>
                <div className="text-xl font-bold text-white">{agent.tasks}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/60 text-sm">Token 使用</div>
                <div className="text-xl font-bold text-white">{formatNumber(agent.tokens)}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/60 text-sm">API 成本</div>
                <div className="text-xl font-bold text-emerald-400">${agent.cost.toFixed(2)}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/60 text-sm">節省金額</div>
                <div className="text-xl font-bold text-amber-400">{formatCurrency(agent.savings)}</div>
              </div>
            </div>
            <div className="mt-4 bg-white/5 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">工作效率</span>
                <span className="text-lg font-bold text-green-400">{agent.efficiency}</span>
              </div>
              <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                  style={{ width: agent.efficiency }}
                />
              </div>
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="p-6 max-h-60 overflow-y-auto">
            <h3 className="text-white font-semibold mb-3">最近任務</h3>
            {agentJobs.length > 0 ? (
              <div className="space-y-3">
                {agentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">
                          {job.title || job.name}
                        </div>
                        <div className="text-white/50 text-xs mt-1">
                          {formatDate(job.timestamp || job.lastRunAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            job.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : job.status === 'running'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {job.status === 'completed' ? '完成' : job.status === 'running' ? '執行中' : '失敗'}
                        </span>
                        <span className="text-emerald-400 text-xs">
                          ${job.cost.toFixed(3)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white/50 text-center py-4">
                暫無最近任務
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
