import React, { useState, useEffect } from 'react';
import type { Character } from '../../data/types';

interface OfficeSceneProps {
  characters: Character[];
  recentJobs?: Array<{
    characterId: string;
    status: string;
  }>;
}

// 角色在場景中的位置配置
const characterPositions: Record<string, { x: number; y: number; desk: string }> = {
  lucy: { x: 50, y: 45, desk: 'center' },      // Lucy 在中央主位
  xiaocai: { x: 15, y: 55, desk: 'left-1' },   // 小財在左邊
  axin: { x: 85, y: 55, desk: 'right-1' },     // 阿新在右邊
  yanyan: { x: 25, y: 75, desk: 'left-2' },    // 研研在左後
  pangxie: { x: 75, y: 75, desk: 'right-2' },  // 螃蟹在右後
  xiaoguan: { x: 50, y: 85, desk: 'back' },    // 小管在後方
};

// 角色狀態決定動畫
type CharacterState = 'idle' | 'working' | 'happy' | 'tired' | 'alert';

function getCharacterState(char: Character, recentJobs?: OfficeSceneProps['recentJobs']): CharacterState {
  // 檢查最近是否有任務失敗
  const hasError = recentJobs?.some(j => j.characterId === char.id && j.status === 'error');
  if (hasError) return 'alert';
  
  // 根據工作量決定狀態
  const completionRate = char.stats.completed / char.stats.tasks;
  if (completionRate >= 0.95) return 'happy';
  if (char.stats.workHours > 6) return 'tired';
  if (char.stats.tasks > 0) return 'working';
  return 'idle';
}

