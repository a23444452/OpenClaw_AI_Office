import React, { useState } from 'react';
import type { Character } from '../../data/types';

interface IsometricSVGOfficeProps {
  characters: Character[];
  recentJobs?: Array<{
    characterId: string;
    status: string;
  }>;
}

// 等距視角轉換函數（保留供未來使用）
const _isoTransform = (x: number, y: number, z: number = 0) => {
  // 等距投影：30度角
  const isoX = (x - y) * Math.cos(Math.PI / 6);
  const isoY = (x + y) * Math.sin(Math.PI / 6) - z;
  return { x: isoX, y: isoY };
};
void _isoTransform; // 標記為故意保留

// 角色位置配置（網格座標）（保留供未來使用）
const _characterGridPositions: Record<string, { gridX: number; gridY: number }> = {
  lucy: { gridX: 1, gridY: 1 },      // 左前
  xiaocai: { gridX: 3, gridY: 1 },   // 右前
  axin: { gridX: 1, gridY: 2 },      // 左中
  yanyan: { gridX: 3, gridY: 2 },    // 右中
  pangxie: { gridX: 1, gridY: 3 },   // 左後
  xiaoguan: { gridX: 3, gridY: 3 },  // 右後
};
void _characterGridPositions; // 標記為故意保留

type CharacterState = 'idle' | 'working' | 'happy' | 'tired' | 'alert';

function getCharacterState(char: Character, recentJobs?: IsometricSVGOfficeProps['recentJobs']): CharacterState {
  const hasError = recentJobs?.some(j => j.characterId === char.id && j.status === 'error');
  if (hasError) return 'alert';
  const completionRate = char.stats.completed / char.stats.tasks;
  if (completionRate >= 0.95) return 'happy';
  if (char.stats.workHours > 6) return 'tired';
  if (char.stats.tasks > 0) return 'working';
  return 'idle';
}

const stateColors: Record<CharacterState, string> = {
  idle: '#6b7280',
  working: '#3b82f6',
  happy: '#22c55e',
  tired: '#eab308',
  alert: '#ef4444',
};

const stateEmojis: Record<CharacterState, string> = {
  idle: '💤',
  working: '💼',
  happy: '✨',
  tired: '😴',
  alert: '❗',
};

// 等距地板磚（保留供未來使用）
const _IsoFloorTile: React.FC<{ x: number; y: number; size: number; color?: string }> = ({ 
  x, y, size, color = '#d4a574' 
}) => {
  const halfSize = size / 2;
  const points = [
    `${x},${y - halfSize * 0.5}`,           // 上
    `${x + halfSize},${y}`,                  // 右
    `${x},${y + halfSize * 0.5}`,           // 下
    `${x - halfSize},${y}`,                  // 左
  ].join(' ');
  
  return (
    <polygon 
      points={points} 
      fill={color}
      stroke="#b8956e"
      strokeWidth="1"
    />
  );
};
void _IsoFloorTile; // 標記為故意保留

