import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Agent } from '../types';

interface CharacterProps {
  agent: Agent;
  position: { x: number; y: number; scale: number };
  onClick: () => void;
  recentTask?: string;
}

const SPEECH_BUBBLES: Record<string, string[]> = {
  lucy: [
    '統籌中... ✨',
    '幫大家安排工作！',
    '今天效率很高呢！',
    '檢查各項任務...',
  ],
  xiaocai: [
    '分析股市數據中...',
    '今天盤勢不錯！',
    '追蹤法說會...',
    '計算報酬率...',
  ],
  yanyan: [
    '深度研究中... 🔬',
    '整理資料中...',
    '分析產業趨勢...',
    '撰寫研究報告...',
  ],
  axin: [
    '追蹤新聞中... 📰',
    '整理 AI 新聞...',
    '撰寫日報...',
    '搜尋熱門話題...',
  ],
  pangxie: [
    '管理社群中... 🦀',
    '回覆社群留言...',
    '發布新貼文...',
    '更新 Moltbook...',
  ],
  xiaoguan: [
    '核對帳單中... 💰',
    '計算成本...',
    '整理帳務報表...',
    '追蹤預算...',
  ],
};

export function Character({ agent, position, onClick, recentTask }: CharacterProps) {
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState('');

  useEffect(() => {
    if (agent.status !== 'active') return;

    const showRandomBubble = () => {
      const bubbles = SPEECH_BUBBLES[agent.id] || ['工作中...'];
      const text = recentTask || bubbles[Math.floor(Math.random() * bubbles.length)];
      setBubbleText(text);
      setShowBubble(true);

      setTimeout(() => setShowBubble(false), 4000);
    };

    // Show bubble randomly between 5-15 seconds
    const scheduleNext = () => {
      const delay = Math.random() * 10000 + 5000;
      return setTimeout(() => {
        showRandomBubble();
        scheduleNext();
      }, delay);
    };

    // Initial delay
    const initialDelay = Math.random() * 8000;
    const initialTimeout = setTimeout(() => {
      showRandomBubble();
      scheduleNext();
    }, initialDelay);

    return () => clearTimeout(initialTimeout);
  }, [agent.id, agent.status, recentTask]);

  const avatarSrc = `/avatars/chibi-${agent.id}.png`;

  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -100%)',
      }}
      initial={{ scale: position.scale }}
      whileHover={{ scale: position.scale * 1.1 }}
      whileTap={{ scale: position.scale * 0.95 }}
      onClick={onClick}
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20"
          >
            <div className="bg-white text-gray-800 px-3 py-2 rounded-xl shadow-lg text-sm whitespace-nowrap max-w-[200px] truncate">
              {bubbleText}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                <div className="border-8 border-transparent border-t-white" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Avatar */}
      <motion.div
        className={`relative ${agent.status === 'active' ? 'glow-active' : ''}`}
        animate={
          agent.status === 'active'
            ? { y: [0, -5, 0] }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <img
          src={avatarSrc}
          alt={agent.name}
          className="w-20 h-20 object-contain drop-shadow-lg"
          onError={(e) => {
            // Fallback to pixel version if chibi not found
            (e.target as HTMLImageElement).src = `/avatars/${agent.id}-pixel.png`;
          }}
        />

        {/* Status indicator */}
        <div
          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow ${
            agent.status === 'active'
              ? 'bg-green-500 animate-pulse'
              : agent.status === 'busy'
              ? 'bg-yellow-500'
              : 'bg-gray-400'
          }`}
        />
      </motion.div>

      {/* Name tag on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
      >
        {agent.name}
      </motion.div>
    </motion.div>
  );
}
