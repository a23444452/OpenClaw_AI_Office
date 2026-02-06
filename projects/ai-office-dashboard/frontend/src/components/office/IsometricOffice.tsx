import React, { useState, useEffect } from 'react';
import type { Character } from '../../data/types';

interface IsometricOfficeProps {
  characters: Character[];
  recentJobs?: Array<{
    characterId: string;
    status: string;
  }>;
}

// 角色在等距場景中的位置配置（基於 2816x1536 背景圖）
// 位置是百分比，對應背景圖中的 6 個工位椅子位置
const characterPositions: Record<string, { x: number; y: number; scale: number }> = {
  lucy: { x: 18, y: 42, scale: 0.14 },      // 左上角白板前桌子椅子 - 總指揮
  xiaocai: { x: 40, y: 36, scale: 0.14 },   // 白板右邊桌子椅子 - 財經分析師
  axin: { x: 26, y: 58, scale: 0.13 },      // 中排左側桌子椅子 - 新聞編輯
  yanyan: { x: 46, y: 52, scale: 0.13 },    // 中排右側桌子椅子 - 研究員
  pangxie: { x: 70, y: 54, scale: 0.13 },   // 懶骨頭休息區 - 社群小編
  xiaoguan: { x: 34, y: 74, scale: 0.12 },  // 前排左側桌子椅子 - 生活管家
};

// 角色 chibi 圖片路徑
const chibiAvatars: Record<string, string> = {
  lucy: '/avatars/chibi-lucy.png',
  xiaocai: '/avatars/chibi-xiaocai.png',
  axin: '/avatars/chibi-axin.png',
  yanyan: '/avatars/chibi-yanyan.png',
  pangxie: '/avatars/chibi-pangxie.png',
  xiaoguan: '/avatars/chibi-xiaoguan.png',
};

type CharacterState = 'idle' | 'working' | 'happy' | 'tired' | 'alert';

function getCharacterState(char: Character, recentJobs?: IsometricOfficeProps['recentJobs']): CharacterState {
  const hasError = recentJobs?.some(j => j.characterId === char.id && j.status === 'error');
  if (hasError) return 'alert';
  
  const completionRate = char.stats.completed / char.stats.tasks;
  if (completionRate >= 0.95) return 'happy';
  if (char.stats.workHours > 6) return 'tired';
  if (char.stats.tasks > 0) return 'working';
  return 'idle';
}