// 等距桌子
const IsoDesk: React.FC<{ x: number; y: number; hasComputer?: boolean }> = ({ x, y, hasComputer = true }) => {
  const deskWidth = 50;
  const deskHeight = 8;
  const deskDepth = 30;
  
  return (
    <g>
      {/* 桌面 */}
      <polygon
        points={`
          ${x},${y - deskHeight}
          ${x + deskWidth/2},${y - deskHeight + deskDepth/4}
          ${x},${y - deskHeight + deskDepth/2}
          ${x - deskWidth/2},${y - deskHeight + deskDepth/4}
        `}
        fill="#8B5A2B"
        stroke="#5D3A1A"
        strokeWidth="1"
      />
      {/* 桌子前面 */}
      <polygon
        points={`
          ${x - deskWidth/2},${y - deskHeight + deskDepth/4}
          ${x},${y - deskHeight + deskDepth/2}
          ${x},${y + deskDepth/2}
          ${x - deskWidth/2},${y + deskDepth/4}
        `}
        fill="#6B4423"
        stroke="#5D3A1A"
        strokeWidth="1"
      />
      {/* 桌子側面 */}
      <polygon
        points={`
          ${x},${y - deskHeight + deskDepth/2}
          ${x + deskWidth/2},${y - deskHeight + deskDepth/4}
          ${x + deskWidth/2},${y + deskDepth/4}
          ${x},${y + deskDepth/2}
        `}
        fill="#7B4A23"
        stroke="#5D3A1A"
        strokeWidth="1"
      />
      
      {/* 電腦螢幕 */}
      {hasComputer && (
        <g>
          {/* 螢幕 */}
          <rect
            x={x - 12}
            y={y - deskHeight - 25}
            width={24}
            height={18}
            rx={2}
            fill="#1a1a2e"
            stroke="#333"
            strokeWidth="2"
          />
          {/* 螢幕內容 */}
          <rect
            x={x - 10}
            y={y - deskHeight - 23}
            width={20}
            height={14}
            rx={1}
            fill="#0ea5e9"
            opacity={0.8}
          >
            <animate
              attributeName="opacity"
              values="0.6;0.9;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </rect>
          {/* 螢幕支架 */}
          <rect
            x={x - 3}
            y={y - deskHeight - 7}
            width={6}
            height={5}
            fill="#333"
          />
          {/* 螢幕底座 */}
          <ellipse
            cx={x}
            cy={y - deskHeight - 2}
            rx={8}
            ry={3}
            fill="#333"
          />
        </g>
      )}
    </g>
  );
};

// 等距椅子
const IsoChair: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    {/* 座墊 */}
    <ellipse
      cx={x}
      cy={y + 15}
      rx={12}
      ry={6}
      fill="#4a4a4a"
      stroke="#333"
      strokeWidth="1"
    />
    {/* 椅背 */}
    <rect
      x={x - 10}
      y={y - 5}
      width={20}
      height={18}
      rx={3}
      fill="#3a3a3a"
      stroke="#333"
      strokeWidth="1"
    />
  </g>
);

// 等距植物
const IsoPlant: React.FC<{ x: number; y: number; type?: 'pot' | 'tall' }> = ({ x, y, type = 'pot' }) => (
  <g>
    {/* 花盆 */}
    <polygon
      points={`${x - 8},${y - 5} ${x + 8},${y - 5} ${x + 6},${y + 8} ${x - 6},${y + 8}`}
      fill="#c2703a"
      stroke="#8B4513"
      strokeWidth="1"
    />
    {/* 植物 */}
    {type === 'pot' ? (
      <>
        <ellipse cx={x} cy={y - 8} rx={10} ry={6} fill="#228B22" />
        <ellipse cx={x - 5} cy={y - 12} rx={6} ry={4} fill="#2ecc71" />
        <ellipse cx={x + 5} cy={y - 14} rx={7} ry={5} fill="#27ae60" />
      </>
    ) : (
      <>
        <rect x={x - 2} y={y - 40} width={4} height={35} fill="#228B22" />
        <ellipse cx={x} cy={y - 45} rx={15} ry={12} fill="#2ecc71" />
        <ellipse cx={x - 8} cy={y - 35} rx={10} ry={8} fill="#27ae60" />
        <ellipse cx={x + 8} cy={y - 38} rx={10} ry={8} fill="#228B22" />
      </>
    )}
  </g>
);

