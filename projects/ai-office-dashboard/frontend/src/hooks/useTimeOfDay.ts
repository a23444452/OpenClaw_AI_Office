import { useState, useEffect } from 'react';

export type TimeOfDay = 'night' | 'dawn' | 'morning' | 'afternoon' | 'evening' | 'dusk';

export interface TimeTheme {
  timeOfDay: TimeOfDay;
  skyGradient: string;
  windowGlow: string;
  ambientLight: string;
  roomOverlay: string;
  lampOn: boolean;
  stars: boolean;
  sunMoon: string;
  hour: number;
}

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 0 && hour < 5) return 'night';      // 00:00-04:59 深夜
  if (hour >= 5 && hour < 7) return 'dawn';       // 05:00-06:59 黎明
  if (hour >= 7 && hour < 12) return 'morning';   // 07:00-11:59 早晨
  if (hour >= 12 && hour < 17) return 'afternoon';// 12:00-16:59 下午
  if (hour >= 17 && hour < 19) return 'evening';  // 17:00-18:59 傍晚
  return 'dusk';                                   // 19:00-23:59 黃昏/夜晚
}

function getTimeTheme(hour: number): TimeTheme {
  const timeOfDay = getTimeOfDay(hour);
  
  const themes: Record<TimeOfDay, Omit<TimeTheme, 'timeOfDay' | 'hour'>> = {
    night: {
      skyGradient: 'from-slate-900 via-indigo-950 to-slate-900',
      windowGlow: 'rgba(30, 41, 59, 0.8)',
      ambientLight: 'rgba(15, 23, 42, 0.4)',
      roomOverlay: 'rgba(15, 23, 42, 0.25)',
      lampOn: true,
      stars: true,
      sunMoon: '🌙',
    },
    dawn: {
      skyGradient: 'from-indigo-400 via-pink-300 to-orange-200',
      windowGlow: 'rgba(251, 207, 232, 0.6)',
      ambientLight: 'rgba(251, 207, 232, 0.2)',
      roomOverlay: 'rgba(251, 207, 232, 0.1)',
      lampOn: false,
      stars: false,
      sunMoon: '🌅',
    },
    morning: {
      skyGradient: 'from-sky-300 via-sky-400 to-blue-400',
      windowGlow: 'rgba(186, 230, 253, 0.5)',
      ambientLight: 'rgba(186, 230, 253, 0.15)',
      roomOverlay: 'transparent',
      lampOn: false,
      stars: false,
      sunMoon: '☀️',
    },
    afternoon: {
      skyGradient: 'from-sky-400 via-blue-400 to-sky-500',
      windowGlow: 'rgba(125, 211, 252, 0.4)',
      ambientLight: 'rgba(253, 224, 71, 0.1)',
      roomOverlay: 'transparent',
      lampOn: false,
      stars: false,
      sunMoon: '🌤️',
    },
    evening: {
      skyGradient: 'from-orange-300 via-rose-400 to-purple-500',
      windowGlow: 'rgba(251, 146, 60, 0.5)',
      ambientLight: 'rgba(251, 146, 60, 0.15)',
      roomOverlay: 'rgba(251, 146, 60, 0.08)',
      lampOn: false,
      stars: false,
      sunMoon: '🌇',
    },
    dusk: {
      skyGradient: 'from-purple-600 via-indigo-700 to-slate-800',
      windowGlow: 'rgba(139, 92, 246, 0.5)',
      ambientLight: 'rgba(30, 41, 59, 0.25)',
      roomOverlay: 'rgba(30, 41, 59, 0.15)',
      lampOn: true,
      stars: true,
      sunMoon: '🌆',
    },
  };

  return {
    ...themes[timeOfDay],
    timeOfDay,
    hour,
  };
}

export function useTimeOfDay(): TimeTheme {
  const [theme, setTheme] = useState<TimeTheme>(() => 
    getTimeTheme(new Date().getHours())
  );

  useEffect(() => {
    // 每分鐘更新一次
    const interval = setInterval(() => {
      const newHour = new Date().getHours();
      setTheme(prev => {
        if (prev.hour !== newHour) {
          return getTimeTheme(newHour);
        }
        return prev;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return theme;
}