// 單個角色組件
const CharacterSprite: React.FC<{
  character: Character;
  state: CharacterState;
  position: { x: number; y: number };
  onClick?: () => void;
}> = ({ character, state, position, onClick }) => {
  const [bounce, setBounce] = useState(false);

  // 隨機觸發小動畫
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setBounce(true);
        setTimeout(() => setBounce(false), 500);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-300 group
        ${bounce ? 'animate-bounce' : ''}
        ${state === 'working' ? 'animate-pulse' : ''}
      `}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={onClick}
    >
      {/* 角色頭像 */}
      <div className="relative">
        <img
          src={character.avatar}
          alt={character.name}
          className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg object-cover 
            border-2 transition-all
            ${state === 'alert' ? 'border-red-500 animate-pulse' : ''}
            ${state === 'happy' ? 'border-green-400' : ''}
            ${state === 'working' ? 'border-blue-400' : ''}
            ${state === 'tired' ? 'border-yellow-500' : ''}
            ${state === 'idle' ? 'border-[#0f3460]' : ''}
          `}
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* 狀態指示器 */}
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px]
          ${state === 'alert' ? 'bg-red-500 animate-ping' : ''}
          ${state === 'happy' ? 'bg-green-400' : ''}
          ${state === 'working' ? 'bg-blue-400' : ''}
          ${state === 'tired' ? 'bg-yellow-500' : ''}
          ${state === 'idle' ? 'bg-gray-500' : ''}
        `}>
          {state === 'alert' && '❗'}
          {state === 'happy' && '✨'}
          {state === 'working' && '💼'}
          {state === 'tired' && '😴'}
          {state === 'idle' && '💤'}
        </div>

        {/* Hover 時顯示名字 */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity
          bg-[#1a1a2e] px-2 py-0.5 rounded text-[10px] whitespace-nowrap border border-[#0f3460]">
          {character.name} {character.emoji}
        </div>
      </div>

      {/* 工作中的螢幕光效 */}
      {state === 'working' && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#00d9ff]/30 blur-sm animate-pulse" />
      )}
    </div>
  );
};

// 辦公室裝飾元素
const OfficeDecorations: React.FC = () => (
  <>
    {/* 窗戶 */}
    <div className="absolute top-[5%] left-[10%] w-[25%] h-[20%] border-2 border-[#0f3460] bg-[#1a1a2e]/50 rounded">
      <div className="absolute inset-1 bg-gradient-to-b from-[#00d9ff]/10 to-transparent" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-[#0f3460]" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#0f3460]" />
    </div>
    <div className="absolute top-[5%] right-[10%] w-[25%] h-[20%] border-2 border-[#0f3460] bg-[#1a1a2e]/50 rounded">
      <div className="absolute inset-1 bg-gradient-to-b from-[#00d9ff]/10 to-transparent" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-[#0f3460]" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#0f3460]" />
    </div>

    {/* 植物 */}
    <div className="absolute bottom-[10%] left-[5%] text-2xl sm:text-3xl">🪴</div>
    <div className="absolute bottom-[10%] right-[5%] text-2xl sm:text-3xl">🌿</div>

    {/* 白板 */}
    <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[20%] h-[15%] bg-white/90 rounded border-2 border-[#0f3460]">
      <div className="absolute top-1 left-1 right-1 h-px bg-gray-300" />
      <div className="absolute top-3 left-1 right-1 h-px bg-gray-300" />
      <div className="absolute top-5 left-1 w-1/2 h-px bg-gray-300" />
    </div>

    {/* 時鐘 */}
    <div className="absolute top-[5%] left-1/2 translate-x-[60%] text-lg sm:text-xl">🕐</div>

    {/* 咖啡機 */}
    <div className="absolute bottom-[15%] left-[8%] text-lg sm:text-xl">☕</div>

    {/* 書架 */}
    <div className="absolute top-[30%] right-[3%] text-lg sm:text-xl">📚</div>
  </>
);

// 桌子
const Desks: React.FC = () => (
  <>
    {/* 中央主桌 */}
    <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[30%] h-[8%] bg-[#2a1a0a] rounded-sm border border-[#4a3a2a] shadow-lg" />
    
    {/* 左側桌子 */}
    <div className="absolute top-[48%] left-[10%] w-[20%] h-[6%] bg-[#2a1a0a] rounded-sm border border-[#4a3a2a]" />
    <div className="absolute top-[68%] left-[18%] w-[20%] h-[6%] bg-[#2a1a0a] rounded-sm border border-[#4a3a2a]" />
    
    {/* 右側桌子 */}
    <div className="absolute top-[48%] right-[10%] w-[20%] h-[6%] bg-[#2a1a0a] rounded-sm border border-[#4a3a2a]" />
    <div className="absolute top-[68%] right-[18%] w-[20%] h-[6%] bg-[#2a1a0a] rounded-sm border border-[#4a3a2a]" />
    
    {/* 後方桌子 */}
    <div className="absolute top-[78%] left-1/2 -translate-x-1/2 w-[20%] h-[6%] bg-[#2a1a0a] rounded-sm border border-[#4a3a2a]" />
  </>
);

export const OfficeScene: React.FC<OfficeSceneProps> = ({ characters, recentJobs }) => {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  return (
    <div className="relative w-full aspect-video bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-xl border border-[#0f3460] overflow-hidden">
      {/* 地板 */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-[#2a2a4e] to-transparent opacity-50" />
      
      {/* 網格線（地板紋理）*/}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, #0f3460 1px, transparent 1px), linear-gradient(to bottom, #0f3460 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* 裝飾 */}
      <OfficeDecorations />
      
      {/* 桌子 */}
      <Desks />

      {/* 角色 */}
      {characters.map((char) => {
        const position = characterPositions[char.id] || { x: 50, y: 50 };
        const state = getCharacterState(char, recentJobs);
        
        return (
          <CharacterSprite
            key={char.id}
            character={char}
            state={state}
            position={position}
            onClick={() => setSelectedChar(char)}
          />
        );
      })}

      {/* 標題 */}
      <div className="absolute top-2 left-2 bg-[#1a1a2e]/80 px-2 py-1 rounded text-xs sm:text-sm font-bold flex items-center gap-1">
        <span className="animate-pulse">🔴</span>
        <span>LIVE</span>
      </div>

      {/* 角色詳情彈窗 */}
      {selectedChar && (
        <div 
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
          onClick={() => setSelectedChar(null)}
        >
          <div 
            className="bg-[#16213e] rounded-xl p-4 border border-[#0f3460] max-w-[280px] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={selectedChar.avatar}
                alt={selectedChar.name}
                className="w-16 h-16 rounded-lg object-cover border-2 border-[#0f3460]"
                style={{ imageRendering: 'pixelated' }}
              />
              <div>
                <h3 className="font-bold text-lg">{selectedChar.name} {selectedChar.emoji}</h3>
                <p className="text-sm text-gray-400">{selectedChar.title}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-3">{selectedChar.description}</p>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <div className="text-[#00d9ff] font-bold">{selectedChar.stats.tasks}</div>
                <div className="text-gray-500 text-xs">任務</div>
              </div>
              <div>
                <div className="text-[#00ff88] font-bold">{Math.round(selectedChar.stats.completed / selectedChar.stats.tasks * 100)}%</div>
                <div className="text-gray-500 text-xs">完成率</div>
              </div>
              <div>
                <div className="text-[#ffaa00] font-bold">NT${selectedChar.stats.savedAmount}</div>
                <div className="text-gray-500 text-xs">節省</div>
              </div>
            </div>
            <button 
              className="mt-3 w-full py-2 bg-[#0f3460] rounded-lg text-sm hover:bg-[#1a4a7a] transition-colors"
              onClick={() => setSelectedChar(null)}
            >
              關閉
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