// 等距書架
const IsoBookshelf: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    {/* 書架主體 */}
    <rect x={x - 20} y={y - 60} width={40} height={60} fill="#8B5A2B" stroke="#5D3A1A" strokeWidth="2" />
    {/* 層板 */}
    {[0, 1, 2].map(i => (
      <g key={i}>
        <rect x={x - 18} y={y - 55 + i * 20} width={36} height={3} fill="#6B4423" />
        {/* 書籍 */}
        <rect x={x - 16 + i * 8} y={y - 52 + i * 20} width={6} height={15} fill={['#e74c3c', '#3498db', '#2ecc71'][i]} />
        <rect x={x - 8 + i * 4} y={y - 52 + i * 20} width={5} height={15} fill={['#9b59b6', '#f39c12', '#1abc9c'][i]} />
        <rect x={x + i * 2} y={y - 52 + i * 20} width={7} height={15} fill={['#e67e22', '#16a085', '#8e44ad'][i]} />
      </g>
    ))}
  </g>
);

// 等距窗戶
const IsoWindow: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    {/* 窗框 */}
    <rect x={x - 25} y={y - 50} width={50} height={40} fill="#5D3A1A" stroke="#3D2A1A" strokeWidth="2" rx="2" />
    {/* 玻璃 */}
    <rect x={x - 22} y={y - 47} width={20} height={34} fill="#87CEEB" opacity="0.7" />
    <rect x={x + 2} y={y - 47} width={20} height={34} fill="#87CEEB" opacity="0.7" />
    {/* 窗格 */}
    <line x1={x} y1={y - 47} x2={x} y2={y - 13} stroke="#5D3A1A" strokeWidth="3" />
    <line x1={x - 22} y1={y - 30} x2={x - 2} y2={y - 30} stroke="#5D3A1A" strokeWidth="2" />
    <line x1={x + 2} y1={y - 30} x2={x + 22} y2={y - 30} stroke="#5D3A1A" strokeWidth="2" />
    {/* 光效 */}
    <rect x={x - 20} y={y - 45} width={8} height={15} fill="white" opacity="0.3" />
  </g>
);

// 等距白板
const IsoWhiteboard: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    {/* 白板 */}
    <rect x={x - 35} y={y - 45} width={70} height={45} fill="white" stroke="#666" strokeWidth="2" rx="2" />
    {/* 內容 */}
    <text x={x - 28} y={y - 32} fontSize="8" fill="#333">📊 Tasks: 328</text>
    <text x={x - 28} y={y - 22} fontSize="8" fill="#22c55e">✅ Done: 96%</text>
    <text x={x - 28} y={y - 12} fontSize="8" fill="#3b82f6">💰 Saved: $8K</text>
    {/* 磁鐵 */}
    <circle cx={x + 25} cy={y - 38} r={4} fill="#ef4444" />
    <circle cx={x + 25} cy={y - 25} r={4} fill="#3b82f6" />
  </g>
);

