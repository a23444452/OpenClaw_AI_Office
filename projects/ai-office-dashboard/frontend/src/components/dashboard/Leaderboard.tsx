import React from 'react';
import type { Character } from '../../data/types';

interface LeaderboardProps {
  characters: Character[];
  sortBy?: 'savedAmount' | 'tasks' | 'workHours';
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ 
  characters, 
  sortBy = 'savedAmount' 
}) => {
  const sortedCharacters = [...characters].sort((a, b) => {
    return b.stats[sortBy] - a.stats[sortBy];
  });

  return (
    <div className="bg-[#16213e] rounded-xl border border-[#0f3460] overflow-hidden">
      <div className="p-4 border-b border-[#0f3460]">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          🏆 員工排行榜
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1a1a2e]">
            <tr className="text-gray-400 text-sm">
              <th className="py-3 px-4 text-left">排名</th>
              <th className="py-3 px-4 text-left">員工</th>
              <th className="py-3 px-4 text-right">任務</th>
              <th className="py-3 px-4 text-right">完成</th>
              <th className="py-3 px-4 text-right">節省金額</th>
              <th className="py-3 px-4 text-right">工時</th>
            </tr>
          </thead>
          <tbody>
            {sortedCharacters.map((char, index) => (
              <tr 
                key={char.id}
                className="border-t border-[#0f3460] hover:bg-[#1a1a2e] transition-colors"
              >
                <td className="py-3 px-4">
                  <span className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                    ${index === 0 ? 'bg-yellow-500 text-black' : ''}
                    ${index === 1 ? 'bg-gray-400 text-black' : ''}
                    ${index === 2 ? 'bg-amber-600 text-white' : ''}
                    ${index > 2 ? 'bg-[#0f3460] text-gray-400' : ''}
                  `}>
                    {index + 1}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={char.avatar} 
                      alt={char.name}
                      className="w-8 h-8 rounded object-cover"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <div>
                      <span className="text-white font-medium">{char.name}</span>
                      <span className="ml-2">{char.emoji}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-right text-[#00d9ff]">
                  {char.stats.tasks}
                </td>
                <td className="py-3 px-4 text-right text-[#00ff88]">
                  {char.stats.completed}
                </td>
                <td className="py-3 px-4 text-right text-[#ffaa00] font-bold">
                  NT${char.stats.savedAmount.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right text-gray-400">
                  {char.stats.workHours}h
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
