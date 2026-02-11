import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { DashboardData } from '../types';

interface ChartsProps {
  data: DashboardData;
}

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

export function Charts({ data }: ChartsProps) {
  const dailyData = data.performance.daily.map((d) => ({
    ...d,
    date: d.date.slice(5), // Remove year prefix
  }));

  const agentContribution = data.agents.map((agent, index) => ({
    name: agent.name,
    tasks: agent.tasks,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="p-4 space-y-6">
      {/* Task Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-4"
      >
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>📈</span> 任務趨勢
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.5)" 
                fontSize={12}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)" 
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 30, 50, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                }}
              />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Cost & Savings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-4"
      >
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>💰</span> 成本與節省
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.5)" 
                fontSize={12}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)" 
                fontSize={12}
                tickFormatter={(value) => value >= 1000 ? `${value/1000}K` : value}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 30, 50, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                }}
                formatter={(value: number, name: string) => [
                  name === 'savings' ? `NT$${value.toLocaleString()}` : `$${value.toFixed(2)}`,
                  name === 'savings' ? '節省' : '成本'
                ]}
              />
              <Bar dataKey="savings" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Agent Contribution Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-4"
      >
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>👥</span> 各角色貢獻
        </h3>
        <div className="h-48 flex items-center">
          <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={agentContribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="tasks"
                >
                  {agentContribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 30, 50, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                  formatter={(value: number) => [`${value} 個任務`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-2">
            {agentContribution.map((agent) => (
              <div key={agent.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: agent.color }}
                />
                <span className="text-white/80 text-sm">{agent.name}</span>
                <span className="text-white/50 text-xs ml-auto">{agent.tasks}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
