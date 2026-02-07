// OpenClaw API 資料收集與轉換
// 這個檔案定義了如何從 OpenClaw 取得數據並轉換為儀表板格式

export interface OpenClawSession {
  key: string;
  kind: string;
  channel: string;
  updatedAt: number;
  sessionId: string;
  model: string;
  totalTokens: number;
  messages: Array<{
    role: string;
    content: Array<{
      type: string;
      text?: string;
    }>;
    usage?: {
      input: number;
      output: number;
      cacheRead: number;
      cacheWrite: number;
      totalTokens: number;
      cost: {
        input: number;
        output: number;
        cacheRead: number;
        cacheWrite: number;
        total: number;
      };
    };
    timestamp?: number;
  }>;
}

export interface CronJob {
  id: string;
  name: string;
  enabled: boolean;
  schedule: {
    kind: string;
    expr?: string;
    everyMs?: number;
    tz?: string;
  };
  payload: {
    kind: string;
    message: string;
    deliver: boolean;
    channel?: string;
    model?: string;
  };
  state: {
    nextRunAtMs?: number;
    lastRunAtMs?: number;
    lastStatus?: string;
    lastDurationMs?: number;
    lastError?: string;
  };
}

// 任務到角色的映射
export const taskToCharacter: Record<string, string> = {
  // 小財的任務
  '記憶體股盯盤提醒': 'xiaocai',
  '每日美股晨報': 'xiaocai',
  '每日台股盤後摘要': 'xiaocai',
  '台股開盤報告': 'xiaocai',
  '台股收盤報告': 'xiaocai',
  '週末股市回顧': 'xiaocai',
  '美股模擬投資每日追蹤': 'xiaocai',
  
  // 阿新的任務
  'AI 新聞日報': 'axin',
  'GitHub 熱門專案日報': 'axin',
  
  // 研研的任務
  '夜間自主探索': 'yanyan',
  'Nightly Build': 'yanyan',
  
  // 螃蟹的任務
  'Moltbook': 'pangxie',
  
  // 小管的任務
  '信用卡帳單提醒': 'xiaoguan',
};

// 根據任務名稱找出角色 ID
export function getCharacterFromTask(taskName: string): string {
  for (const [keyword, charId] of Object.entries(taskToCharacter)) {
    if (taskName.includes(keyword)) {
      return charId;
    }
  }
  // 預設歸給 Lucy
  return 'lucy';
}

// 從 cron session 計算統計
export function calculateStatsFromSessions(sessions: OpenClawSession[]): {
  characterStats: Record<string, {
    tasks: number;
    completed: number;
    tokens: number;
    apiCost: number;
    workHours: number;
  }>;
  totalStats: {
    totalTasks: number;
    totalCompleted: number;
    totalTokens: number;
    totalApiCost: number;
  };
} {
  const characterStats: Record<string, {
    tasks: number;
    completed: number;
    tokens: number;
    apiCost: number;
    workHours: number;
  }> = {
    lucy: { tasks: 0, completed: 0, tokens: 0, apiCost: 0, workHours: 0 },
    xiaocai: { tasks: 0, completed: 0, tokens: 0, apiCost: 0, workHours: 0 },
    axin: { tasks: 0, completed: 0, tokens: 0, apiCost: 0, workHours: 0 },
    yanyan: { tasks: 0, completed: 0, tokens: 0, apiCost: 0, workHours: 0 },
    pangxie: { tasks: 0, completed: 0, tokens: 0, apiCost: 0, workHours: 0 },
    xiaoguan: { tasks: 0, completed: 0, tokens: 0, apiCost: 0, workHours: 0 },
  };

  let totalStats = {
    totalTasks: 0,
    totalCompleted: 0,
    totalTokens: 0,
    totalApiCost: 0,
  };

  for (const session of sessions) {
    // 從 session key 判斷是否為 cron job
    const isCron = session.key.includes(':cron:');
    const isMain = session.key === 'agent:main:main';
    
    // 找出對應的角色
    let charId = 'lucy';
    if (isCron) {
      // 從 session 的 message 內容判斷任務類型
      const lastMessage = session.messages?.[session.messages.length - 1];
      const content = lastMessage?.content?.find(c => c.type === 'text')?.text || '';
      charId = getCharacterFromTask(content);
    }

    // 計算 tokens 和 cost
    for (const msg of session.messages || []) {
      if (msg.usage) {
        characterStats[charId].tokens += msg.usage.totalTokens;
        characterStats[charId].apiCost += msg.usage.cost?.total || 0;
        totalStats.totalTokens += msg.usage.totalTokens;
        totalStats.totalApiCost += msg.usage.cost?.total || 0;
      }
    }

    // 計算任務數
    if (isCron) {
      characterStats[charId].tasks += 1;
      characterStats[charId].completed += session.messages?.length > 0 ? 1 : 0;
      totalStats.totalTasks += 1;
      totalStats.totalCompleted += session.messages?.length > 0 ? 1 : 0;
    }

    // 主 session 歸給 Lucy
    if (isMain) {
      characterStats['lucy'].tasks += Math.floor(session.totalTokens / 5000); // 估算任務數
      characterStats['lucy'].completed += Math.floor(session.totalTokens / 5000);
    }
  }

  // 估算工時（tokens / 10000 ≈ 1 小時）
  for (const charId of Object.keys(characterStats)) {
    characterStats[charId].workHours = Math.round(characterStats[charId].tokens / 10000 * 10) / 10;
  }

  return { characterStats, totalStats };
}

// 計算節省金額（人工 vs API 成本）
export function calculateSavings(tasks: number, apiCostUSD: number): number {
  // 假設：人工處理一個任務平均 15 分鐘，時薪 NT$250
  const humanCostPerTask = 250 * 0.25; // NT$62.5
  const humanCost = tasks * humanCostPerTask;
  
  // API 成本轉換（USD -> NTD，假設 1:32）
  const apiCostNTD = apiCostUSD * 32;
  
  return Math.round(humanCost - apiCostNTD);
}

// 計算等同全職員工數
export function calculateFTE(tasks: number): number {
  // 假設全職員工月處理 400 個任務
  return Math.round((tasks / 400) * 10) / 10;
}
