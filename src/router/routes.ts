export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  SURAH: "/surah/:id",
  JUZ: "/juz/:id",
  RECITERS: "/reciters",
  RECITER_DETAILS: "/reciters/:reciterId",
  QURAN: "/quran",
  MUSHAF_DETAILS: "/quran/:mushafId",
  MUSHAF_SURAH: "/quran/:mushafId/surah/:surahId",
  RADIO: "/radio",
  AUTH: "/auth",
  SEARCH: "/search",
  PROFILE: "/profile",
} as const;

export const generateRoute = {
  surah: (surahId: number | string): string => `/surah/${surahId}`,

  juz: (juzId: number | string): string => `/juz/${juzId}`,

  reciterDetails: (reciterId: number | string): string =>
    `/reciters/${reciterId}`,

  mushafDetails: (mushafId: number | string): string => `/quran/${mushafId}`,

  mushafSurah: (mushafId: number | string, surahId: number | string): string =>
    `/quran/${mushafId}/surah/${surahId}`,

  search: (keyword: string): string =>
    `/search?q=${encodeURIComponent(keyword)}`,
} as const;
