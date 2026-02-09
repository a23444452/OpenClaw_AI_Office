import { useState, useEffect, useCallback } from 'react';
import { characters as staticCharacters, calculateTotalStats } from '../data/characters';
import type { Character, DashboardStats } from '../data/types';

interface ApiCharacterStats {
  id: string;
  tasks: number;
  completed: number;
  tokens: number;
  apiCost: number;
  workHours: number;
  savedAmount: number;
}

interface ApiDashboardData {
  updatedAt: string;
  totalStats: {
    totalTasks: number;
    totalCompleted: number;
    totalTokens: number;
    totalApiCost: number;
    totalSaved: number;
    equivalentFTE: number;
    avgDailyTasks: number;
  };
  characterStats: ApiCharacterStats[];
  recentJobs: Array<{
    id: string;
    name: string;
    status: string;
    lastRunAt: string;
    characterId: string;
  }>;
}

interface UseDashboardDataResult {
  characters: Character[];
  stats: DashboardStats;
  recentJobs: ApiDashboardData['recentJobs'];
  updatedAt: string | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDashboardData(): UseDashboardDataResult {
  const [apiData, setApiData] = useState<ApiDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 嘗試從 API 獲取數據
      const response = await fetch('/data/dashboard.json');
      
      if (!response.ok) {
        // 如果沒有 API 數據，使用靜態數據
        console.log('Using static data (API not available)');
        setApiData(null);
        return;
      }
      
      const data: ApiDashboardData = await response.json();
      setApiData(data);
    } catch (err) {
      console.log('API fetch failed, using static data:', err);
      setApiData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // 每 5 分鐘自動刷新
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // 合併 API 數據和靜態角色數據
  const characters: Character[] = staticCharacters.map(char => {
    const apiStats = apiData?.characterStats?.find(s => s.id === char.id);
    
    if (apiStats) {
      return {
        ...char,
        stats: {
          tasks: apiStats.tasks,
          completed: apiStats.completed,
          tokens: apiStats.tokens,
          apiCost: apiStats.apiCost,
          workHours: apiStats.workHours,
          savedAmount: apiStats.savedAmount,
        },
      };
    }
    
    return char;
  });

  // 計算總統計
  const stats: DashboardStats = apiData?.totalStats
    ? {
        totalTasks: apiData.totalStats.totalTasks,
        totalCompleted: apiData.totalStats.totalCompleted,
        totalTokens: apiData.totalStats.totalTokens,
        totalApiCost: apiData.totalStats.totalApiCost,
        totalSaved: apiData.totalStats.totalSaved,
        equivalentFTE: apiData.totalStats.equivalentFTE,
        avgDailyTasks: apiData.totalStats.avgDailyTasks,
      }
    : calculateTotalStats();

  return {
    characters,
    stats,
    recentJobs: apiData?.recentJobs || [],
    updatedAt: apiData?.updatedAt || null,
    isLoading,
    error,
    refresh: fetchData,
  };
}
