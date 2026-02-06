export interface Character {
  id: string;
  name: string;
  title: string;
  emoji: string;
  description: string;
  salary: number;
  personality: 'cheerful' | 'anxious' | 'curious' | 'studious' | 'vain' | 'caring';
  avatar: string;
  stats: CharacterStats;
  voices: VoiceTemplates;
}

export interface CharacterStats {
  tasks: number;
  completed: number;
  tokens: number;
  apiCost: number;
  workHours: number;
  savedAmount: number;
}

export interface VoiceTemplates {
  idle: string[];
  working: string[];
  happy: string[];
  tired: string[];
  stressed?: string[];
}

export interface DashboardStats {
  totalTasks: number;
  totalCompleted: number;
  totalTokens: number;
  totalApiCost: number;
  totalSaved: number;
  equivalentFTE: number;
  avgDailyTasks: number;
}

export type TabType = 'savings' | 'stats' | 'voices';
