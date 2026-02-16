import { useState, useEffect, useRef, useCallback } from 'react';
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

// 角色專屬閒置動畫
const IDLE_ANIMATIONS: Record<string, object> = {
  lucy: {
    rotate: [0, -3, 0, 3, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  xiaocai: {
    x: [0, 2, 0, -2, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  yanyan: {
    scale: [1, 1.02, 1],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  },
  axin: {
    y: [0, -3, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  pangxie: {
    rotate: [0, 5, 0, -5, 0],
    x: [0, 2, 0, -2, 0],
    transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
  },
  xiaoguan: {
    y: [0, -2, 0],
    rotate: [0, 2, 0, -2, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};

export function Character({ agent, position, onClick, recentTask }: CharacterProps) {
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const hideBubbleRef = useRef<number | null>(null);

  // 清理所有 timeouts
  const clearAllTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (hideBubbleRef.current) {
      clearTimeout(hideBubbleRef.current);
      hideBubbleRef.current = null;
    }
  }, []);

  const showRandomBubble = useCallback(() => {
    const bubbles = SPEECH_BUBBLES[agent.id] || ['工作中...'];
    const text = recentTask || bubbles[Math.floor(Math.random() * bubbles.length)];
    setBubbleText(text);
    setShowBubble(true);

    // 清除之前的隱藏 timeout
    if (hideBubbleRef.current) {
      clearTimeout(hideBubbleRef.current);
    }
    hideBubbleRef.current = window.setTimeout(() => setShowBubble(false), 4000);
  }, [agent.id, recentTask]);

  const scheduleNext = useCallback(() => {
    // 清除之前的 timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const delay = Math.random() * 10000 + 5000;
    timeoutRef.current = window.setTimeout(() => {
      showRandomBubble();
      scheduleNext();
    }, delay);
  }, [showRandomBubble]);

  useEffect(() => {
    if (agent.status !== 'active') {
      clearAllTimeouts();
      return;
    }

    // Initial delay
    const initialDelay = Math.random() * 8000;
    timeoutRef.current = window.setTimeout(() => {
      showRandomBubble();
      scheduleNext();
    }, initialDelay);

    return clearAllTimeouts;
  }, [agent.id, agent.status, showRandomBubble, scheduleNext, clearAllTimeouts]);

  const avatarSrc = `/avatars/chibi-${agent.id}.png`;
  const idleAnimation = IDLE_ANIMATIONS[agent.id] || {};

  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -100%)',
      }}
      initial={{ scale: position.scale, opacity: 0 }}
      animate={{ scale: position.scale, opacity: 1 }}
      whileHover={{ scale: position.scale * 1.1 }}
      whileTap={{ scale: position.scale * 0.95 }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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
            ? { y: [0, -5, 0], ...idleAnimation }
            : isHovered
            ? { y: [0, -3, 0] }
            : {}
        }
        transition={
          agent.status === 'active'
            ? {
                y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                ...((idleAnimation as any).transition || {}),
              }
            : { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <motion.img
          src={avatarSrc}
          alt={agent.name}
          className="w-20 h-20 object-contain drop-shadow-lg"
          whileHover={{ 
            filter: 'brightness(1.1)',
            transition: { duration: 0.2 }
          }}
          onError={(e) => {
            // Fallback to pixel version if chibi not found
            (e.target as HTMLImageElement).src = `/avatars/${agent.id}-pixel.png`;
          }}
        />

        {/* Status indicator with enhanced animation */}
        <motion.div
          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow ${
            agent.status === 'active'
              ? 'bg-green-500'
              : agent.status === 'busy'
              ? 'bg-yellow-500'
              : 'bg-gray-400'
          }`}
          animate={
            agent.status === 'active'
              ? { scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }
              : {}
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Active glow ring */}
        {agent.status === 'active' && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-yellow-400/30"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </motion.div>

      {/* Name tag - always visible on hover with smoother animation */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap backdrop-blur-sm"
          >
            <span className="font-medium">{agent.name}</span>
            {agent.status === 'active' && (
              <span className="ml-1 text-green-400">● 工作中</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
