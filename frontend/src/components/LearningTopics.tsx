import { motion } from 'framer-motion';
import type { LearningTopic } from '../types';

interface LearningTopicsProps {
  topics: LearningTopic[];
}

function getCategoryInfo(category: string): { emoji: string; color: string; label: string } {
  const categoryMap: Record<string, { emoji: string; color: string; label: string }> = {
    semiconductor: { emoji: '🔬', color: 'text-blue-400', label: '半導體' },
    investment: { emoji: '📈', color: 'text-green-400', label: '投資' },
    productivity: { emoji: '⚡', color: 'text-yellow-400', label: '效率' },
    ai: { emoji: '🤖', color: 'text-purple-400', label: 'AI' },
  };
  return categoryMap[category] || { emoji: '📚', color: 'text-white', label: '其他' };
}

export function LearningTopics({ topics }: LearningTopicsProps) {
  const completed = topics.filter(t => t.completed);
  const pending = topics.filter(t => !t.completed);
  const completionRate = topics.length > 0 ? Math.round((completed.length / topics.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-4"
    >
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <span>🧠</span> 自我學習進度
      </h3>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-white/60">學習進度</span>
          <span className="text-white">{completed.length}/{topics.length} 完成</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
          />
        </div>
      </div>

      {/* Pending Topics */}
      {pending.length > 0 && (
        <div className="mb-4">
          <h4 className="text-white/70 text-xs font-medium mb-2 flex items-center gap-1">
            <span>📌</span> 待探索 ({pending.length})
          </h4>
          <div className="space-y-1.5">
            {pending.slice(0, 5).map((topic, index) => {
              const cat = getCategoryInfo(topic.category);
              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
                >
                  <span className="text-sm">{cat.emoji}</span>
                  <span className="text-white text-sm flex-1 truncate">{topic.title}</span>
                  <span className={`text-xs ${cat.color}`}>{cat.label}</span>
                </motion.div>
              );
            })}
          </div>
          {pending.length > 5 && (
            <div className="mt-2 text-center text-white/40 text-xs">
              還有 {pending.length - 5} 個待探索主題
            </div>
          )}
        </div>
      )}

      {/* Completed Topics */}
      {completed.length > 0 && (
        <div>
          <h4 className="text-white/70 text-xs font-medium mb-2 flex items-center gap-1">
            <span>✅</span> 已完成 ({completed.length})
          </h4>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {completed.slice(0, 6).map((topic, index) => {
              const cat = getCategoryInfo(topic.category);
              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                >
                  <span className="text-sm">{cat.emoji}</span>
                  <span className="text-white/80 text-sm flex-1 truncate">{topic.title}</span>
                  {topic.completedAt && (
                    <span className="text-xs text-white/40">{topic.completedAt.slice(5, 10)}</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
