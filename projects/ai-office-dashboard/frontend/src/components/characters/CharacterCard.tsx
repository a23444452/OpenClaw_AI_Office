import React, { useState, useEffect } from 'react';
import type { Character } from '../../data/types';

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
  const [currentVoice, setCurrentVoice] = useState('');
  const [voiceCategory, setVoiceCategory] = useState<'idle' | 'working' | 'happy' | 'tired'>('idle');

  // 根據狀態選擇心聲類別
  useEffect(() => {
    const { stats } = character;
    const completionRate = stats.completed / stats.tasks;
    
    if (completionRate >= 0.95) {
      setVoiceCategory('happy');
    } else if (stats.workHours > 6) {
      setVoiceCategory('tired');
    } else if (stats.tasks > 0) {
      setVoiceCategory('working');
    } else {
      setVoiceCategory('idle');
    }
  }, [character]);

  // 隨機選擇心聲
  useEffect(() => {
    const voices = character.voices[voiceCategory];
    const randomVoice = voices[Math.floor(Math.random() * voices.length)];
    setCurrentVoice(randomVoice);

    // 每 10 秒換一次心聲
    const interval = setInterval(() => {
      const newVoice = voices[Math.floor(Math.random() * voices.length)];
      setCurrentVoice(newVoice);
    }, 10000);

    return () => clearInterval(interval);
  }, [character.voices, voiceCategory]);

  const completionRate = Math.round((character.stats.completed / character.stats.tasks) * 100);

  return (
    <div
      className="character-card bg-[#16213e] rounded-xl p-4 border border-[#0f3460] cursor-pointer"
      onClick={onClick}
    >
      {/* 頭像和基本資訊 */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <img
            src={character.avatar}
            alt={character.name}
            className="w-20 h-20 rounded-lg object-cover border-2 border-[#0f3460]"
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="absolute -bottom-1 -right-1 text-2xl">{character.emoji}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {character.name}
            <span className="text-xs bg-[#0f3460] px-2 py-0.5 rounded text-gray-300">
              {character.title}
            </span>
          </h3>
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
            {character.description}
          </p>
        </div>
      </div>

      {/* 心聲泡泡 */}
      <div className="bg-[#1a1a2e] rounded-lg p-3 mb-4 relative">
        <div className="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-[#1a1a2e]"></div>
        <p className="text-sm text-gray-300 italic">"{currentVoice}"</p>
      </div>

      {/* 統計數據 */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[#00d9ff] font-bold">{character.stats.tasks}</div>
          <div className="text-gray-500 text-xs">任務</div>
        </div>
        <div>
          <div className="text-[#00ff88] font-bold">{completionRate}%</div>
          <div className="text-gray-500 text-xs">完成率</div>
        </div>
        <div>
          <div className="text-[#ffaa00] font-bold">NT${character.stats.savedAmount}</div>
          <div className="text-gray-500 text-xs">節省</div>
        </div>
      </div>
    </div>
  );
};
