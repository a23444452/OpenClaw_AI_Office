#!/usr/bin/env npx tsx
/**
 * 從 OpenClaw 收集數據並輸出為 JSON
 * 用法: npx tsx scripts/collect-data.ts
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// OpenClaw CLI 路徑
const OPENCLAW = 'openclaw';

// 任務到角色的映射
const taskToCharacter: Record<string, string> = {
  '記憶體股盯盤': 'xiaocai',
  '美股晨報': 'xiaocai',
  '台股盤後': 'xiaocai',
  '台股開盤': 'xiaocai',
  '台股收盤': 'xiaocai',
  '週末股市': 'xiaocai',
  '模擬投資': 'xiaocai',
  'AI 新聞': 'axin',
  'GitHub': 'axin',
  '夜間自主探索': 'yanyan',
  'Nightly Build': 'yanyan',
  'Moltbook': 'pangxie',
  '信用卡帳單': 'xiaoguan',
};

function getCharacterFromTask(taskName: string): string {
  for (const [keyword, charId] of Object.entries(taskToCharacter)) {
    if (taskName.includes(keyword)) {
      return charId;
    }
  }
  return 'lucy';
}

interface CharacterStats {
  id: string;
  tasks: number;
  completed: number;
  tokens: number;
  apiCost: number;
  workHours: number;
  savedAmount: number;
}

interface DashboardData {
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
  characterStats: CharacterStats[];
  recentJobs: Array<{
    id: string;
    name: string;
    status: string;
    lastRunAt: string;
    characterId: string;
  }>;
}

async function collectData(): Promise<DashboardData> {
  console.log('📊 Collecting data from OpenClaw...');
  
  // 初始化角色統計
  const characterStats: Record<string, CharacterStats> = {
    lucy: { id: 'lucy', tasks: 0, completed: 0, tokens: 0, apiCost: 0, workHours: 0, savedAmount: 0 },
    xiaocai: { id: 'xiaocai', tasks: 0, completed: 0, tokens: 0, apiCost: 0, workHours: 0, savedAmount: 0 },
    axin: { id: 'axin', tasks: 0, completed: 0, tokens: 0, apiCost: 0, workHours: 0, savedAmount: 0 },
    yanyan: { id: 'yanyan', tasks: 0, completed: 0, tokens: 0, apiCost: 0, workHours: 0, savedAmount: 0 },
    pangxie: { id: 'pangxie', tasks: 0, completed: 0, tokens: 0, apiCost: 0, workHours: 0, savedAmount: 0 },
    xiaoguan: { id: 'xiaoguan', tasks: 0, completed: 0, tokens: 0, apiCost: 0, workHours: 0, savedAmount: 0 },
  };
  
  const recentJobs: DashboardData['recentJobs'] = [];

  try {
    // 收集 cron jobs 統計
    const cronOutput = execSync(`${OPENCLAW} cron list --json 2>/dev/null || echo '{"jobs":[]}'`, {
      encoding: 'utf-8',
      timeout: 30000,
    });
    
    const cronData = JSON.parse(cronOutput);
    
    for (const job of cronData.jobs || []) {
      const charId = getCharacterFromTask(job.name);
      const isCompleted = job.state?.lastStatus === 'ok';
      
      characterStats[charId].tasks += 1;
      if (isCompleted) characterStats[charId].completed += 1;
      
      // 記錄最近的 jobs
      if (job.state?.lastRunAtMs) {
        recentJobs.push({
          id: job.id,
          name: job.name,
          status: job.state.lastStatus || 'unknown',
          lastRunAt: new Date(job.state.lastRunAtMs).toISOString(),
          characterId: charId,
        });
      }
    }

    // 收集 sessions 統計（從 usage 取得 token 和 cost）
    const sessionsOutput = execSync(`${OPENCLAW} sessions list --json --limit 50 2>/dev/null || echo '{"sessions":[]}'`, {
      encoding: 'utf-8',
      timeout: 30000,
    });
    
    const sessionsData = JSON.parse(sessionsOutput);
    
    for (const session of sessionsData.sessions || []) {
      const isCron = session.key?.includes(':cron:');
      const isMain = session.key === 'agent:main:main';
      
      // 從 session key 或內容判斷角色
      let charId = 'lucy';
      if (isCron) {
        // 嘗試從最近的 job 匹配
        const cronId = session.key.split(':cron:')[1];
        const matchedJob = recentJobs.find(j => j.id === cronId);
        if (matchedJob) {
          charId = matchedJob.characterId;
        }
      }
      
      // 累加 tokens（從 totalTokens 欄位）
      const tokens = session.totalTokens || 0;
      characterStats[charId].tokens += tokens;
      
      // 估算 API 成本（基於 Claude 定價）
      // Input: $15/MTok, Output: $75/MTok for Opus
      // 簡化估算: $0.05 per 1K tokens (混合)
      const estimatedCost = (tokens / 1000) * 0.05;
      characterStats[charId].apiCost += estimatedCost;
      
      // 主 session 額外加任務數
      if (isMain && tokens > 10000) {
        const extraTasks = Math.floor(tokens / 20000);
        characterStats['lucy'].tasks += extraTasks;
        characterStats['lucy'].completed += extraTasks;
      }
    }
  } catch (error) {
    console.error('Error collecting data:', error);
  }

  // 計算衍生數據
  let totalTasks = 0, totalCompleted = 0, totalTokens = 0, totalApiCost = 0;
  
  for (const stats of Object.values(characterStats)) {
    // 工時估算（tokens / 10000 ≈ 1 小時）
    stats.workHours = Math.round(stats.tokens / 10000 * 10) / 10;
    
    // 節省金額（人工成本 - API 成本）
    // 假設每個任務人工需 15 分鐘，時薪 NT$250
    const humanCost = stats.tasks * 250 * 0.25;
    const apiCostNTD = stats.apiCost * 32; // USD to NTD
    stats.savedAmount = Math.round(Math.max(0, humanCost - apiCostNTD));
    
    totalTasks += stats.tasks;
    totalCompleted += stats.completed;
    totalTokens += stats.tokens;
    totalApiCost += stats.apiCost;
  }

  const totalSaved = Object.values(characterStats).reduce((sum, s) => sum + s.savedAmount, 0);
  
  // 排序 recentJobs 按時間倒序
  recentJobs.sort((a, b) => new Date(b.lastRunAt).getTime() - new Date(a.lastRunAt).getTime());

  return {
    updatedAt: new Date().toISOString(),
    totalStats: {
      totalTasks,
      totalCompleted,
      totalTokens,
      totalApiCost: Math.round(totalApiCost * 100) / 100,
      totalSaved,
      equivalentFTE: Math.round((totalTasks / 400) * 10) / 10,
      avgDailyTasks: Math.round((totalTasks / 30) * 10) / 10,
    },
    characterStats: Object.values(characterStats),
    recentJobs: recentJobs.slice(0, 20), // 只保留最近 20 筆
  };
}

async function main() {
  const data = await collectData();
  
  // 輸出目錄
  const outputDir = join(__dirname, '../frontend/public/data');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  // 寫入 JSON
  const outputPath = join(outputDir, 'dashboard.json');
  writeFileSync(outputPath, JSON.stringify(data, null, 2));
  
  console.log(`✅ Data saved to ${outputPath}`);
  console.log(`📊 Total tasks: ${data.totalStats.totalTasks}`);
  console.log(`💰 Total saved: NT$${data.totalStats.totalSaved}`);
  console.log(`🎯 Total tokens: ${(data.totalStats.totalTokens / 1000).toFixed(0)}K`);
}

main().catch(console.error);
