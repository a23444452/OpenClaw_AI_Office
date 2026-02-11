import { useState, useEffect } from 'react';

export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

export function useTimeOfDay(): TimeOfDay {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');

  useEffect(() => {
    const updateTimeOfDay = () => {
      // Use Taipei timezone
      const now = new Date();
      const taipeiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
      const hour = taipeiTime.getHours();

      if (hour >= 6 && hour < 9) {
        setTimeOfDay('morning');
      } else if (hour >= 9 && hour < 17) {
        setTimeOfDay('day');
      } else if (hour >= 17 && hour < 20) {
        setTimeOfDay('evening');
      } else {
        setTimeOfDay('night');
      }
    };

    updateTimeOfDay();
    // Update every minute
    const interval = setInterval(updateTimeOfDay, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return timeOfDay;
}

export function getSceneForTime(timeOfDay: TimeOfDay): string {
  switch (timeOfDay) {
    case 'morning':
      return '/scenes/scene-normal.png';
    case 'day':
      return '/scenes/scene-busy.png';
    case 'evening':
      return '/scenes/scene-relax.png';
    case 'night':
      return '/scenes/scene-night.png';
    default:
      return '/scenes/scene-normal.png';
  }
}