// SVG 角色
const SVGCharacter: React.FC<{
  character: Character;
  x: number;
  y: number;
  state: CharacterState;
  onClick?: () => void;
}> = ({ character, x, y, state, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const color = stateColors[state];
  
  // 角色顏色配置
  const charColors: Record<string, { hair: string; shirt: string }> = {
    lucy: { hair: '#a78bfa', shirt: '#6ee7b7' },      // 紫髮、薄荷綠
    xiaocai: { hair: '#78716c', shirt: '#93c5fd' },   // 棕髮、藍襯衫
    axin: { hair: '#38bdf8', shirt: '#86efac' },      // 藍髮、綠外套
    yanyan: { hair: '#92400e', shirt: '#a16207' },    // 棕髮、棕毛衣
    pangxie: { hair: '#fb923c', shirt: '#c084fc' },   // 橘髮、紫外套
    xiaoguan: { hair: '#78716c', shirt: '#d4a574' },  // 棕髮、米色
  };
  
  const colors = charColors[character.id] || { hair: '#666', shirt: '#888' };

  return (
    <g 
      onClick={onClick} 
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 光環效果 */}
      {(state === 'working' || state === 'alert') && (
        <ellipse
          cx={x}
          cy={y + 10}
          rx={25}
          ry={12}
          fill={color}
          opacity={0.3}
        >
          <animate
            attributeName="opacity"
            values="0.2;0.4;0.2"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </ellipse>
      )}
      
      {/* 身體 */}
      <ellipse
        cx={x}
        cy={y + 5}
        rx={12}
        ry={8}
        fill={colors.shirt}
        stroke="#333"
        strokeWidth="1"
      />
      
      {/* 頭 */}
      <circle
        cx={x}
        cy={y - 12}
        r={14}
        fill="#fcd5b8"
        stroke="#e5b89a"
        strokeWidth="1"
      />
      
      {/* 頭髮 */}
      <ellipse
        cx={x}
        cy={y - 18}
        rx={13}
        ry={10}
        fill={colors.hair}
      />
      <ellipse
        cx={x - 8}
        cy={y - 14}
        rx={5}
        ry={8}
        fill={colors.hair}
      />
      <ellipse
        cx={x + 8}
        cy={y - 14}
        rx={5}
        ry={8}
        fill={colors.hair}
      />
      
      {/* 眼睛 */}
      <circle cx={x - 4} cy={y - 12} r={2} fill="#333" />
      <circle cx={x + 4} cy={y - 12} r={2} fill="#333" />
      
      {/* 嘴巴 */}
      {state === 'happy' ? (
        <path d={`M ${x - 4} ${y - 6} Q ${x} ${y - 3} ${x + 4} ${y - 6}`} stroke="#333" fill="none" strokeWidth="1.5" />
      ) : state === 'tired' ? (
        <line x1={x - 3} y1={y - 6} x2={x + 3} y2={y - 6} stroke="#333" strokeWidth="1.5" />
      ) : (
        <path d={`M ${x - 3} ${y - 7} Q ${x} ${y - 5} ${x + 3} ${y - 7}`} stroke="#333" fill="none" strokeWidth="1" />
      )}
      
      {/* 狀態指示器 */}
      <circle
        cx={x + 12}
        cy={y - 22}
        r={8}
        fill={color}
        stroke="white"
        strokeWidth="2"
      >
        {state === 'alert' && (
          <animate
            attributeName="r"
            values="8;10;8"
            dur="0.5s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      <text
        x={x + 12}
        y={y - 18}
        fontSize="8"
        textAnchor="middle"
        fill="white"
      >
        {stateEmojis[state]}
      </text>
      
      {/* 名字標籤 */}
      <g opacity={isHovered ? 1 : 0.9}>
        <rect
          x={x - 25}
          y={y + 18}
          width={50}
          height={18}
          rx={4}
          fill="rgba(0,0,0,0.8)"
        />
        <text
          x={x}
          y={y + 30}
          fontSize="10"
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
        >
          {character.emoji} {character.name}
        </text>
      </g>
      
      {/* Hover 效果 */}
      {isHovered && (
        <circle
          cx={x}
          cy={y}
          r={30}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.5"
        />
      )}
    </g>
  );
};

export const IsometricSVGOffice: React.FC<IsometricSVGOfficeProps> = ({ characters, recentJobs }) => {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  
  const svgWidth = 800;
  const svgHeight = 500;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  
  // 工位位置（SVG 座標）
  const workstationPositions = [
    { x: centerX - 180, y: centerY - 40 },   // 左前
    { x: centerX + 80, y: centerY - 40 },    // 右前
    { x: centerX - 180, y: centerY + 60 },   // 左中
    { x: centerX + 80, y: centerY + 60 },    // 右中
    { x: centerX - 180, y: centerY + 160 },  // 左後
    { x: centerX + 80, y: centerY + 160 },   // 右後
  ];
  
  const characterOrder = ['lucy', 'xiaocai', 'axin', 'yanyan', 'pangxie', 'xiaoguan'];

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto rounded-xl border-4 border-amber-800 shadow-2xl"
        style={{ background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 50%, #d4a574 100%)' }}
      >
        {/* 定義漸層 */}
        <defs>
          <linearGradient id="floorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4a574" />
            <stop offset="100%" stopColor="#b8956e" />
          </linearGradient>
          <linearGradient id="wallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
        </defs>
        
        {/* 牆壁背景 */}
        <rect x="0" y="0" width={svgWidth} height={svgHeight * 0.45} fill="url(#wallGradient)" />
        
        {/* 地板 */}
        <rect x="0" y={svgHeight * 0.45} width={svgWidth} height={svgHeight * 0.55} fill="url(#floorGradient)" />
        
        {/* 地板線條 */}
        {[...Array(10)].map((_, i) => (
          <line
            key={`floor-h-${i}`}
            x1="0"
            y1={svgHeight * 0.45 + i * 30}
            x2={svgWidth}
            y2={svgHeight * 0.45 + i * 30}
            stroke="#c4956e"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}
        {[...Array(15)].map((_, i) => (
          <line
            key={`floor-v-${i}`}
            x1={i * 60}
            y1={svgHeight * 0.45}
            x2={i * 60}
            y2={svgHeight}
            stroke="#c4956e"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}
        
        {/* 窗戶 */}
        <IsoWindow x={150} y={180} />
        <IsoWindow x={650} y={180} />
        
        {/* 白板 */}
        <IsoWhiteboard x={400} y={180} />
        
        {/* 書架 */}
        <IsoBookshelf x={60} y={350} />
        
        {/* 植物 */}
        <IsoPlant x={730} y={250} type="tall" />
        <IsoPlant x={50} y={450} type="pot" />
        <IsoPlant x={750} y={450} type="pot" />
        
        {/* 工位（桌子 + 椅子） */}
        {workstationPositions.map((pos, i) => (
          <g key={`workstation-${i}`}>
            <IsoDesk x={pos.x} y={pos.y} />
            <IsoChair x={pos.x} y={pos.y + 35} />
          </g>
        ))}
        
        {/* 角色 */}
        {characterOrder.map((charId, i) => {
          const character = characters.find(c => c.id === charId);
          if (!character) return null;
          
          const pos = workstationPositions[i];
          const state = getCharacterState(character, recentJobs);
          
          return (
            <SVGCharacter
              key={charId}
              character={character}
              x={pos.x}
              y={pos.y + 25}
              state={state}
              onClick={() => setSelectedChar(character)}
            />
          );
        })}
        
        {/* 標題 */}
        <g>
          <rect x="10" y="10" width="120" height="30" rx="6" fill="rgba(0,0,0,0.7)" />
          <circle cx="25" cy="25" r="5" fill="#ef4444">
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
          </circle>
          <text x="38" y="30" fontSize="14" fill="white" fontWeight="bold">LIVE</text>
          <text x="75" y="30" fontSize="10" fill="#9ca3af">AI Office</text>
        </g>
        
        {/* 統計 */}
        <g>
          <rect x={svgWidth - 180} y="10" width="170" height="30" rx="6" fill="rgba(0,0,0,0.7)" />
          <text x={svgWidth - 170} y="30" fontSize="11" fill="white">
            👥 6  
            <tspan fill="#22c55e"> ✅ {characters.reduce((sum, c) => sum + c.stats.completed, 0)}</tspan>
            <tspan fill="#38bdf8"> 💰 ${Math.round(characters.reduce((sum, c) => sum + c.stats.savedAmount, 0) / 1000)}K</tspan>
          </text>
        </g>
      </svg>
      
      {/* 角色詳情彈窗 */}
      {selectedChar && (
        <div 
          className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 rounded-xl"
          onClick={() => setSelectedChar(null)}
        >
          <div 
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border-2 border-gray-600 max-w-[320px] mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                style={{ 
                  background: `linear-gradient(135deg, ${stateColors[getCharacterState(selectedChar, recentJobs)]}, #333)` 
                }}
              >
                {selectedChar.emoji}
              </div>
              <div>
                <h3 className="font-bold text-xl">{selectedChar.name}</h3>
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

export default IsometricSVGOffice;
