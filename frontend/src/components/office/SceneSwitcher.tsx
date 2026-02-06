import React, { useState, useEffect } from 'react';
import type { Character } from '../../data/types';

type SceneType = 'normal' | 'busy' | 'relax' | 'celebrate' | 'night';
type CharacterStatus = 'working' | 'idle' | 'happy' | 'tired' | 'sleeping' | 'away' | 'walking';

// 走動目的地配置
const walkDestinations: Record<string, { x: number; y: number; emoji: string; label: string }> = {
  coffee: { x: 88, y: 45, emoji: '☕', label: '倒咖啡' },
  whiteboard: { x: 35, y: 35, emoji: '📊', label: '看白板' },
  window: { x: 10, y: 35, emoji: '🪟', label: '看風景' },
  chat_lucy: { x: 48, y: 68, emoji: '💬', label: '找 Lucy 聊天' },
  chat_xiaocai: { x: 32, y: 48, emoji: '💬', label: '找小財討論' },
  stretch: { x: 50, y: 55, emoji: '🙆', label: '伸懶腰' },
};

// 角色走動偏好（不同角色喜歡去的地方）
const characterWalkPreferences: Record<string, string[]> = {
  lucy: ['whiteboard', 'chat_xiaocai', 'coffee'],
  xiaocai: ['coffee', 'whiteboard', 'stretch'],
  axin: ['coffee', 'window', 'chat_lucy'],
  yanyan: ['coffee', 'whiteboard', 'stretch'],
  pangxie: ['coffee', 'chat_lucy', 'window'],
  xiaoguan: ['coffee', 'whiteboard', 'chat_lucy'],
};

interface SceneSwitcherProps {
  characters: Character[];
  recentJobs?: Array<{
    characterId: string;
    status: string;
    name?: string;
  }>;
}

// 角色在場景中的位置（基於圖片百分比）
const characterPositions: Record<string, { x: number; y: number }> = {
  lucy: { x: 44, y: 72 },      // Lucy 在中間前排
  xiaocai: { x: 28, y: 52 },   // 小財 在左邊多螢幕處
  axin: { x: 54, y: 42 },      // 阿新 站在中間
  yanyan: { x: 72, y: 48 },    // 研研 在右邊桌子
  pangxie: { x: 82, y: 68 },   // 螃蟹 在懶骨頭
  xiaoguan: { x: 14, y: 62 },  // 小管 在左下角
};

// 狀態配置
const statusConfig: Record<CharacterStatus, { emoji: string; label: string; color: string; animation?: string }> = {
  working: { emoji: '💼', label: '工作中', color: 'bg-blue-500', animation: 'animate-pulse' },
  idle: { emoji: '💤', label: '待命', color: 'bg-gray-500' },
  happy: { emoji: '✨', label: '完成！', color: 'bg-green-500', animation: 'animate-bounce' },
  tired: { emoji: '😴', label: '疲倦', color: 'bg-yellow-500' },
  sleeping: { emoji: '💤', label: 'zzZ', color: 'bg-purple-500' },
  away: { emoji: '🚪', label: '離開', color: 'bg-gray-600' },
  walking: { emoji: '🚶', label: '走動中', color: 'bg-cyan-500' },
};

// 走動中的角色狀態
interface WalkingCharacter {
  charId: string;
  destination: string;
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
  startTime: number;
  duration: number; // 毫秒
  returning: boolean;
}

// 互動類型
type InteractionType = 'task' | 'chat' | 'report' | 'help';

interface Interaction {
  id: string;
  from: string;
  to: string;
  type: InteractionType;
  message: string;
  emoji: string;
}

// 互動配置
const interactionConfig: Record<InteractionType, { emoji: string; color: string }> = {
  task: { emoji: '📋', color: 'bg-blue-400' },
  chat: { emoji: '💬', color: 'bg-green-400' },
  report: { emoji: '📊', color: 'bg-yellow-400' },
  help: { emoji: '🆘', color: 'bg-red-400' },
};

