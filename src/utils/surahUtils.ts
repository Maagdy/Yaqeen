export const padSurahNumber = (surahNumber: number): string => {
  return String(surahNumber).padStart(3, "0");
};
