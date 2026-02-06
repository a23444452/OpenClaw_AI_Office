import React from 'react';
import type { TabType } from '../../data/types';

interface TabNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; shortLabel: string; icon: string }[] = [
  { id: 'savings', label: '成本節省', shortLabel: '節省', icon: '💰' },
  { id: 'stats', label: '互動統計', shortLabel: '統計', icon: '📊' },
  { id: 'voices', label: '員工心聲', shortLabel: '心聲', icon: '💬' },
];

export const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-1 sm:gap-2 p-1 bg-[#1a1a2e] rounded-lg border border-[#0f3460] min-w-max">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md transition-all
            text-xs sm:text-sm
            ${activeTab === tab.id
              ? 'bg-[#16213e] text-[#00d9ff] border-b-2 border-[#00d9ff]'
              : 'text-gray-400 hover:text-white hover:bg-[#16213e]/50'
            }
          `}
        >
          <span>{tab.icon}</span>
          <span className="hidden sm:inline font-medium">{tab.label}</span>
          <span className="sm:hidden font-medium">{tab.shortLabel}</span>
        </button>
      ))}
    </div>
  );
};
