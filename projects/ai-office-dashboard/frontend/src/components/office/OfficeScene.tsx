import React, { useState, useEffect } from 'react';
import type { Character } from '../../data/types';
import { useTimeOfDay, type TimeTheme } from '../../hooks/useTimeOfDay';

interface OfficeSceneProps {
  characters: Character[];
  recentJobs?: Array<{
    characterId: string;
    status: string;
  }>;
}

// 角色在場景中的位置配置（6個工位）
const characterPositions: Record<string, { x: number; y: number; zIndex: number }> = {
  lucy: { x: 15, y: 25, zIndex: 10 },      // 左上 - 總指揮主位
  xiaocai: { x: 55, y: 25, zIndex: 10 },   // 右上 - 財經分析師
  axin: { x: 15, y: 55, zIndex: 20 },      // 左中 - 新聞編輯
  yanyan: { x: 55, y: 55, zIndex: 20 },    // 右中 - 研究員
  pangxie: { x: 15, y: 85, zIndex: 30 },   // 左下 - 社群小編
  xiaoguan: { x: 55, y: 85, zIndex: 30 },  // 右下 - 生活管家
};

type CharacterState = 'idle' | 'working' | 'happy' | 'tired' | 'alert';

function getCharacterState(char: Character, recentJobs?: OfficeSceneProps['recentJobs']): CharacterState {
  const hasError = recentJobs?.some(j => j.characterId === char.id && j.status === 'error');
  if (hasError) return 'alert';
  
  const completionRate = char.stats.completed / char.stats.tasks;
  if (completionRate >= 0.95) return 'happy';
  if (char.stats.workHours > 6) return 'tired';
  if (char.stats.tasks > 0) return 'working';
  return 'idle';
}

