import { useState } from 'react';
import { motion } from 'framer-motion';
import { Character } from './Character';
import { CharacterModal } from './CharacterModal';
import { useTimeOfDay, getSceneForTime } from '../hooks/useTimeOfDay';
import type { Agent, RecentJob } from '../types';

interface OfficeProps {
  agents: Agent[];
  recentJobs: RecentJob[];
}

// Character positions in the office scene (percentages)
const CHARACTER_POSITIONS: Record<string, { x: number; y: number; scale: number }> = {
  lucy: { x: 50, y: 75, scale: 0.85 },     // Center front - Lucy is the leader
  xiaocai: { x: 30, y: 58, scale: 0.85 },  // Left desk with monitors
  yanyan: { x: 78, y: 52, scale: 0.7 },    // Right desk near window (smaller)
  axin: { x: 58, y: 45, scale: 0.85 },     // Center-upper, slightly right
  pangxie: { x: 82, y: 85, scale: 0.85 },  // Front right
  xiaoguan: { x: 15, y: 60, scale: 0.7 },  // Back left near whiteboard (smaller)
};

export function Office({ agents, recentJobs }: OfficeProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const timeOfDay = useTimeOfDay();
  const sceneBg = getSceneForTime(timeOfDay);

  const isNight = timeOfDay === 'night';

  return (
    <div className="relative w-full aspect-video max-h-[60vh] overflow-hidden rounded-xl shadow-2xl">
      {/* Background Scene */}
      <motion.img
        src={sceneBg}
        alt="AI Office"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Night overlay */}
      {isNight && (
        <div className="absolute inset-0 night-overlay pointer-events-none" />
      )}

      {/* Time indicator */}
      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
        <span className="text-lg">
          {timeOfDay === 'morning' && '🌅'}
          {timeOfDay === 'day' && '☀️'}
          {timeOfDay === 'evening' && '🌆'}
          {timeOfDay === 'night' && '🌙'}
        </span>
        <span className="text-white text-sm">
          {timeOfDay === 'morning' && '早晨'}
          {timeOfDay === 'day' && '白天'}
          {timeOfDay === 'evening' && '傍晚'}
          {timeOfDay === 'night' && '深夜'}
        </span>
      </div>

      {/* Characters */}
      {agents.map((agent) => {
        const position = CHARACTER_POSITIONS[agent.id] || { x: 50, y: 50, scale: 1 };
        const recentTask = recentJobs.find(
          (job) => job.agent === agent.name || job.agent.toLowerCase() === agent.id
        )?.title;

        return (
          <Character
            key={agent.id}
            agent={agent}
            position={position}
            onClick={() => setSelectedAgent(agent)}
            recentTask={recentTask}
          />
        );
      })}

      {/* Office decorations / ambient effects */}
      {isNight && (
        <>
          {/* Window glow effect */}
          <div className="absolute top-[20%] left-[10%] w-4 h-4 bg-yellow-300/50 rounded-full blur-md animate-pulse" />
          <div className="absolute top-[25%] left-[15%] w-3 h-3 bg-yellow-300/40 rounded-full blur-md animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-[22%] right-[12%] w-4 h-4 bg-blue-300/40 rounded-full blur-md animate-pulse" style={{ animationDelay: '1s' }} />
        </>
      )}

      {/* Character Modal */}
      {selectedAgent && (
        <CharacterModal
          agent={selectedAgent}
          recentJobs={recentJobs}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}
