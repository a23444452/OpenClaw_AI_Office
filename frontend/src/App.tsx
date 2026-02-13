import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, Office, StatsPanel, Charts, RecentActivity, ScheduledTasks, LearningTopics } from './components';
import { useDashboardData } from './hooks/useDashboardData';

type TabType = 'office' | 'charts' | 'tasks';

function App() {
  const { data, loading, error } = useDashboardData();
  const [activeTab, setActiveTab] = useState<TabType>('office');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4 animate-bounce">✨</div>
          <div className="text-white text-xl">Loading Lucy AI Office...</div>
        </motion.div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">😢</div>
          <div className="text-white text-xl">無法載入資料</div>
          <div className="text-white/50 text-sm mt-2">{error}</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto">
        <Header lastUpdate={data.lastUpdate} />

        {/* Stats Panel */}
        <StatsPanel data={data} />

        {/* Tab Navigation */}
        <div className="px-4 mt-4">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('office')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'office'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              🏢 辦公室
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'tasks'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              📋 任務與學習
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'charts'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              📊 數據圖表
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="wait">
            {activeTab === 'office' && (
              <motion.div
                key="office"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-2"
              >
                <Office agents={data.agents} recentJobs={data.recentJobs} />
                
                {/* Mobile: Recent Activity below office */}
                <div className="mt-4 lg:hidden">
                  <RecentActivity jobs={data.recentJobs} />
                </div>
              </motion.div>
            )}
            {activeTab === 'tasks' && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-2"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ScheduledTasks tasks={data.scheduledTasks} />
                  <LearningTopics topics={data.learningTopics} />
                </div>
                
                {/* Mobile: Recent Activity below tasks */}
                <div className="mt-4 lg:hidden">
                  <RecentActivity jobs={data.recentJobs} />
                </div>
              </motion.div>
            )}
            {activeTab === 'charts' && (
              <motion.div
                key="charts"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-2"
              >
                <Charts data={data} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sidebar - Recent Activity (Desktop only) */}
          <div className="hidden lg:block">
            <RecentActivity jobs={data.recentJobs} />
            
            {/* Metrics Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 bg-white/5 backdrop-blur-sm rounded-xl p-4"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span>📊</span> 效能指標
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">平均任務時間</span>
                  <span className="text-white font-medium">{data.metrics.avgTaskTime} 分</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">成功率</span>
                  <span className="text-green-400 font-medium">{data.metrics.successRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">每任務成本</span>
                  <span className="text-emerald-400 font-medium">${data.metrics.costPerTask}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">自動化程度</span>
                  <span className="text-purple-400 font-medium">{data.metrics.automationLevel}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">累計工時</span>
                  <span className="text-white font-medium">{data.metrics.totalHours} 小時</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-4 text-center text-white/40 text-sm">
          <p>Lucy AI Office Dashboard v2.0 • Made with ✨ by Lucy & Team</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