// 根據 recentJobs 生成互動
function generateInteractions(
  recentJobs?: SceneSwitcherProps['recentJobs']
): Interaction[] {
  if (!recentJobs || recentJobs.length === 0) return [];
  
  const interactions: Interaction[] = [];
  
  recentJobs.slice(0, 3).forEach((job, idx) => {
    // Lucy 派發任務給執行者
    if (job.characterId && job.characterId !== 'lucy') {
      interactions.push({
        id: `task-${idx}`,
        from: 'lucy',
        to: job.characterId,
        type: 'task',
        message: job.name || '新任務',
        emoji: '📋',
      });
    }
    
    // 執行者回報給 Lucy
    if (job.status === 'completed' && job.characterId !== 'lucy') {
      interactions.push({
        id: `report-${idx}`,
        from: job.characterId,
        to: 'lucy',
        type: 'report',
        message: '完成！',
        emoji: '✅',
      });
    }
  });
  
  return interactions.slice(0, 4); // 最多顯示 4 個互動
}

// 根據場景和數據判斷角色狀態
function getCharacterStatus(
  charId: string,
  scene: SceneType,
  character: Character,
  recentJobs?: SceneSwitcherProps['recentJobs']
): CharacterStatus {
  // 深夜場景特殊處理
  if (scene === 'night') {
    if (charId === 'yanyan') return 'working'; // 研研還在工作
    if (charId === 'lucy') return 'sleeping';   // Lucy 睡著了
    return 'away'; // 其他人都走了
  }

  // 慶祝場景
  if (scene === 'celebrate') {
    return 'happy';
  }

  // 休息場景
  if (scene === 'relax') {
    if (charId === 'xiaoguan') return 'working'; // 小管在泡咖啡
    return 'idle';
  }

  // 忙碌場景
  if (scene === 'busy') {
    return 'working';
  }

  // 正常場景 - 根據實際數據
  const isRunning = recentJobs?.some(j => j.characterId === charId && j.status === 'running');
  if (isRunning) return 'working';

  const completionRate = character.stats.completed / character.stats.tasks;
  if (completionRate >= 0.95) return 'happy';
  if (character.stats.workHours > 6) return 'tired';
  
  return 'working';
}

// 場景圖片路徑
const scenes: Record<SceneType, string> = {
  normal: '/scenes/scene-normal.png',
  busy: '/scenes/scene-busy.png',
  relax: '/scenes/scene-relax.png',
  celebrate: '/scenes/scene-celebrate.png',
  night: '/scenes/scene-night.png',
};

// 場景描述
const sceneLabels: Record<SceneType, { label: string; emoji: string; color: string }> = {
  normal: { label: '正常工作', emoji: '💼', color: 'bg-blue-500' },
  busy: { label: '忙碌高峰', emoji: '🔥', color: 'bg-red-500' },
  relax: { label: '輕鬆休息', emoji: '☕', color: 'bg-green-500' },
  celebrate: { label: '慶祝完成', emoji: '🎉', color: 'bg-yellow-500' },
  night: { label: '深夜模式', emoji: '🌙', color: 'bg-purple-500' },
};

// 根據狀態自動判斷場景
function determineScene(
  characters: Character[],
  recentJobs?: SceneSwitcherProps['recentJobs']
): SceneType {
  const now = new Date();
  const hour = now.getHours();

  // 深夜時段 (00:00 - 06:00)
  if (hour >= 0 && hour < 6) {
    return 'night';
  }

  // 計算整體完成率
  const totalTasks = characters.reduce((sum, c) => sum + c.stats.tasks, 0);
  const totalCompleted = characters.reduce((sum, c) => sum + c.stats.completed, 0);
  const completionRate = totalTasks > 0 ? totalCompleted / totalTasks : 0;

  // 檢查是否有錯誤/警報
  const hasErrors = recentJobs?.some(j => j.status === 'error');

  // 檢查正在執行的任務數
  const runningJobs = recentJobs?.filter(j => j.status === 'running').length || 0;

  // 完成率超高 -> 慶祝
  if (completionRate >= 0.98 && totalTasks > 50) {
    return 'celebrate';
  }

  // 多個任務同時執行 -> 忙碌
  if (runningJobs >= 3 || hasErrors) {
    return 'busy';
  }

  // 早上或下午茶時間 -> 輕鬆
  if ((hour >= 12 && hour < 13) || (hour >= 15 && hour < 16)) {
    return 'relax';
  }

  // 預設
  return 'normal';
}

