import React, { useState, useEffect, useRef } from 'react';
import type { Character } from '../../data/types';

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
  const [currentVoice, setCurrentVoice] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [voiceCategory, setVoiceCategory] = useState<'idle' | 'working' | 'happy' | 'tired'>('idle');
  const voiceIndexRef = useRef(0);

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

  // 初始化心聲
  useEffect(() => {
    const voices = character.voices[voiceCategory];
    voiceIndexRef.current = Math.floor(Math.random() * voices.length);
    setCurrentVoice(voices[voiceIndexRef.current]);
  }, [character.voices, voiceCategory]);

  // 帶淡入淡出的心聲切換
  useEffect(() => {
    const voices = character.voices[voiceCategory];
    
    const interval = setInterval(() => {
      // 1. 開始淡出
      setIsTransitioning(true);
      
      // 2. 淡出結束後切換內容並淡入
      setTimeout(() => {
        voiceIndexRef.current = (voiceIndexRef.current + 1) % voices.length;
        setCurrentVoice(voices[voiceIndexRef.current]);
        
        // 3. 短暫延遲後開始淡入
        requestAnimationFrame(() => {
          setIsTransitioning(false);
        });
      }, 350);
    }, 8000);

    return () => clearInterval(interval);
  }, [character.voices, voiceCategory]);

  const completionRate = Math.round((character.stats.completed / character.stats.tasks) * 100);

  return (
    <div
      className="character-card bg-[#16213e] rounded-xl p-3 sm:p-4 border border-[#0f3460] cursor-pointer"
      onClick={onClick}
    >
      {/* 頭像和基本資訊 */}
      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="relative flex-shrink-0">
          <img
            src={character.avatar}
            alt={character.name}
            className="w-14 h-14 sm:w-16 md:w-20 sm:h-16 md:h-20 rounded-lg object-cover border-2 border-[#0f3460]"
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="absolute -bottom-1 -right-1 text-lg sm:text-xl md:text-2xl">{character.emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {character.name}
            <span className="text-[10px] sm:text-xs bg-[#0f3460] px-1.5 sm:px-2 py-0.5 rounded text-gray-300">
              {character.title}
            </span>
          </h3>
          <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mt-1 line-clamp-2">
            {character.description}
          </p>
        </div>
      </div>

      {/* 心聲泡泡 - 帶淡入淡出動畫 */}
      <div className="bg-[#1a1a2e] rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 relative overflow-hidden">
        <div className="absolute -top-2 left-4 w-0 h-0 border-l-[6px] sm:border-l-8 border-r-[6px] sm:border-r-8 border-b-[6px] sm:border-b-8 border-transparent border-b-[#1a1a2e]"></div>
        <p 
          className={`text-[10px] sm:text-xs md:text-sm text-gray-300 italic transition-all duration-300 ease-in-out ${
            isTransitioning ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
          }`}
        >
          "{currentVoice}"
        </p>
        {/* 打字效果指示器 */}
        {isTransitioning && (
          <div className="absolute bottom-2 right-3 flex gap-0.5">
            <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>

      {/* 統計數據 */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center">
        <div>
          <div className="text-[#00d9ff] font-bold text-sm sm:text-base">{character.stats.tasks}</div>
          <div className="text-gray-500 text-[10px] sm:text-xs">任務</div>
        </div>
        <div>
          <div className="text-[#00ff88] font-bold text-sm sm:text-base">{completionRate}%</div>
          <div className="text-gray-500 text-[10px] sm:text-xs">完成率</div>
        </div>
        <div>
          <div className="text-[#ffaa00] font-bold text-sm sm:text-base">
            <span className="hidden sm:inline">NT$</span>
            <span className="sm:hidden">$</span>
            {character.stats.savedAmount}
          </div>
          <div className="text-gray-500 text-[10px] sm:text-xs">節省</div>
        </div>
      </div>
    </div>
  );
};
