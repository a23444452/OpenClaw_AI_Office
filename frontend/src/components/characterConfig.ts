// Character configuration - speech bubbles, animations, and work tools

export const SPEECH_BUBBLES: Record<string, string[]> = {
  lucy: [
    '統籌中... ✨',
    '幫大家安排工作！',
    '今天效率很高呢！',
    '檢查各項任務...',
    '團隊合作最棒了！💪',
  ],
  xiaocai: [
    '分析股市數據中...',
    '今天盤勢不錯！',
    '追蹤法說會...',
    '計算報酬率...',
    '這檔股票有潛力！📈',
  ],
  yanyan: [
    '深度研究中... 🔬',
    '整理資料中...',
    '分析產業趨勢...',
    '撰寫研究報告...',
    '發現有趣的數據！',
  ],
  axin: [
    '追蹤新聞中... 📰',
    '整理 AI 新聞...',
    '撰寫日報...',
    '搜尋熱門話題...',
    '今日頭條出爐！',
  ],
  pangxie: [
    '管理社群中... 🦀',
    '回覆社群留言...',
    '發布新貼文...',
    '更新 Moltbook...',
    '互動率上升中！',
  ],
  xiaoguan: [
    '核對帳單中... 💰',
    '計算成本...',
    '整理帳務報表...',
    '追蹤預算...',
    '帳目清清楚楚～',
  ],
};

// 角色工作工具圖標
export const WORK_TOOLS: Record<string, { icon: string; label: string }> = {
  lucy: { icon: '📋', label: '任務清單' },
  xiaocai: { icon: '📊', label: '股票分析' },
  yanyan: { icon: '📚', label: '研究報告' },
  axin: { icon: '📰', label: '新聞追蹤' },
  pangxie: { icon: '💬', label: '社群管理' },
  xiaoguan: { icon: '🧮', label: '帳務計算' },
};

// 角色專屬閒置動畫 - 使用單獨的變換避免衝突
export const IDLE_ANIMATIONS: Record<string, {
  keyframes: Record<string, number[]>;
  transition: object;
}> = {
  lucy: {
    keyframes: { rotate: [-2, 2, -2] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  xiaocai: {
    keyframes: { x: [-3, 3, -3] },
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  },
  yanyan: {
    keyframes: { scale: [1, 1.03, 1] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  axin: {
    keyframes: { y: [-4, 0, -4] },
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
  pangxie: {
    keyframes: { rotate: [-5, 5, -5] },
    transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
  },
  xiaoguan: {
    keyframes: { y: [-2, 2, -2] },
    transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
  },
};

// 工作中動畫 - 打字效果
export const WORKING_ANIMATION = {
  scale: [1, 0.98, 1],
  transition: { duration: 0.3, repeat: Infinity, repeatDelay: 0.5 },
};
