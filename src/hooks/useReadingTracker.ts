import { useEffect, useRef } from 'react';
import { useRamadanTracking } from './useRamadanTracking';
import { calculatePagesFromAyahs } from '@/utils/quran-tracking-utils';
import type { Ayah } from '@/api/domains/chapter/chapter.types';

/**
 * Hook to track Quran reading progress when user leaves a page
 *
 * @param ayahs - Array of ayahs displayed on the page
 * @param enabled - Whether tracking is enabled (default: true)
 *
 * Tracks unique page count on component unmount (user navigating away)
 */
export const useReadingTracker = (ayahs: Ayah[], enabled: boolean = true) => {
  const { trackPagesRead, isLoggedIn } = useRamadanTracking();
  const trackedRef = useRef(false);

  useEffect(() => {
    return () => {
      // Track on unmount (user leaving page)
      if (enabled && isLoggedIn && !trackedRef.current && ayahs.length > 0) {
        trackedRef.current = true;
        const pages = calculatePagesFromAyahs(ayahs);
        if (pages > 0) {
          // Suppress notifications to avoid spam (false parameter)
          trackPagesRead(pages, false).catch(error => {
            console.error('[Reading Tracker] Failed to track pages:', error);
          });
        }
      }
    };
  }, [ayahs, enabled, isLoggedIn, trackPagesRead]);

  return { isTracking: isLoggedIn && enabled };
};