// 狀態氣泡組件
const StatusBubble: React.FC<{
  state: CharacterState;
  name: string;
  emoji: string;
}> = ({ state, name, emoji }) => {
  const stateConfig = {
    idle: { bg: 'bg-gray-600', text: '待命中', icon: '💤' },
    working: { bg: 'bg-blue-500', text: '工作中', icon: '💼' },
    happy: { bg: 'bg-green-500', text: '完成！', icon: '✨' },
    tired: { bg: 'bg-yellow-500', text: '疲憊', icon: '😴' },
    alert: { bg: 'bg-red-500 animate-pulse', text: '警報！', icon: '❗' },
  };
  
  const config = stateConfig[state];
  
  return (
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap z-20 pointer-events-none">
      <div className={`${config.bg} px-3 py-1.5 rounded-xl text-white text-sm font-bold shadow-xl flex items-center gap-1.5 border border-white/20`}>
        <span className="text-base">{emoji}</span>
        <span>{name}</span>
        <span className="ml-1 px-2 py-0.5 bg-black/30 rounded-lg text-xs">
          {config.icon} {config.text}
        </span>
      </div>
      {/* 氣泡箭頭 */}
      <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 ${config.bg} rotate-45 border-r border-b border-white/20`} />
    </div>
  );
};

// 單個角色組件
const CharacterSprite: React.FC<{
  character: Character;
  state: CharacterState;
  position: { x: number; y: number; scale: number };
  onClick?: () => void;
}> = ({ character, state, position, onClick }) => {
  const [showBubble, setShowBubble] = useState(false);
  const [breathe, setBreathe] = useState(false);

  // 呼吸動畫
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathe(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // 工作中時持續顯示狀態
  useEffect(() => {
    if (state === 'working' || state === 'alert') {
      setShowBubble(true);
    }
  }, [state]);

  const chibiSrc = chibiAvatars[character.id];

  return (
    <div
      className="absolute cursor-pointer transition-all duration-500 group"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) scale(${position.scale}) ${breathe ? 'translateY(-2px)' : 'translateY(2px)'}`,
      }}
      onClick={onClick}
      onMouseEnter={() => setShowBubble(true)}
      onMouseLeave={() => {
        if (state !== 'working' && state !== 'alert') {
          setShowBubble(false);
        }
      }}
    >
      {/* 狀態氣泡 */}
      {showBubble && (
        <StatusBubble state={state} name={character.name} emoji={character.emoji} />
      )}

      {/* 角色圖片 */}
      <div className="relative">
        <img
          src={chibiSrc}
          alt={character.name}
          className={`w-[600px] h-auto drop-shadow-2xl transition-all duration-300
            ${state === 'alert' ? 'animate-pulse drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]' : ''}
            ${state === 'happy' ? 'drop-shadow-[0_0_10px_rgba(0,255,100,0.3)]' : ''}
            ${state === 'working' ? 'drop-shadow-[0_0_10px_rgba(0,150,255,0.3)]' : ''}
            group-hover:scale-105
          `}
          style={{ imageRendering: 'auto' }}
        />
        
        {/* 警報光環 */}
        {state === 'alert' && (
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
        )}
      </div>
    </div>
  );
};

export const IsometricOffice: React.FC<IsometricOfficeProps> = ({ characters, recentJobs }) => {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border-2 border-[#3a2a1a] shadow-2xl">
      {/* 背景圖 */}
      <img
        src="/office-bg.png"
        alt="AI Office"
        className="w-full h-auto"
      />

      {/* 角色疊加層 */}
      <div className="absolute inset-0">
        {characters.map((char) => {
          const position = characterPositions[char.id];
          if (!position) return null;
          
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
      </div>

      {/* 角色詳情彈窗 */}
      {selectedChar && (
        <div 
          className="absolute inset-0 bg-black/60 flex items-center justify-center z-30"
          onClick={() => setSelectedChar(null)}
        >
          <div 
            className="bg-gradient-to-br from-[#2a2a4e] to-[#1a1a2e] rounded-2xl p-5 border-2 border-[#4a3a6a] max-w-[320px] mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={chibiAvatars[selectedChar.id]}
                alt={selectedChar.name}
                className="w-20 h-20 object-contain"
              />
              <div>
                <h3 className="font-bold text-xl text-white">{selectedChar.name} {selectedChar.emoji}</h3>
                <p className="text-sm text-[#00d9ff]">{selectedChar.title}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">{selectedChar.description}</p>
            
            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div className="bg-[#1a1a2e] rounded-lg p-2">
                <div className="text-[#00d9ff] font-bold text-lg">{selectedChar.stats.tasks}</div>
                <div className="text-gray-500 text-xs">任務數</div>
              </div>
              <div className="bg-[#1a1a2e] rounded-lg p-2">
                <div className="text-[#00ff88] font-bold text-lg">
                  {Math.round(selectedChar.stats.completed / selectedChar.stats.tasks * 100)}%
                </div>
                <div className="text-gray-500 text-xs">完成率</div>
              </div>
              <div className="bg-[#1a1a2e] rounded-lg p-2">
                <div className="text-[#ffaa00] font-bold text-lg">
                  ${selectedChar.stats.savedAmount.toLocaleString()}
                </div>
                <div className="text-gray-500 text-xs">節省金額</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                className="flex-1 py-2 bg-gradient-to-r from-[#0f3460] to-[#1a4a7a] rounded-lg text-sm font-bold hover:opacity-80 transition-opacity"
                onClick={() => setSelectedChar(null)}
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IsometricOffice;
