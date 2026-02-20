import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Agent } from '../types';

interface CollaborationLinesProps {
  agents: Agent[];
  positions: Record<string, { x: number; y: number; scale: number }>;
}

// 預設的協作關係
const COLLABORATION_PAIRS: [string, string][] = [
  ['lucy', 'xiaocai'],     // Lucy 協調小財的投資分析
  ['lucy', 'yanyan'],      // Lucy 協調研研的研究
  ['lucy', 'axin'],        // Lucy 協調阿新的新聞
  ['xiaocai', 'yanyan'],   // 小財和研研的數據協作
  ['axin', 'pangxie'],     // 阿新和螃蟹的社群內容
  ['lucy', 'xiaoguan'],    // Lucy 和小管的帳務
];

export function CollaborationLines({ agents, positions }: CollaborationLinesProps) {
  // 找出所有活躍的角色
  const activeAgentIds = useMemo(() => 
    agents.filter(a => a.status === 'active').map(a => a.id),
    [agents]
  );

  // 找出需要顯示連線的配對（兩個都活躍的）
  const activeConnections = useMemo(() => {
    return COLLABORATION_PAIRS.filter(([a, b]) => 
      activeAgentIds.includes(a) && activeAgentIds.includes(b)
    );
  }, [activeAgentIds]);

  if (activeConnections.length === 0) return null;

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* 動態漸變定義 */}
        {activeConnections.map(([a, b], index) => (
          <linearGradient 
            key={`gradient-${a}-${b}`} 
            id={`line-gradient-${index}`}
            x1="0%" y1="0%" x2="100%" y2="0%"
          >
            <stop offset="0%" stopColor="rgba(255,215,0,0.6)">
              <animate
                attributeName="stop-color"
                values="rgba(255,215,0,0.6);rgba(255,215,0,0.3);rgba(255,215,0,0.6)"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="rgba(255,255,255,0.3)">
              <animate
                attributeName="stop-color"
                values="rgba(255,255,255,0.3);rgba(255,255,255,0.6);rgba(255,255,255,0.3)"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="rgba(100,200,255,0.6)">
              <animate
                attributeName="stop-color"
                values="rgba(100,200,255,0.6);rgba(100,200,255,0.3);rgba(100,200,255,0.6)"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        ))}
        
        {/* 發光濾鏡 */}
        <filter id="glow-line" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {activeConnections.map(([agentA, agentB], index) => {
        const posA = positions[agentA];
        const posB = positions[agentB];
        
        if (!posA || !posB) return null;

        // 計算連線端點（考慮角色中心偏移）
        const x1 = posA.x;
        const y1 = posA.y - 5; // 稍微往上偏移到角色中心
        const x2 = posB.x;
        const y2 = posB.y - 5;

        // 計算曲線控制點（使線條呈現優雅的弧形）
        const midX = (x1 + x2) / 2;
        const midY = Math.min(y1, y2) - 10; // 向上彎曲

        return (
          <motion.g 
            key={`connection-${agentA}-${agentB}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* 主連線 */}
            <motion.path
              d={`M ${x1}% ${y1}% Q ${midX}% ${midY}% ${x2}% ${y2}%`}
              fill="none"
              stroke={`url(#line-gradient-${index})`}
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#glow-line)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />

            {/* 流動的能量點 */}
            <circle r="3" fill="white" filter="url(#glow-line)">
              <animateMotion
                dur={`${2 + index * 0.3}s`}
                repeatCount="indefinite"
                path={`M ${x1}% ${y1}% Q ${midX}% ${midY}% ${x2}% ${y2}%`}
              />
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="1s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="2;4;2"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>

            {/* 反向流動的能量點 */}
            <circle r="2" fill="rgba(255,215,0,0.8)" filter="url(#glow-line)">
              <animateMotion
                dur={`${2.5 + index * 0.2}s`}
                repeatCount="indefinite"
                path={`M ${x2}% ${y2}% Q ${midX}% ${midY}% ${x1}% ${y1}%`}
              />
              <animate
                attributeName="opacity"
                values="0.6;1;0.6"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </circle>
          </motion.g>
        );
      })}
    </svg>
  );
}
