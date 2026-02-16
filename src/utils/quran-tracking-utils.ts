import type { Ayah } from '@/api/domains/chapter/chapter.types';

/**
 * Calculate unique Quran page count from ayah array
 * Each ayah has a `page` property (1-604)
 */
export const calculatePagesFromAyahs = (ayahs: Ayah[]): number => {
  if (!ayahs || ayahs.length === 0) return 0;
  const uniquePages = new Set(ayahs.map(ayah => ayah.page));
  return uniquePages.size;
};

/**
 * Calculate unique Quran page count from mushaf ayah array
 * Mushaf ayahs use `page_number` instead of `page`
 */
export const calculatePagesFromMushafAyahs = (ayahs: any[]): number => {
  if (!ayahs || ayahs.length === 0) return 0;
  const uniquePages = new Set(ayahs.map(ayah => ayah.page_number));
  return uniquePages.size;
};

/**
 * Determine if playback type should be tracked for challenges
 * Track 'surah' and 'ayah', but not 'radio' (continuous streams)
 */
export const shouldTrackListening = (playbackType: string | null): boolean => {
  return playbackType === 'surah' || playbackType === 'ayah';
};

/**
 * Convert seconds to minutes (rounded)
 */
export const secondsToMinutes = (seconds: number): number => {
  return Math.round(seconds / 60);
};
