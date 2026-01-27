export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  SURAH: "/surah/:id",
  JUZ: "/juz/:id",
} as const;

export const generateRoute = {
  surah: (surahId: number | string): string => `/surah/${surahId}`,

  juz: (juzId: number | string): string => `/juz/${juzId}`,
} as const;
