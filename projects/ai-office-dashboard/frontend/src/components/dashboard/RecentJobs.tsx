import React from 'react';
import { characters } from '../../data/characters';

interface RecentJob {
  id: string;
  name?: string;
  title?: string;  // JSON 使用 title
  status: string;
  lastRunAt?: string;
  timestamp?: string;  // JSON 使用 timestamp
  characterId: string;
}

interface RecentJobsProps {
  jobs: RecentJob[];
}

const statusStyles: Record<string, { bg: string; text: string; icon: string }> = {
  ok: { bg: 'bg-green-500/20', text: 'text-green-400', icon: '✅' },
  completed: { bg: 'bg-green-500/20', text: 'text-green-400', icon: '✅' },  // 別名
  error: { bg: 'bg-red-500/20', text: 'text-red-400', icon: '❌' },
  failed: { bg: 'bg-red-500/20', text: 'text-red-400', icon: '❌' },  // 別名
  running: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: '🔄' },
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: '⏳' },  // 新增
  unknown: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: '❓' },
};

function formatTimeAgo(dateString: string | undefined): string {
  if (!dateString) return '未知';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '未知';
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '剛剛';
  if (diffMins < 60) return `${diffMins}分鐘前`;
  if (diffHours < 24) return `${diffHours}小時前`;
  return `${diffDays}天前`;
}

export const RecentJobs: React.FC<RecentJobsProps> = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-[#16213e] rounded-xl border border-[#0f3460] p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
          📋 最近任務
        </h3>
        <p className="text-gray-500 text-center py-6 sm:py-8 text-sm">暫無任務記錄</p>
      </div>
    );
  }

  return (
    <div className="bg-[#16213e] rounded-xl border border-[#0f3460] overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-[#0f3460]">
        <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
          📋 最近任務
        </h3>
      </div>

      <div className="divide-y divide-[#0f3460] max-h-[400px] sm:max-h-[500px] overflow-y-auto">
        {jobs.slice(0, 10).map((job) => {
          const character = characters.find((c) => c.id === job.characterId);
          const style = statusStyles[job.status] || statusStyles.unknown;

          return (
            <div
              key={job.id}
              className="p-2.5 sm:p-3 md:p-4 hover:bg-[#1a1a2e] transition-colors flex items-center gap-2 sm:gap-3"
            >
              {/* 角色頭像 */}
              <div className="relative flex-shrink-0">
                {character ? (
                  <img
                    src={character.avatar}
                    alt={character.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover border border-[#0f3460]"
                    style={{ imageRendering: 'pixelated' }}
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#0f3460] flex items-center justify-center text-sm sm:text-base">
                    🤖
                  </div>
                )}
              </div>

              {/* 任務資訊 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="font-medium text-white text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                    {job.name || job.title}
                  </span>
                  <span
                    className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap ${style.bg} ${style.text}`}
                  >
                    {style.icon}
                    <span className="hidden sm:inline ml-1">
                      {(job.status === 'ok' || job.status === 'completed') ? '完成' : 
                       (job.status === 'error' || job.status === 'failed') ? '失敗' : 
                       job.status === 'running' ? '執行中' :
                       job.status === 'pending' ? '等待中' : job.status}
                    </span>
                  </span>
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1.5 sm:gap-2 mt-0.5">
                  <span>{character?.name || '系統'}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(job.lastRunAt || job.timestamp)}</span>
                </div>
              </div>

              {/* 角色 emoji */}
              <div className="text-lg sm:text-2xl flex-shrink-0">
                {character?.emoji || '🤖'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
