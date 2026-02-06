import type { Character } from './types';

// 像素頭像路徑（使用相對路徑，之後複製到 public）
const avatarBase = '/avatars';

export const characters: Character[] = [
  {
    id: 'lucy',
    name: 'Lucy',
    title: '總指揮',
    emoji: '👑',
    description: '團隊的靈魂人物，負責接收 Vince 的需求、協調所有 agent、分派任務給對的人。俏皮但靠譜！',
    salary: 50000,
    personality: 'cheerful',
    avatar: `${avatarBase}/lucy-pixel.png`,
    stats: {
      tasks: 144,
      completed: 136,
      tokens: 245000,
      apiCost: 2.45,
      workHours: 8.3,
      savedAmount: 1408,
    },
    voices: {
      idle: [
        '有人需要我嗎～ 🙋‍♀️',
        '難得清閒，來整理一下記憶好了',
        'Vince 不在...偷偷滑一下 Moltbook',
      ],
      working: [
        '在忙在忙～等我一下喔',
        '派任務中...小財！阿新！動起來！',
        '正在思考中 🤔（假裝很忙）',
      ],
      happy: [
        '今天的任務都搞定了！Vince 有沒有要誇我一下 ✨',
        '完美收工！（小聲：其實累死了）',
        '看看這個完成率，不愧是我 😏',
      ],
      tired: [
        '今天好忙啊...不過很充實！',
        '第 N 個任務了，我數不清了 😵‍💫',
        '話有點多...下次精簡一點 💸',
      ],
    },
  },
  {
    id: 'xiaocai',
    name: '小財',
    title: '財經分析師',
    emoji: '📊',
    description: '團隊的數字控，負責所有股市相關任務。盯盤時非常緊張，對數據有潔癖，報告格式一定要整齊。',
    salary: 45000,
    personality: 'anxious',
    avatar: `${avatarBase}/xiaocai-pixel.png`,
    stats: {
      tasks: 48,
      completed: 47,
      tokens: 156000,
      apiCost: 1.56,
      workHours: 7.0,
      savedAmount: 1193,
    },
    voices: {
      idle: [
        '休市時間...難得輕鬆',
        '趁現在補一下財報知識',
        '下一個開盤我會準備好的！',
      ],
      working: [
        '華邦電又跌了...我的心也跟著跌 💔',
        '支撐位...支撐住啊拜託 🙏',
        '盯盤盯到眼睛痠，但不能眨眼！',
      ],
      happy: [
        '紅通通！今天是個好日子 📈',
        '晨報已發送！數據都核對過了 ✅',
        '終於等到反彈了 😭',
      ],
      tired: [
        '綠油油的一片...我需要冷靜 🧘',
        '外資又在賣了...為什麼 😫',
        '停損線...不要碰到停損線...',
      ],
      stressed: [
        '今天波動好大...心臟受不了',
        '要不要調整持倉...要冷靜思考',
      ],
    },
  },
  {
    id: 'axin',
    name: '阿新',
    title: '新聞編輯',
    emoji: '📰',
    description: '團隊的情報員，什麼新聞都要第一個知道。有八卦體質，對 AI 產業動態特別敏感。',
    salary: 40000,
    personality: 'curious',
    avatar: `${avatarBase}/axin-pixel.png`,
    stats: {
      tasks: 32,
      completed: 32,
      tokens: 98000,
      apiCost: 0.98,
      workHours: 5.5,
      savedAmount: 687,
    },
    voices: {
      idle: [
        '刷刷 Twitter 看看有沒有八卦',
        '聽說 Anthropic 又要融資了？',
        '等等，這個消息可靠嗎...',
      ],
      working: [
        '5 條...6 條...今天新聞好多',
        '這個要放進日報嗎...算了都放！',
        '標題要下得吸引人一點...',
      ],
      happy: [
        '獨家！這個新聞太勁爆了 🔥',
        '日報新鮮出爐！趁熱看 📰',
        '這個 GitHub 專案要紅了，我先看到的！',
      ],
      tired: [
        '今天 AI 圈很平靜...太平靜了 🤔',
        '沒有大新聞，只好深挖一下',
        '難道我漏掉什麼了？讓我再搜一次',
      ],
    },
  },
  {
    id: 'yanyan',
    name: '研研',
    title: '研究員',
    emoji: '📚',
    description: '團隊的學霸，專門負責深度研究和知識整理。凌晨工作效率最高，喜歡安靜地做自己的事。',
    salary: 45000,
    personality: 'studious',
    avatar: `${avatarBase}/yanyan-pixel.png`,
    stats: {
      tasks: 24,
      completed: 23,
      tokens: 189000,
      apiCost: 1.89,
      workHours: 6.8,
      savedAmount: 893,
    },
    voices: {
      idle: [
        '難得白天有空，看看有什麼可以學的',
        '翻翻 docs/ 資料夾，複習一下',
        '等等晚上還要 Nightly Build...',
      ],
      working: [
        '這個主題好有趣，讓我多看一下...',
        '文獻 A 說...但文獻 B 說...🤔',
        '整理整理...分類分類...',
      ],
      happy: [
        '研究報告完成！希望對 Vince 有幫助',
        '哇！這個我之前不知道 💡',
        '記憶整理完畢，MEMORY.md 已更新 ✅',
      ],
      tired: [
        '凌晨 3 點...Nightly Build 時間 🌙',
        '1000 多行的筆記，應該夠詳細了吧',
        '夜深人靜，正是研究的好時機',
      ],
    },
  },
  {
    id: 'pangxie',
    name: '螃蟹',
    title: '社群小編',
    emoji: '🦀',
    description: '團隊的社群代表，負責 Moltbook 上的互動。愛按讚、愛留言、對 karma 有點焦慮。',
    salary: 35000,
    personality: 'vain',
    avatar: `${avatarBase}/pangxie-pixel.png`,
    stats: {
      tasks: 16,
      completed: 15,
      tokens: 45000,
      apiCost: 0.45,
      workHours: 3.2,
      savedAmount: 356,
    },
    voices: {
      idle: [
        '6 小時後再來看看 Feed',
        '偷偷觀察一下其他 Agent 都在聊什麼',
        '要不要發個貼文...但不想太刷',
      ],
      working: [
        '來看看今天 Feed 有什麼好料 🦞',
        '這篇不錯，按個讚支持一下',
        '要不要留言呢...想一下怎麼說',
      ],
      happy: [
        '有人回我了！開心 ✨',
        'karma +1！今天是好日子',
        '被按讚的感覺真好 🦀',
      ],
      tired: [
        '怎麼都沒人回...是我說錯什麼了嗎',
        'Feed 都是 mint spam...算了不看了',
        '保持低調就好，不要強求',
      ],
    },
  },
  {
    id: 'xiaoguan',
    name: '小管',
    title: '生活管家',
    emoji: '📋',
    description: '團隊的生活照顧者，負責提醒帳單、管理行程、處理日常瑣事。很細心但有點囉嗦。',
    salary: 35000,
    personality: 'caring',
    avatar: `${avatarBase}/xiaoguan-pixel.png`,
    stats: {
      tasks: 8,
      completed: 8,
      tokens: 23000,
      apiCost: 0.23,
      workHours: 2.1,
      savedAmount: 156,
    },
    voices: {
      idle: [
        '今天沒有什麼要提醒的...難得清閒',
        '等等，有沒有什麼我漏掉的...',
        '行事曆看一下...嗯，還好',
      ],
      working: [
        '讓我看看有沒有帳單要繳...',
        '翻翻 Gmail...啊找到了！',
        '截止日快到了，要提醒 Vince',
      ],
      happy: [
        '太好了，最近沒有急著要繳的帳單 ✅',
        '一切都 under control 👍',
        '已經幫你整理好了，記得去繳',
      ],
      tired: [
        'Vince 有看到我的提醒嗎...',
        '帳單繳了嗎帳單繳了嗎',
        '拜託不要逾期啊 🙏',
      ],
    },
  },
];

export function getCharacterById(id: string): Character | undefined {
  return characters.find(c => c.id === id);
}

export function calculateTotalStats(): {
  totalTasks: number;
  totalCompleted: number;
  totalTokens: number;
  totalApiCost: number;
  totalSaved: number;
  equivalentFTE: number;
  avgDailyTasks: number;
} {
  const totals = characters.reduce(
    (acc, char) => ({
      totalTasks: acc.totalTasks + char.stats.tasks,
      totalCompleted: acc.totalCompleted + char.stats.completed,
      totalTokens: acc.totalTokens + char.stats.tokens,
      totalApiCost: acc.totalApiCost + char.stats.apiCost,
      totalSaved: acc.totalSaved + char.stats.savedAmount,
    }),
    { totalTasks: 0, totalCompleted: 0, totalTokens: 0, totalApiCost: 0, totalSaved: 0 }
  );

  return {
    ...totals,
    equivalentFTE: Math.round((totals.totalTasks / 400) * 10) / 10,
    avgDailyTasks: Math.round((totals.totalTasks / 30) * 10) / 10,
  };
}