// 飛行動畫組件
const FlyingInteraction: React.FC<{
  interaction: Interaction;
  index: number;
}> = ({ interaction, index }) => {
  const fromPos = characterPositions[interaction.from];
  const toPos = characterPositions[interaction.to];
  
  if (!fromPos || !toPos) return null;
  
  const config = interactionConfig[interaction.type];
  
  return (
    <div
      className="absolute pointer-events-none z-30"
      style={{
        left: `${fromPos.x}%`,
        top: `${fromPos.y - 5}%`,
        animation: `fly-to-target-${index} 3s ease-in-out infinite`,
        animationDelay: `${index * 1.5}s`,
      }}
    >
      <style>
        {`
          @keyframes fly-to-target-${index} {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            50% {
              transform: translate(${(toPos.x - fromPos.x) * 0.5}%, ${(toPos.y - fromPos.y) * 0.5 - 10}%) scale(1.2);
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translate(${(toPos.x - fromPos.x)}%, ${(toPos.y - fromPos.y) - 5}%) scale(0.8);
              opacity: 0;
            }
          }
        `}
      </style>
      <div className={`${config.color} px-2 py-1 rounded-full text-white text-sm font-bold shadow-lg flex items-center gap-1`}>
        <span>{interaction.emoji}</span>
      </div>
    </div>
  );
};

// 對話氣泡組件 - 已停用
// const ChatBubble: React.FC<{
//   charId: string;
//   message: string;
//   delay: number;
// }> = ({ charId, message, delay }) => { ... };

