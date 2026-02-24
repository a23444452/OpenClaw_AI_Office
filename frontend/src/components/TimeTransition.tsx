import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TimeOfDay } from '../hooks/useTimeOfDay';

interface TimeTransitionProps {
  timeOfDay: TimeOfDay;
  onTransitionComplete?: () => void;
}

// 時段配置
const TIME_CONFIG: Record<TimeOfDay, {
  celestialEmoji: string;
  celestialPosition: { x: number; y: number };
  glowColor: string;
  greeting: string;
}> = {
  morning: {
    celestialEmoji: '🌅',
    celestialPosition: { x: 15, y: 35 },
    glowColor: 'rgba(255, 180, 100, 0.4)',
    greeting: '早安！新的一天開始了～',
  },
  day: {
    celestialEmoji: '☀️',
    celestialPosition: { x: 50, y: 10 },
    glowColor: 'rgba(255, 230, 150, 0.3)',
    greeting: '陽光正好，努力工作吧！',
  },
  evening: {
    celestialEmoji: '🌆',
    celestialPosition: { x: 85, y: 30 },
    glowColor: 'rgba(255, 120, 80, 0.4)',
    greeting: '傍晚了，今天辛苦了～',
  },
  night: {
    celestialEmoji: '🌙',
    celestialPosition: { x: 80, y: 15 },
    glowColor: 'rgba(100, 150, 255, 0.3)',
    greeting: '夜深了，注意休息喔！',
  },
};

// 天體動畫組件
function CelestialBody({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const config = TIME_CONFIG[timeOfDay];
  
  return (
    <motion.div
      className="absolute pointer-events-none z-[3]"
      initial={{ 
        x: '-50%', 
        y: '100%',
        opacity: 0,
        scale: 0.5,
      }}
      animate={{ 
        x: '-50%',
        y: '-50%',
        opacity: 1,
        scale: 1,
      }}
      exit={{ 
        y: '100%',
        opacity: 0,
        scale: 0.5,
      }}
      transition={{
        duration: 1.5,
        ease: 'easeOut',
      }}
      style={{
        left: `${config.celestialPosition.x}%`,
        top: `${config.celestialPosition.y}%`,
      }}
    >
      {/* 發光效果 */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{
          background: config.glowColor,
          width: '80px',
          height: '80px',
          transform: 'translate(-25%, -25%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* 天體 emoji */}
      <motion.span
        className="text-4xl drop-shadow-lg"
        animate={{
          y: [0, -3, 0],
          rotate: timeOfDay === 'night' ? [0, 5, 0, -5, 0] : 0,
        }}
        transition={{
          duration: timeOfDay === 'night' ? 4 : 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {config.celestialEmoji}
      </motion.span>
    </motion.div>
  );
}

// 轉場提示組件
function TransitionNotice({ timeOfDay, show }: { timeOfDay: TimeOfDay; show: boolean }) {
  const config = TIME_CONFIG[timeOfDay];
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[50] pointer-events-none"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="bg-black/60 backdrop-blur-md rounded-2xl px-6 py-4 shadow-2xl">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span 
                className="text-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {config.celestialEmoji}
              </motion.span>
              <span className="text-white text-lg font-medium">
                {config.greeting}
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 天空漸層過渡
function SkyGradient({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const gradients: Record<TimeOfDay, string> = {
    morning: 'linear-gradient(to bottom, rgba(255,200,150,0.2) 0%, rgba(255,230,200,0.1) 50%, transparent 100%)',
    day: 'linear-gradient(to bottom, rgba(135,206,235,0.15) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
    evening: 'linear-gradient(to bottom, rgba(255,100,50,0.25) 0%, rgba(255,150,100,0.1) 50%, transparent 100%)',
    night: 'linear-gradient(to bottom, rgba(20,20,50,0.3) 0%, rgba(50,50,100,0.15) 50%, transparent 100%)',
  };

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-[2]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{ background: gradients[timeOfDay] }}
    />
  );
}

// 星星效果（僅夜間）
function Stars({ show }: { show: boolean }) {
  if (!show) return null;

  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 40,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-[1]">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.8, 0.3, 0.9, 0],
          }}
          transition={{
            duration: 3,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function TimeTransition({ timeOfDay, onTransitionComplete }: TimeTransitionProps) {
  const [showNotice, setShowNotice] = useState(false);
  const prevTimeRef = useRef<TimeOfDay>(timeOfDay);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // 跳過第一次 render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevTimeRef.current = timeOfDay;
      return;
    }

    // 時段改變時顯示通知
    if (prevTimeRef.current !== timeOfDay) {
      setShowNotice(true);
      
      const timer = setTimeout(() => {
        setShowNotice(false);
        onTransitionComplete?.();
      }, 3000);

      prevTimeRef.current = timeOfDay;
      return () => clearTimeout(timer);
    }
  }, [timeOfDay, onTransitionComplete]);

  return (
    <>
      {/* 天空漸層 */}
      <AnimatePresence mode="wait">
        <SkyGradient key={`sky-${timeOfDay}`} timeOfDay={timeOfDay} />
      </AnimatePresence>

      {/* 星星（夜間） */}
      <Stars show={timeOfDay === 'night'} />

      {/* 天體 */}
      <AnimatePresence mode="wait">
        <CelestialBody key={`celestial-${timeOfDay}`} timeOfDay={timeOfDay} />
      </AnimatePresence>

      {/* 轉場提示 */}
      <TransitionNotice timeOfDay={timeOfDay} show={showNotice} />
    </>
  );
}