// 像素風格桌子組件
const PixelDesk: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div
    className="absolute"
    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
  >
    {/* 桌面 */}
    <div className="w-28 h-14 bg-gradient-to-b from-amber-600 to-amber-800 rounded-sm border-2 border-amber-900 shadow-lg relative">
      {/* 桌面紋理 */}
      <div className="absolute inset-1 bg-amber-700/30 rounded-sm" />
      {/* 電腦螢幕 */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-12 h-8 bg-gray-800 rounded-t border-2 border-gray-700">
        <div className="absolute inset-1 bg-gradient-to-br from-cyan-400/80 to-blue-600/80 rounded-sm animate-pulse" />
      </div>
      {/* 螢幕支架 */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-2 bg-gray-700" />
      {/* 鍵盤 */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-gray-600 rounded-sm border border-gray-500" />
      {/* 滑鼠 */}
      <div className="absolute top-3 right-3 w-2 h-3 bg-gray-500 rounded-full" />
      {/* 咖啡杯 */}
      <div className="absolute top-1 left-2 w-3 h-3 bg-white rounded-sm border border-gray-300">
        <div className="absolute top-0.5 left-0.5 w-2 h-1.5 bg-amber-800 rounded-sm" />
      </div>
    </div>
    {/* 椅子 */}
    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-10 h-6 bg-gray-700 rounded-t-lg border-2 border-gray-600" />
  </div>
);

// 單個角色組件
const CharacterSprite: React.FC<{
  character: Character;
  state: CharacterState;
  position: { x: number; y: number; zIndex: number };
  onClick?: () => void;
}> = ({ character, state, position, onClick }) => {
  const [bounce, setBounce] = useState(false);
  const [showVoice, setShowVoice] = useState(false);

  // 隨機觸發小動畫和語音氣泡
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setBounce(true);
        setTimeout(() => setBounce(false), 500);
      }
      if (Math.random() > 0.85) {
        setShowVoice(true);
        setTimeout(() => setShowVoice(false), 3000);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stateColors = {
    idle: 'border-gray-500 bg-gray-500',
    working: 'border-blue-400 bg-blue-400',
    happy: 'border-green-400 bg-green-400',
    tired: 'border-yellow-500 bg-yellow-500',
    alert: 'border-red-500 bg-red-500 animate-pulse',
  };

  const stateIcons = {
    idle: '💤',
    working: '💼',
    happy: '✨',
    tired: '😴',
    alert: '❗',
  };

  // 取得隨機語音
  const getRandomVoice = () => {
    const voiceKey = state === 'alert' ? 'tired' : state; // alert 沒有專屬語音，用 tired 替代
    const voices = character.voices?.[voiceKey as keyof typeof character.voices] || character.voices?.idle || [];
    return voices[Math.floor(Math.random() * voices.length)] || '';
  };

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-300 group
        ${bounce ? 'animate-bounce' : ''}
      `}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: position.zIndex,
      }}
      onClick={onClick}
    >
      {/* 語音氣泡 */}
      {showVoice && character.voices && (
        <div className="absolute left-1/2 bg-white text-gray-800 px-3 py-2 rounded-xl text-xs max-w-[150px] text-center shadow-lg z-50 whitespace-normal" style={{ top: '-200px', transform: 'translateX(50px)' }}>
          {getRandomVoice()}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45" />
        </div>
      )}

      {/* 角色頭像 */}
      <div className="relative">
        <div className={`
          w-14 h-14 rounded-xl overflow-hidden border-3 shadow-lg transition-all duration-300
          ${stateColors[state].split(' ')[0]}
          ${state === 'working' ? 'animate-pulse' : ''}
          group-hover:scale-110 group-hover:shadow-xl
        `}>
          <img
            src={character.avatar}
            alt={character.name}
            className="w-full h-full object-cover"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        
        {/* 狀態指示器 */}
        <div className={`
          absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs
          ${stateColors[state].split(' ')[1]} text-white shadow-md
        `}>
          {stateIcons[state]}
        </div>

        {/* 名字標籤 */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/90 px-2 py-0.5 rounded text-xs whitespace-nowrap flex items-center gap-1">
          <span>{character.emoji}</span>
          <span className="font-medium">{character.name}</span>
        </div>
      </div>

      {/* 工作中的光效 */}
      {state === 'working' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-blue-400/20 blur-xl animate-pulse -z-10" />
      )}
      
      {/* 警報光效 */}
      {state === 'alert' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-red-500/30 blur-xl animate-ping -z-10" />
      )}
    </div>
  );
};

// 窗戶組件 - 支援日夜變化
const Window: React.FC<{ 
  position: 'left' | 'right'; 
  theme: TimeTheme;
}> = ({ position, theme }) => {
  const positionClass = position === 'left' ? 'left-[5%]' : 'right-[5%]';
  
  return (
    <div className={`absolute top-[8%] ${positionClass} w-[18%] h-[22%] rounded border-4 border-amber-700 shadow-inner overflow-hidden`}>
      {/* 天空漸層 - 根據時間變化 */}
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.skyGradient} transition-all duration-1000`} />
      
      {/* 窗戶光暈效果 */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{ backgroundColor: theme.windowGlow }}
      />
      
      {/* 星星（夜晚才顯示）*/}
      {theme.stars && (
        <div className="absolute inset-0">
          <div className="absolute top-[15%] left-[20%] w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="absolute top-[25%] left-[60%] w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-300" />
          <div className="absolute top-[40%] left-[35%] w-1 h-1 bg-white rounded-full animate-pulse delay-700" />
          <div className="absolute top-[20%] left-[80%] w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-500" />
        </div>
      )}
      
      {/* 太陽/月亮 */}
      <div className="absolute top-[20%] right-[20%] text-lg drop-shadow-lg">
        {theme.sunMoon}
      </div>
      
      {/* 窗框 */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-amber-700" />
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-amber-700" />
      
      {/* 窗簾 */}
      <div className="absolute top-0 left-0 w-full h-3 bg-amber-100 border-b border-amber-300" />
    </div>
  );
};

// 天花板燈 - 夜間亮起
const CeilingLamp: React.FC<{ x: number; on: boolean }> = ({ x, on }) => (
  <div 
    className="absolute top-[32%]"
    style={{ left: `${x}%`, transform: 'translateX(-50%)' }}
  >
    {/* 燈座 */}
    <div className="w-3 h-2 bg-gray-600 rounded-b mx-auto" />
    {/* 燈罩 */}
    <div className={`w-8 h-4 rounded-b-full transition-all duration-500 ${
      on 
        ? 'bg-gradient-to-b from-yellow-200 to-yellow-400 shadow-[0_0_20px_rgba(253,224,71,0.6)]' 
        : 'bg-gray-400'
    }`} />
    {/* 光暈 */}
    {on && (
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-32 bg-gradient-to-b from-yellow-200/30 to-transparent rounded-full blur-md -z-10" />
    )}
  </div>
);

// 辦公室裝飾元素
const OfficeDecorations: React.FC<{ theme: TimeTheme }> = ({ theme }) => (
  <>
    {/* 窗戶 - 左右 */}
    <Window position="left" theme={theme} />
    <Window position="right" theme={theme} />

    {/* 天花板燈 */}
    <CeilingLamp x={25} on={theme.lampOn} />
    <CeilingLamp x={75} on={theme.lampOn} />

    {/* 白板 */}
    <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[25%] h-[18%] bg-white rounded border-4 border-gray-400 shadow-lg">
      <div className="absolute top-2 left-2 text-[8px] text-gray-600 font-mono">
        <div>📊 Tasks: 328</div>
        <div>✅ Done: 316</div>
        <div>📈 Rate: 96%</div>
      </div>
      <div className="absolute bottom-2 right-2 text-lg">📌</div>
      {/* 白板架 */}
      <div className="absolute -bottom-2 left-1/4 w-1 h-4 bg-gray-500" />
      <div className="absolute -bottom-2 right-1/4 w-1 h-4 bg-gray-500" />
    </div>

    {/* 植物們 */}
    <div className="absolute bottom-[5%] left-[3%] text-3xl drop-shadow-lg">🪴</div>
    <div className="absolute bottom-[5%] right-[3%] text-3xl drop-shadow-lg">🌿</div>
    <div className="absolute top-[35%] right-[3%] text-2xl drop-shadow-lg">🌱</div>
    
    {/* 書架 */}
    <div className="absolute top-[38%] left-[3%] w-[8%] h-[25%] bg-amber-800 rounded border-2 border-amber-900 flex flex-col justify-around p-1">
      <div className="h-3 bg-gradient-to-r from-red-600 to-red-800 rounded-sm" />
      <div className="h-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-sm" />
      <div className="h-3 bg-gradient-to-r from-green-600 to-green-800 rounded-sm" />
      <div className="h-3 bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-sm" />
    </div>

    {/* 時鐘 - 顯示真實時間 emoji */}
    <div className="absolute top-[5%] left-1/2 translate-x-[100%] w-8 h-8 bg-white rounded-full border-2 border-gray-600 flex items-center justify-center shadow-md">
      <div className="text-xs">{getClockEmoji(theme.hour)}</div>
    </div>

    {/* 咖啡機 */}
    <div className="absolute bottom-[15%] right-[8%] flex flex-col items-center">
      <div className="w-8 h-10 bg-gray-700 rounded-t border-2 border-gray-600">
        <div className="w-full h-2 bg-red-500 mt-1 mx-auto rounded" />
      </div>
      <div className="text-lg">☕</div>
    </div>

    {/* 地毯 */}
    <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[60%] h-[8%] bg-gradient-to-r from-purple-800 via-purple-600 to-purple-800 rounded-lg opacity-60 border-2 border-purple-900" />
    
    {/* 房間氛圍層 */}
    <div 
      className="absolute inset-0 pointer-events-none transition-all duration-1000"
      style={{ backgroundColor: theme.roomOverlay }}
    />
  </>
);

// 根據小時取得時鐘 emoji
function getClockEmoji(hour: number): string {
  const clocks = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚'];
  return clocks[hour % 12];
}

// 地板
const Floor: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* 地板基底 */}
    <div className="absolute inset-0 bg-gradient-to-b from-amber-100 to-amber-200" />
    {/* 木地板紋理 */}
    <div 
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 40px,
          rgba(139, 90, 43, 0.3) 40px,
          rgba(139, 90, 43, 0.3) 42px
        )`,
      }}
    />
    {/* 牆壁 */}
    <div className="absolute top-0 left-0 right-0 h-[35%] bg-gradient-to-b from-amber-50 to-amber-100 border-b-4 border-amber-300" />
  </div>
);

export const OfficeScene: React.FC<OfficeSceneProps> = ({ characters, recentJobs }) => {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const timeTheme = useTimeOfDay();

  // 工位位置
  const deskPositions = [
    { x: 25, y: 42 },  // 左上
    { x: 75, y: 42 },  // 右上
    { x: 25, y: 62 },  // 左中
    { x: 75, y: 62 },  // 右中
    { x: 25, y: 82 },  // 左下
    { x: 75, y: 82 },  // 右下
  ];

  return (
    <div className="relative w-full aspect-[16/9] bg-amber-100 rounded-xl border-4 border-amber-800 overflow-hidden shadow-2xl">
      {/* 地板和牆壁 */}
      <Floor />
      
      {/* 裝飾元素 - 根據時間變化 */}
      <OfficeDecorations theme={timeTheme} />
      
      {/* 桌子 */}
      {deskPositions.map((pos, i) => (
        <PixelDesk key={i} x={pos.x} y={pos.y} />
      ))}

      {/* 角色 */}
      {characters.map((char) => {
        const position = characterPositions[char.id];
        if (!position) return null;
        
        const state = getCharacterState(char, recentJobs);
        
        // 調整角色位置到桌子前面
        const adjustedPosition = {
          x: position.x === 15 ? 25 : 75,
          y: position.y === 25 ? 38 : position.y === 55 ? 58 : 78,
          zIndex: position.zIndex + 5,
        };
        
        return (
          <CharacterSprite
            key={char.id}
            character={char}
            state={state}
            position={adjustedPosition}
            onClick={() => setSelectedChar(char)}
          />
        );
      })}

      {/* 標題 - 含時間指示 */}
      <div className="absolute top-2 left-2 bg-gray-900/80 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 border border-gray-700">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span>LIVE</span>
        <span className="text-gray-400 text-xs">AI Office</span>
        <span className="text-base">{timeTheme.sunMoon}</span>
      </div>

      {/* 統計摘要 */}
      <div className="absolute top-2 right-2 bg-gray-900/80 px-3 py-1.5 rounded-lg text-xs flex items-center gap-3 border border-gray-700">
        <span>👥 {characters.length}</span>
        <span className="text-green-400">✅ {characters.reduce((sum, c) => sum + c.stats.completed, 0)}</span>
        <span className="text-cyan-400">💰 ${characters.reduce((sum, c) => sum + c.stats.savedAmount, 0).toLocaleString()}</span>
      </div>

      {/* 角色詳情彈窗 */}
      {selectedChar && (
        <div 
          className="absolute inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setSelectedChar(null)}
        >
          <div 
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border-2 border-gray-600 max-w-[320px] mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={selectedChar.avatar}
                alt={selectedChar.name}
                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-500"
                style={{ imageRendering: 'pixelated' }}
              />
              <div>
                <h3 className="font-bold text-xl flex items-center gap-2">
                  {selectedChar.emoji} {selectedChar.name}
                </h3>
                <p className="text-sm text-cyan-400">{selectedChar.title}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">{selectedChar.description}</p>
            
            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              <div className="bg-gray-700/50 rounded-lg p-2">
                <div className="text-cyan-400 font-bold text-lg">{selectedChar.stats.tasks}</div>
                <div className="text-gray-500 text-xs">任務</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-2">
                <div className="text-green-400 font-bold text-lg">
                  {Math.round(selectedChar.stats.completed / selectedChar.stats.tasks * 100)}%
                </div>
                <div className="text-gray-500 text-xs">完成率</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-2">
                <div className="text-yellow-400 font-bold text-lg">
                  ${selectedChar.stats.savedAmount.toLocaleString()}
                </div>
                <div className="text-gray-500 text-xs">節省</div>
              </div>
            </div>

            {/* 角色心聲 */}
            {selectedChar.voices && (
              <div className="bg-gray-700/30 rounded-lg p-3 mb-4">
                <div className="text-xs text-gray-400 mb-1">💬 最近心聲</div>
                <div className="text-sm italic">
                  "{selectedChar.voices.working?.[0] || selectedChar.voices.idle?.[0] || '...'}"
                </div>
              </div>
            )}
            
            <button 
              className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-sm font-bold hover:opacity-80 transition-opacity"
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
