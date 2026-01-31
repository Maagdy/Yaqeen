// Hybrid API approach:
// - mp3quran for surah metadata (fast, reliable)
// - AlQuran Cloud for verse/ayah content
export const MP3QURAN_BASE_URL = "https://mp3quran.net/api/v3";
export const ALQURAN_BASE_URL = "http://api.alquran.cloud/v1";

// Legacy - keeping for backward compatibility
export const API_BASE_URL = ALQURAN_BASE_URL;

export const ENDPOINTS = {
  // --- MP3QURAN v3 ENDPOINTS (for metadata) ---
  MP3QURAN_SUWAR: (language: string = "eng") => `/suwar?language=${language}`,
  RECITERS: "/reciters",
  // --- METADATA & EDITIONS ---
  META: "/meta",
  EDITIONS: "/edition",
  EDITION_BY_LANGUAGE: (language: string) => `/edition/language/${language}`,
  EDITION_BY_TYPE: (type: string) => `/edition/type/${type}`,
  EDITION_BY_FORMAT: (format: string) => `/edition/format/${format}`,

  // --- COMPLETE QURAN ---
  QURAN: (edition: string = "quran-uthmani") => `/quran/${edition}`,

  // --- SURAHS ---
  SURAHS: "/surah",
  SURAH: (number: number, edition: string = "quran-uthmani") =>
    `/surah/${number}/${edition}`,
  SURAH_WITH_OFFSET: (
    number: number,
    offset: number,
    limit: number,
    edition: string = "quran-uthmani",
  ) => `/surah/${number}/${edition}?offset=${offset}&limit=${limit}`,

  // --- JUZ ---
  JUZ: (number: number, edition: string = "quran-uthmani") =>
    `/juz/${number}/${edition}`,
  JUZ_WITH_OFFSET: (
    number: number,
    offset: number,
    limit: number,
    edition: string = "quran-uthmani",
  ) => `/juz/${number}/${edition}?offset=${offset}&limit=${limit}`,

  // --- AYAH (Verse) ---
  AYAH: (reference: number | string, edition: string = "quran-uthmani") =>
    `/ayah/${reference}/${edition}`,
  AYAH_MANY_EDITIONS: (reference: number | string, editions: string[]) =>
    `/ayah/${reference}/editions/${editions.join(",")}`,

  // --- SEARCH ---
  SEARCH: (
    keyword: string,
    scope: string = "all",
    edition: string = "en.pickthall",
  ) => `/search/${keyword}/${scope}/${edition}`,

  // --- PAGE ---
  PAGE: (number: number, edition: string = "quran-uthmani") =>
    `/page/${number}/${edition}`,

  // --- MANZIL (7 total) ---
  MANZIL: (number: number, edition: string = "quran-uthmani") =>
    `/manzil/${number}/${edition}`,

  // --- RUKU (556 total) ---
  RUKUS: "/rukus", // All rukus references
  RUKU: (number: number, edition: string = "quran-uthmani") =>
    `/ruku/${number}/${edition}`,

  // --- HIZB QUARTER (240 total) ---
  HIZB_QUARTER: (number: number, edition: string = "quran-uthmani") =>
    `/hizbQuarter/${number}/${edition}`,

  // --- SAJDA (Prostrations) ---
  SAJDA: (edition: string = "quran-uthmani") => `/sajda/${edition}`,

  // --- MEDIA ---
  // Note: Media URL conventions are often handled by CDN directly, but here are specific API helpers if needed
  AUDIO_URL: (editionId: string) =>
    `https://cdn.islamic.network/quran/audio/128/${editionId}`,
  IMAGE_URL: (ayahId: number) =>
    `https://cdn.islamic.network/quran/images/${ayahId}.png`,
} as const;
