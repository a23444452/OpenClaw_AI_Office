import { useState, useEffect } from 'react';
import type { DashboardData, Agent, RecentJob, ScheduledTask, LearningTopic } from '../types';

interface RawEmployee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  tasks: number;
  tokensUsed: number;
  cost: number;
  saved: number;
  efficiency: number;
  status: string;
  recentTasks?: string[];
  heartbeat?: string;
}

interface RawJob {
  id: string;
  name: string;
  title: string;
  agent: string;
  timestamp: number;
  lastRunAt: number;
  status: string;
  cost: number;
}

interface RawScheduledTask {
  id: string;
  name: string;
  schedule: string;
  nextRunAt: number;
  agent: string;
  enabled: boolean;
  lastStatus?: 'ok' | 'error';
}

interface RawLearningTopic {
  id: string;
  title: string;
  category: 'semiconductor' | 'investment' | 'productivity' | 'ai';
  completed: boolean;
  completedAt?: string;
  docPath?: string;
}

interface RawDashboardData {
  updatedAt: string;
  stats: {
    totalTokens: number;
    totalCost: number;
    totalSaved: number;
    totalTasks: number;
    activeSessions: number;
  };
  employees: RawEmployee[];
  recentJobs: RawJob[];
  scheduledTasks?: RawScheduledTask[];
  learningTopics?: RawLearningTopic[];
  metrics: {
    avgTaskTime: number;
    successRate: number;
    costPerTask: number;
    totalHours: number;
    automationLevel: number;
  };
  performance: {
    daily: Array<{
      date: string;
      tasks: number;
      cost: number;
      savings: number;
    }>;
  };
}

function transformData(raw: RawDashboardData): DashboardData {
  const agents: Agent[] = raw.employees.map((emp) => ({
    id: emp.id,
    name: emp.name,
    avatar: emp.avatar,
    description: emp.role,
    tasks: emp.tasks,
    tokens: emp.tokensUsed,
    cost: emp.cost,
    savings: emp.saved,
    efficiency: `${emp.efficiency}%`,
    status: emp.status as 'active' | 'standby' | 'busy',
  }));

  const recentJobs: RecentJob[] = raw.recentJobs.map((job) => ({
    id: job.id,
    name: job.name,
    title: job.title,
    agent: job.agent,
    timestamp: job.timestamp,
    lastRunAt: job.lastRunAt,
    status: job.status as 'running' | 'completed' | 'failed',
    cost: job.cost,
  }));

  const scheduledTasks: ScheduledTask[] = (raw.scheduledTasks || []).map((task) => ({
    id: task.id,
    name: task.name,
    schedule: task.schedule,
    nextRunAt: task.nextRunAt,
    agent: task.agent,
    enabled: task.enabled,
    lastStatus: task.lastStatus,
  }));

  const learningTopics: LearningTopic[] = (raw.learningTopics || []).map((topic) => ({
    id: topic.id,
    title: topic.title,
    category: topic.category,
    completed: topic.completed,
    completedAt: topic.completedAt,
    docPath: topic.docPath,
  }));

  return {
    lastUpdate: raw.updatedAt,
    totalTasks: raw.stats.totalTasks,
    totalTokens: raw.stats.totalTokens,
    totalCost: raw.stats.totalCost,
    totalSavings: raw.stats.totalSaved,
    agents,
    recentJobs,
    scheduledTasks,
    learningTopics,
    metrics: raw.metrics,
    performance: raw.performance,
  };
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/dashboard.json');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const json: RawDashboardData = await response.json();
        const transformed = transformData(json);
        setData(transformed);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
}
