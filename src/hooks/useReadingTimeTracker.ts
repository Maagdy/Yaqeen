import { useEffect, useRef, useState } from 'react';
import type { Ayah } from '@/api/domains/chapter/chapter.types';

interface ReadingStats {
  timeSpentSeconds: number;
  pagesRead: number;
  readingSpeedPagesPerMinute: number;
  readingSpeedAyahsPerMinute: number;
}

/**
 * Track reading time and calculate reading speed analytics
 */
export const useReadingTimeTracker = (ayahs: Ayah[]) => {
  const [stats, setStats] = useState<ReadingStats>({
    timeSpentSeconds: 0,
    pagesRead: 0,
    readingSpeedPagesPerMinute: 0,
    readingSpeedAyahsPerMinute: 0,
  });

  const startTimeRef = useRef<number>(Date.now());
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = Date.now();

    // Update time every second
    intervalRef.current = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const uniquePages = new Set(ayahs.map((a) => a.page)).size;
      const timeInMinutes = timeSpent / 60;

      setStats({
        timeSpentSeconds: timeSpent,
        pagesRead: uniquePages,
        readingSpeedPagesPerMinute: timeInMinutes > 0 ? uniquePages / timeInMinutes : 0,
        readingSpeedAyahsPerMinute: timeInMinutes > 0 ? ayahs.length / timeInMinutes : 0,
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [ayahs]);

  return stats;
};
