import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface AmbientParticlesProps {
  timeOfDay: TimeOfDay;
  count?: number;
}

// 根據時段生成粒子配置
const getParticleConfig = (timeOfDay: TimeOfDay) => {
  switch (timeOfDay) {
    case 'morning':
      return {
        colors: ['rgba(255, 223, 186, 0.6)', 'rgba(255, 200, 150, 0.4)'],
        emoji: '✨',
        animation: 'twinkle',
        sizeRange: [3, 6],
      };
    case 'day':
      return {
        colors: ['rgba(255, 255, 255, 0.3)', 'rgba(255, 248, 220, 0.4)'],
        emoji: null,
        animation: 'float',
        sizeRange: [2, 4],
      };
    case 'evening':
      return {
        colors: ['rgba(255, 180, 100, 0.5)', 'rgba(255, 140, 80, 0.3)'],
        emoji: '🍂',
        animation: 'fall',
        sizeRange: [4, 8],
      };
    case 'night':
      return {
        colors: ['rgba(180, 255, 180, 0.6)', 'rgba(150, 255, 200, 0.4)'],
        emoji: '✨',
        animation: 'firefly',
        sizeRange: [2, 5],
      };
    default:
      return {
        colors: ['rgba(255, 255, 255, 0.3)'],
        emoji: null,
        animation: 'float',
        sizeRange: [2, 4],
      };
  }
};

// 生成粒子
const generateParticles = (count: number, timeOfDay: TimeOfDay): Particle[] => {
  const config = getParticleConfig(timeOfDay);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 5,
  }));
};

// 螢火蟲動畫
function Firefly({ particle, colors }: { particle: Particle; colors: string[] }) {
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size,
        height: particle.size,
        backgroundColor: color,
        boxShadow: `0 0 ${particle.size * 2}px ${color}`,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.8, 0.3, 0.9, 0],
        x: [0, 20, -10, 15, 0],
        y: [0, -15, 10, -20, 0],
        scale: [0.8, 1.2, 0.9, 1.1, 0.8],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// 浮動塵埃
function FloatingDust({ particle, colors }: { particle: Particle; colors: string[] }) {
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size,
        height: particle.size,
        backgroundColor: color,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.5, 0.3, 0.5, 0],
        y: [0, -30, -60],
        x: [0, 10, -5, 15],
      }}
      transition={{
        duration: particle.duration * 2,
        delay: particle.delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

// 閃爍星點
function TwinkleStar({ particle, colors }: { particle: Particle; colors: string[] }) {
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        fontSize: particle.size * 2,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0.5, 1, 0],
        scale: [0.5, 1, 0.8, 1.2, 0.5],
        rotate: [0, 15, -15, 10, 0],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <span style={{ 
        filter: `drop-shadow(0 0 3px ${color})`,
        color: color.replace('0.6', '0.9').replace('0.4', '0.7'),
      }}>
        ✦
      </span>
    </motion.div>
  );
}

// 落葉效果
function FallingLeaf({ particle }: { particle: Particle }) {
  const leafEmojis = ['🍂', '🍁', '🌿'];
  const emoji = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${particle.x}%`,
        top: '-10%',
        fontSize: particle.size * 1.5,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.8, 0.8, 0],
        y: ['0%', '110%'],
        x: [0, 30, -20, 40, 0],
        rotate: [0, 180, 360, 540, 720],
      }}
      transition={{
        duration: particle.duration * 3,
        delay: particle.delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {emoji}
    </motion.div>
  );
}

export function AmbientParticles({ timeOfDay, count = 15 }: AmbientParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const config = useMemo(() => getParticleConfig(timeOfDay), [timeOfDay]);

  useEffect(() => {
    setParticles(generateParticles(count, timeOfDay));
  }, [count, timeOfDay]);

  // 根據動畫類型渲染對應的粒子組件
  const renderParticle = (particle: Particle) => {
    switch (config.animation) {
      case 'firefly':
        return <Firefly key={particle.id} particle={particle} colors={config.colors} />;
      case 'twinkle':
        return <TwinkleStar key={particle.id} particle={particle} colors={config.colors} />;
      case 'fall':
        return <FallingLeaf key={particle.id} particle={particle} />;
      case 'float':
      default:
        return <FloatingDust key={particle.id} particle={particle} colors={config.colors} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={timeOfDay}
        className="absolute inset-0 overflow-hidden pointer-events-none z-[5]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {particles.map(renderParticle)}
      </motion.div>
    </AnimatePresence>
  );
}
