/**
 * Pads a surah number with leading zeros to create a 3-digit string
 * @param surahNumber - The surah number (1-114)
 * @returns A 3-digit string representation of the surah number
 * @example
 * padSurahNumber(1) // returns "001"
 * padSurahNumber(14) // returns "014"
 * padSurahNumber(114) // returns "114"
 */
export const padSurahNumber = (surahNumber: number): string => {
  return String(surahNumber).padStart(3, "0");
};
