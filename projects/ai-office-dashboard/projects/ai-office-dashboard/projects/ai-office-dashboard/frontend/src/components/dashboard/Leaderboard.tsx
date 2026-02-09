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
      <div className="p-3 sm:p-4 border-b border-[#0f3460]">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          🏆 員工排行榜
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead className="bg-[#1a1a2e]">
            <tr className="text-gray-400 text-[10px] sm:text-xs md:text-sm">
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">排名</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">員工</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-right">任務</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-right hidden sm:table-cell">完成</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-right">節省</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-right hidden md:table-cell">工時</th>
            </tr>
          </thead>
          <tbody>
            {sortedCharacters.map((char, index) => (
              <tr 
                key={char.id}
                className="border-t border-[#0f3460] hover:bg-[#1a1a2e] transition-colors"
              >
                <td className="py-2 sm:py-3 px-2 sm:px-4">
                  <span className={`
                    w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-sm font-bold
                    ${index === 0 ? 'bg-yellow-500 text-black' : ''}
                    ${index === 1 ? 'bg-gray-400 text-black' : ''}
                    ${index === 2 ? 'bg-amber-600 text-white' : ''}
                    ${index > 2 ? 'bg-[#0f3460] text-gray-400' : ''}
                  `}>
                    {index + 1}
                  </span>
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img 
                      src={char.avatar} 
                      alt={char.name}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded object-cover flex-shrink-0"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <div className="min-w-0">
                      <span className="text-white font-medium text-xs sm:text-sm">{char.name}</span>
                      <span className="ml-1 sm:ml-2">{char.emoji}</span>
                    </div>
                  </div>
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-[#00d9ff] text-xs sm:text-sm">
                  {char.stats.tasks}
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-[#00ff88] text-xs sm:text-sm hidden sm:table-cell">
                  {char.stats.completed}
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-[#ffaa00] font-bold text-xs sm:text-sm">
                  <span className="hidden sm:inline">NT$</span>
                  <span className="sm:hidden">$</span>
                  {char.stats.savedAmount.toLocaleString()}
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-gray-400 text-xs sm:text-sm hidden md:table-cell">
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