// 走動角色組件
const WalkingCharacterSprite: React.FC<{
  walking: WalkingCharacter;
  character: Character;
}> = ({ walking, character }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - walking.startTime;
      const newProgress = Math.min(elapsed / walking.duration, 1);
      setProgress(newProgress);
      
      if (newProgress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [walking]);
  
  // 計算當前位置（使用 ease-in-out）
  const easeProgress = progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  
  const currentX = walking.startPos.x + (walking.endPos.x - walking.startPos.x) * easeProgress;
  const currentY = walking.startPos.y + (walking.endPos.y - walking.startPos.y) * easeProgress;
  
  const destination = walkDestinations[walking.destination];
  
  return (
    <div
      className="absolute pointer-events-none z-35 transition-none"
      style={{
        left: `${currentX}%`,
        top: `${currentY}%`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      {/* 角色走動動畫 */}
      <div className="relative animate-bounce" style={{ animationDuration: '0.5s' }}>
        {/* 走動目的地提示 */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-cyan-500 px-2 py-1 rounded-lg text-white text-xs font-bold shadow-lg flex items-center gap-1 whitespace-nowrap">
          <span>{destination?.emoji || '🚶'}</span>
          <span className="hidden sm:inline">{destination?.label || '走動中'}</span>
        </div>
        {/* 角色頭像 */}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-400 shadow-lg bg-white">
          <img
            src={character.avatar}
            alt={character.name}
            className="w-full h-full object-cover"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        {/* 走動軌跡 */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
          <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
          <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};

export const SceneSwitcher: React.FC<SceneSwitcherProps> = ({ characters, recentJobs }) => {
  const [currentScene, setCurrentScene] = useState<SceneType>('normal');
  const [isManual, setIsManual] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [walkingCharacters, setWalkingCharacters] = useState<WalkingCharacter[]>([]);

  // 自動判斷場景（如果不是手動模式）
  useEffect(() => {
    if (!isManual) {
      const scene = determineScene(characters, recentJobs);
      setCurrentScene(scene);
    }
  }, [characters, recentJobs, isManual]);

  // 每分鐘檢查一次（用於深夜模式）
  useEffect(() => {
    if (!isManual) {
      const interval = setInterval(() => {
        const scene = determineScene(characters, recentJobs);
        setCurrentScene(scene);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [characters, recentJobs, isManual]);

  // 更新互動動畫
  useEffect(() => {
    const newInteractions = generateInteractions(recentJobs);
    setInteractions(newInteractions);
  }, [recentJobs]);

  // 隨機觸發角色走動（每 8-15 秒隨機一個角色去走動）
  useEffect(() => {
    // 只在正常和輕鬆場景啟用走動
    if (currentScene !== 'normal' && currentScene !== 'relax') return;
    
    const triggerWalk = () => {
      // 隨機選一個沒在走動的角色
      const availableChars = characters.filter(
        c => !walkingCharacters.some(w => w.charId === c.id)
      );
      if (availableChars.length === 0) return;
      
      const randomChar = availableChars[Math.floor(Math.random() * availableChars.length)];
      const preferences = characterWalkPreferences[randomChar.id] || ['coffee'];
      const destination = preferences[Math.floor(Math.random() * preferences.length)];
      const destPos = walkDestinations[destination];
      const startPos = characterPositions[randomChar.id];
      
      if (!destPos || !startPos) return;
      
      const walkDuration = 3000; // 3 秒走到目的地
      const stayDuration = 2000; // 停留 2 秒
      
      // 開始走動
      const newWalking: WalkingCharacter = {
        charId: randomChar.id,
        destination,
        startPos,
        endPos: destPos,
        startTime: Date.now(),
        duration: walkDuration,
        returning: false,
      };
      
      setWalkingCharacters(prev => [...prev, newWalking]);
      
      // 到達後停留，然後返回
      setTimeout(() => {
        setWalkingCharacters(prev => 
          prev.map(w => 
            w.charId === randomChar.id
              ? { ...w, startPos: destPos, endPos: startPos, startTime: Date.now(), returning: true }
              : w
          )
        );
        
        // 返回後移除
        setTimeout(() => {
          setWalkingCharacters(prev => prev.filter(w => w.charId !== randomChar.id));
        }, walkDuration);
      }, walkDuration + stayDuration);
    };
    
    // 初始延遲 + 定期觸發
    const initialDelay = setTimeout(triggerWalk, 3000);
    const interval = setInterval(triggerWalk, 10000 + Math.random() * 5000);
    
    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [currentScene, characters, walkingCharacters]);

  // 場景對話配置 - 已停用
  // const sceneChats = { ... };

  const handleSceneChange = (scene: SceneType) => {
    setCurrentScene(scene);
    setIsManual(true);
    setShowSelector(false);
  };

  const handleAutoMode = () => {
    setIsManual(false);
    setShowSelector(false);
  };

  const sceneInfo = sceneLabels[currentScene];

  return (
    <div className="relative w-full overflow-hidden rounded-xl border-2 border-[#3a2a1a] shadow-2xl">
      {/* 場景控制面板 */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <div className={`${sceneInfo.color} px-3 py-1.5 rounded-lg text-white text-sm font-bold flex items-center gap-2 shadow-lg`}>
          <span className="text-base">{sceneInfo.emoji}</span>
          <span>{sceneInfo.label}</span>
          {!isManual && <span className="text-xs opacity-70">(自動)</span>}
        </div>
        
        <button
          onClick={() => setShowSelector(!showSelector)}
          className="bg-black/50 hover:bg-black/70 px-2 py-1.5 rounded-lg text-white text-xs transition-colors"
        >
          切換場景
        </button>
      </div>

      {/* 場景選擇器 */}
      {showSelector && (
        <div className="absolute top-14 left-3 z-30 bg-[#1a1a2e] border border-[#3a3a5e] rounded-lg p-2 shadow-xl">
          <div className="text-xs text-gray-400 mb-2 px-2">選擇場景</div>
          {(Object.keys(scenes) as SceneType[]).map((scene) => (
            <button
              key={scene}
              onClick={() => handleSceneChange(scene)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                currentScene === scene
                  ? 'bg-[#2a2a4e] text-white'
                  : 'hover:bg-[#2a2a4e]/50 text-gray-300'
              }`}
            >
              <span>{sceneLabels[scene].emoji}</span>
              <span>{sceneLabels[scene].label}</span>
              {currentScene === scene && <span className="ml-auto text-green-400">✓</span>}
            </button>
          ))}
          <div className="border-t border-[#3a3a5e] mt-2 pt-2">
            <button
              onClick={handleAutoMode}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                !isManual
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'hover:bg-[#2a2a4e]/50 text-gray-400'
              }`}
            >
              <span>🤖</span>
              <span>自動模式</span>
              {!isManual && <span className="ml-auto text-green-400">✓</span>}
            </button>
          </div>
        </div>
      )}

      {/* 右上角統計 */}
      <div className="absolute top-3 right-3 z-20 bg-black/50 px-3 py-1.5 rounded-lg text-white text-xs flex items-center gap-3">
        <span>👥 {characters.length}</span>
        <span>✅ {characters.reduce((sum, c) => sum + c.stats.completed, 0)}</span>
        <span>💰 ${Math.round(characters.reduce((sum, c) => sum + c.stats.savedAmount, 0) / 1000)}K</span>
      </div>

      {/* 場景圖片 */}
      <img
        src={scenes[currentScene]}
        alt={`AI Office - ${sceneInfo.label}`}
        className="w-full h-auto transition-opacity duration-500"
      />

      {/* 飛行互動動畫 (任務派發/回報) */}
      {interactions.map((interaction, idx) => (
        <FlyingInteraction key={interaction.id} interaction={interaction} index={idx} />
      ))}

      {/* 走動中的角色 */}
      {walkingCharacters.map((walking) => {
        const character = characters.find(c => c.id === walking.charId);
        if (!character) return null;
        return (
          <WalkingCharacterSprite
            key={`walking-${walking.charId}`}
            walking={walking}
            character={character}
          />
        );
      })}

      {/* 角色狀態氣泡（排除走動中的角色） */}
      {characters.map((char) => {
        const pos = characterPositions[char.id];
        if (!pos) return null;
        
        // 如果角色正在走動，不顯示狀態氣泡
        const isWalking = walkingCharacters.some(w => w.charId === char.id);
        if (isWalking) return null;
        
        const status = getCharacterStatus(char.id, currentScene, char, recentJobs);
        const config = statusConfig[status];
        
        // 深夜場景中離開的角色不顯示
        if (status === 'away') return null;
        
        return (
          <div
            key={char.id}
            className="absolute pointer-events-none"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {/* 狀態氣泡 */}
            <div className={`${config.color} ${config.animation || ''} px-2 py-1 rounded-lg text-white text-xs font-bold shadow-lg flex items-center gap-1 whitespace-nowrap`}>
              <span>{config.emoji}</span>
              <span className="hidden sm:inline">{config.label}</span>
            </div>
            {/* 小箭頭 */}
            <div 
              className={`${config.color} w-2 h-2 rotate-45 mx-auto -mt-1`}
              style={{ marginLeft: 'calc(50% - 4px)' }}
            />
          </div>
        );
      })}

      {/* 點擊提示 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 px-3 py-1 rounded-full text-white/60 text-xs">
        💡 角色已融入場景中 | 狀態即時更新
      </div>
    </div>
  );
};

export default SceneSwitcher;
