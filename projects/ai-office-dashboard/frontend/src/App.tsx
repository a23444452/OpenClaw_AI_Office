import { useState } from 'react';
import type { TabType } from './data/types';
import { useDashboardData } from './hooks/useDashboardData';
import { StatCard } from './components/stats/StatCard';
import { CharacterCard } from './components/characters/CharacterCard';
import { Leaderboard } from './components/dashboard/Leaderboard';
import { TabNav } from './components/dashboard/TabNav';
import { RecentJobs } from './components/dashboard/RecentJobs';
import { OfficeScene } from './components/office/OfficeScene';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('savings');
  const { characters, stats, recentJobs, updatedAt, isLoading, refresh } = useDashboardData();

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white p-3 sm:p-4 md:p-6">
      {/* Header */}
      <header className="mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold flex items-center gap-2 sm:gap-3 mb-1">
              <span className="text-xl sm:text-3xl md:text-4xl">🏢</span>
              <span className="bg-gradient-to-r from-[#00d9ff] to-[#e94560] bg-clip-text text-transparent">
                Lucy AI 辦公室
              </span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm md:text-base">
              即時監控你的 AI 團隊工作狀態和成本效益
            </p>
          </div>
          
          {/* 更新時間和刷新按鈕 */}
          <div className="flex items-center gap-2">
            {updatedAt && (
              <span className="text-[10px] sm:text-xs text-gray-500">
                <span className="hidden sm:inline">更新於 </span>
                {new Date(updatedAt).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={refresh}
              disabled={isLoading}
              className="px-2 py-1 sm:px-3 sm:py-1.5 bg-[#16213e] border border-[#0f3460] rounded-lg text-xs sm:text-sm hover:border-[#00d9ff] transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              <span>{isLoading ? '⏳' : '🔄'}</span>
              <span className="hidden sm:inline">{isLoading ? '更新中' : '刷新'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Office Scene */}
      <div className="mb-4 sm:mb-6">
        <OfficeScene characters={characters} recentJobs={recentJobs} />
      </div>

      {/* Tab Navigation */}
      <div className="mb-3 sm:mb-4 md:mb-6 -mx-3 px-3 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide">
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main Content */}
      <main>
        {/* 成本節省 Tab */}
        {activeTab === 'savings' && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* 統計卡片 */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              <StatCard
                value={stats.totalSaved}
                label="總節省金額"
                icon="💰"
                color="green"
                prefix="NT$"
              />
              <StatCard
                value={stats.equivalentFTE}
                label="等同全職員工"
                icon="👥"
                color="cyan"
                suffix=" 人"
              />
              <StatCard
                value={stats.totalTasks}
                label="本月任務"
                icon="📋"
                color="orange"
              />
              <StatCard
                value={stats.avgDailyTasks}
                label="平均每日任務"
                icon="📊"
                color="cyan"
              />
            </div>

            {/* 排行榜和最近任務 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <Leaderboard characters={characters} sortBy="savedAmount" />
              <RecentJobs jobs={recentJobs} />
            </div>
          </div>
        )}

        {/* 互動統計 Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* 統計卡片 */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              <StatCard
                value={stats.totalCompleted}
                label="已完成任務"
                icon="✅"
                color="green"
              />
              <StatCard
                value={(stats.totalTokens / 1000).toFixed(0)}
                label="Token 使用量"
                icon="🎯"
                color="cyan"
                suffix="K"
              />
              <StatCard
                value={stats.totalApiCost.toFixed(2)}
                label="API 花費"
                icon="💳"
                color="orange"
                prefix="$"
              />
              <StatCard
                value={stats.totalTasks > 0 
                  ? Math.round((stats.totalCompleted / stats.totalTasks) * 100) 
                  : 0}
                label="完成率"
                icon="📈"
                color="green"
                suffix="%"
              />
            </div>

            {/* Token 使用明細 */}
            <div className="bg-[#16213e] rounded-xl border border-[#0f3460] p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                🎯 各員工 Token 使用量
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {[...characters]
                  .sort((a, b) => b.stats.tokens - a.stats.tokens)
                  .map((char) => (
                    <div key={char.id} className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={char.avatar}
                        alt={char.name}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded object-cover flex-shrink-0"
                        style={{ imageRendering: 'pixelated' }}
                      />
                      <span className="w-10 sm:w-16 font-medium text-sm sm:text-base truncate">{char.name}</span>
                      <div className="flex-1 bg-[#1a1a2e] rounded-full h-3 sm:h-4 overflow-hidden min-w-0">
                        <div
                          className="h-full bg-gradient-to-r from-[#00d9ff] to-[#e94560] rounded-full transition-all"
                          style={{
                            width: `${stats.totalTokens > 0 
                              ? (char.stats.tokens / stats.totalTokens) * 100 
                              : 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-[#00d9ff] font-mono text-xs sm:text-sm w-12 sm:w-16 text-right flex-shrink-0">
                        {(char.stats.tokens / 1000).toFixed(0)}K
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* 員工心聲 Tab */}
        {activeTab === 'voices' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {characters.map((char) => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 sm:mt-10 md:mt-12 text-center text-gray-500 text-xs sm:text-sm">
        <p>✨ Powered by Lucy & OpenClaw • 2026</p>
      </footer>
    </div>
  );
}

export default App;
