export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  SURAH: "/surah/:id",
  JUZ: "/juz/:id",
  RECITERS: "/reciters",
  RECITER_DETAILS: "/reciters/:reciterId",
} as const;

export const generateRoute = {
  surah: (surahId: number | string): string => `/surah/${surahId}`,

  juz: (juzId: number | string): string => `/juz/${juzId}`,

  reciterDetails: (reciterId: number | string): string =>
    `/reciters/${reciterId}`,
} as const;
