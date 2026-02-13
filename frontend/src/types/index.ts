export interface Agent {
  id: string;
  name: string;
  avatar: string;
  description: string;
  tasks: number;
  tokens: number;
  cost: number;
  savings: number;
  efficiency: string;
  status: 'active' | 'standby' | 'busy';
}

export interface RecentJob {
  id: string;
  name: string;
  title: string;
  agent: string;
  timestamp: number;
  lastRunAt: number;
  status: 'running' | 'completed' | 'failed';
  cost: number;
}

export interface DailyPerformance {
  date: string;
  tasks: number;
  cost: number;
  savings: number;
}

export interface Metrics {
  avgTaskTime: number;
  successRate: number;
  costPerTask: number;
  totalHours: number;
  automationLevel: number;
}

export interface DashboardData {
  lastUpdate: string;
  totalTasks: number;
  totalTokens: number;
  totalCost: number;
  totalSavings: number;
  agents: Agent[];
  recentJobs: RecentJob[];
  scheduledTasks: ScheduledTask[];
  learningTopics: LearningTopic[];
  metrics: Metrics;
  performance: {
    daily: DailyPerformance[];
  };
}

export interface CharacterPosition {
  id: string;
  x: number;
  y: number;
  scale: number;
}

export interface ScheduledTask {
  id: string;
  name: string;
  schedule: string;
  nextRunAt: number;
  agent: string;
  enabled: boolean;
  lastStatus?: 'ok' | 'error';
}

export interface LearningTopic {
  id: string;
  title: string;
  category: 'semiconductor' | 'investment' | 'productivity' | 'ai';
  completed: boolean;
  completedAt?: string;
  docPath?: string;
}
