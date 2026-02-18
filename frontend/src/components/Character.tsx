import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Agent } from '../types';
import { SPEECH_BUBBLES, IDLE_ANIMATIONS, WORK_TOOLS } from './characterConfig';

interface CharacterProps {
  agent: Agent;
  position: { x: number; y: number; scale: number };
  onClick: () => void;
  recentTask?: string;
}

// 工作中的浮動工具動畫
function WorkingEffect({ agentId, isActive }: { agentId: string; isActive: boolean }) {
  const tool = WORK_TOOLS[agentId];
  
  if (!isActive || !tool) return null;
  
  return (
    <motion.div
      className="absolute -top-6 -right-2 pointer-events-none"
      initial={{ opacity: 0, scale: 0, rotate: -20 }}
      animate={{
        opacity: [0.9, 1, 0.9],
        scale: [0.8, 1, 0.8],
        rotate: [-10, 10, -10],
        y: [-2, 2, -2],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <span className="text-2xl drop-shadow-lg">{tool.icon}</span>
    </motion.div>
  );
}

// 打字效果粒子
function TypingParticles({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;
  
  return (
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-white/60 rounded-full"
          animate={{
            y: [0, -6, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function Character({ agent, position, onClick, recentTask }: CharacterProps) {
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [showWorkEffect, setShowWorkEffect] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const hideBubbleRef = useRef<number | null>(null);
  const workEffectRef = useRef<number | null>(null);

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
    if (workEffectRef.current) {
      clearTimeout(workEffectRef.current);
      workEffectRef.current = null;
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

  // 工作特效循環
  useEffect(() => {
    if (agent.status !== 'active') {
      setShowWorkEffect(false);
      return;
    }

    const cycleWorkEffect = () => {
      // 隨機顯示 3-8 秒
      const showDuration = Math.random() * 5000 + 3000;
      // 隨機隱藏 2-5 秒
      const hideDuration = Math.random() * 3000 + 2000;

      setShowWorkEffect(true);
      workEffectRef.current = window.setTimeout(() => {
        setShowWorkEffect(false);
        workEffectRef.current = window.setTimeout(cycleWorkEffect, hideDuration);
      }, showDuration);
    };

    // 初始延遲
    const initialDelay = Math.random() * 3000;
    workEffectRef.current = window.setTimeout(cycleWorkEffect, initialDelay);

    return () => {
      if (workEffectRef.current) {
        clearTimeout(workEffectRef.current);
      }
    };
  }, [agent.status]);

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
  const idleAnim = IDLE_ANIMATIONS[agent.id];

  // 組合動畫狀態
  const getAnimateState = () => {
    if (agent.status === 'active') {
      return {
        y: [0, -5, 0],
        ...(idleAnim?.keyframes || {}),
      };
    }
    if (isHovered) {
      return { y: [0, -3, 0] };
    }
    return {};
  };

  const getTransition = () => {
    if (agent.status === 'active') {
      return {
        y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        ...(idleAnim?.transition || {}),
      };
    }
    return { duration: 0.8, repeat: Infinity, ease: 'easeInOut' };
  };

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

      {/* Character Avatar Container */}
      <motion.div
        className={`relative ${agent.status === 'active' ? 'glow-active' : ''}`}
        animate={getAnimateState()}
        transition={getTransition()}
      >
        {/* Working Effect - Tool Icon */}
        <WorkingEffect agentId={agent.id} isActive={showWorkEffect} />

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

        {/* Typing Particles */}
        <TypingParticles isActive={showWorkEffect} />

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
