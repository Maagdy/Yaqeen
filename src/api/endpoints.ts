import { proxyUrl, buildUrl } from "./utils";

// Base URLs for external APIs
const MP3QURAN_API = "https://mp3quran.net/api/v3";
const ALQURAN_API = "https://api.alquran.cloud/v1";
const QURANPEDIA_API = "https://api.quranpedia.net/v1";
const QURAN_TAFSEER_API = "http://api.quran-tafseer.com";
const SUNNAH_API = "https://api.sunnah.com/v1";
const ISLAMIC_NETWORK_CDN = "https://cdn.islamic.network/quran";

// Legacy exports (deprecated - use ENDPOINTS instead)
export const MP3QURAN_BASE_URL = proxyUrl(MP3QURAN_API);
export const ALQURAN_BASE_URL = ALQURAN_API; // AlQuran Cloud supports CORS - no proxy needed
export const API_BASE_URL = ALQURAN_BASE_URL;

export const ENDPOINTS = {
  // --- MP3QURAN v3 ENDPOINTS (for metadata) ---
  // MP3Quran needs proxy due to CORS
  MP3QURAN_SUWAR: (language: string = "eng") =>
    proxyUrl(buildUrl(`${MP3QURAN_API}/suwar`, { language })),
  RECITERS: (params?: Record<string, string | number | undefined>) =>
    proxyUrl(buildUrl(`${MP3QURAN_API}/reciters`, params)),

  // --- METADATA & EDITIONS ---
  // AlQuran Cloud supports CORS - direct calls
  META: `${ALQURAN_API}/meta`,
  EDITIONS: `${ALQURAN_API}/edition`,
  EDITION_BY_LANGUAGE: (language: string) =>
    `${ALQURAN_API}/edition/language/${language}`,
  EDITION_BY_TYPE: (type: string) => `${ALQURAN_API}/edition/type/${type}`,
  EDITION_BY_FORMAT: (format: string) =>
    `${ALQURAN_API}/edition/format/${format}`,

  // --- COMPLETE QURAN ---
  QURAN: (edition: string = "quran-uthmani") =>
    `${ALQURAN_API}/quran/${edition}`,

  // --- SURAHS ---
  SURAHS: `${ALQURAN_API}/surah`,
  SURAH: (number: number, edition: string = "quran-uthmani") =>
    `${ALQURAN_API}/surah/${number}/${edition}`,
  SURAH_WITH_OFFSET: (
    number: number,
    offset: number,
    limit: number,
    edition: string = "quran-uthmani",
  ) => buildUrl(`${ALQURAN_API}/surah/${number}/${edition}`, { offset, limit }),

  // --- JUZ ---
  JUZ: (number: number, edition: string = "quran-uthmani") =>
    `${ALQURAN_API}/juz/${number}/${edition}`,
  JUZ_WITH_OFFSET: (
    number: number,
    offset: number,
    limit: number,
    edition: string = "quran-uthmani",
  ) => buildUrl(`${ALQURAN_API}/juz/${number}/${edition}`, { offset, limit }),

  // --- AYAH (Verse) ---
  AYAH: (reference: number | string, edition: string = "quran-uthmani") =>
    `${ALQURAN_API}/ayah/${reference}/${edition}`,
  AYAH_MANY_EDITIONS: (reference: number | string, editions: string[]) =>
    `${ALQURAN_API}/ayah/${reference}/editions/${editions.join(",")}`,

  // --- MUSHAFS ---
  // Quranpedia needs proxy
  MUSHAFS: proxyUrl(`${QURANPEDIA_API}/mushafs`),
  SINGLE_MUSHAF: (mushafId: number) =>
    proxyUrl(`${QURANPEDIA_API}/mushafs/${mushafId}`),
  MUSHAF_SURAH: (mushafId: number, surahNumber: number) =>
    proxyUrl(`${QURANPEDIA_API}/mushafs/${mushafId}/${surahNumber}`),

  // --- TAFSIR ---
  // Tafsir APIs need proxy
  ALL_TAFSIR_BOOKS: proxyUrl(`${QURAN_TAFSEER_API}/tafseer`),
  TAFSIR: (tafsirId: number = 1, suraId: number = 1, language: string = "ar") =>
    proxyUrl(
      buildUrl(`${MP3QURAN_API}/tafsir`, {
        tafsir: tafsirId,
        sura: suraId,
        language,
      }),
    ),

  ONE_AYAH_TAFSIR: (
    tafsirId: number = 1,
    suraNumber: number,
    ayahNumber: number,
  ) =>
    proxyUrl(
      `${QURAN_TAFSEER_API}/tafseer/${tafsirId}/${suraNumber}/${ayahNumber}`,
    ),

  AYAH_RANGE_TAFSIR: (
    tafsirId: number,
    suraNumber: number,
    ayahFrom: number,
    ayahTo: number,
  ) =>
    proxyUrl(
      `${QURAN_TAFSEER_API}/tafseer/${tafsirId}/${suraNumber}/${ayahFrom}/${ayahTo}`,
    ),

  // --- SEARCH ---
  SEARCH: (
    keyword: string,
    scope: string = "all",
    edition: string = "en.pickthall",
  ) => `${ALQURAN_API}/search/${keyword}/${scope}/${edition}`,

  // --- PAGE ---
  PAGE: (number: number, edition: string = "quran-uthmani") =>
    `${ALQURAN_API}/page/${number}/${edition}`,

  // --- MANZIL (7 total) ---
  MANZIL: (number: number, edition: string = "quran-uthmani") =>
    `${ALQURAN_API}/manzil/${number}/${edition}`,

  // --- RADIO ---
  // MP3Quran needs proxy
  RADIO: (language: string = "eng") =>
    proxyUrl(buildUrl(`${MP3QURAN_API}/radios`, { language })),

  // --- RUKU (556 total) ---
  RUKUS: `${ALQURAN_API}/rukus`,
  RUKU: (number: number, edition: string = "quran-uthmani") =>
    `${ALQURAN_API}/ruku/${number}/${edition}`,

  // --- HIZB QUARTER (240 total) ---
  HIZB_QUARTER: (number: number, edition: string = "quran-uthmani") =>
    `${ALQURAN_API}/hizbQuarter/${number}/${edition}`,

  // --- SAJDA (Prostrations) ---
  SAJDA: (edition: string = "quran-uthmani") =>
    `${ALQURAN_API}/sajda/${edition}`,

  // --- MEDIA ---
  // CDN needs proxy
  AUDIO_URL: (editionId: string) =>
    proxyUrl(`${ISLAMIC_NETWORK_CDN}/audio/128/${editionId}`),
  IMAGE_URL: (ayahId: number) =>
    proxyUrl(`${ISLAMIC_NETWORK_CDN}/images/${ayahId}.png`),

  // --- HADITH (Sunnah.com API) ---
  // Sunnah API needs proxy
  HADITH_COLLECTIONS: proxyUrl(`${SUNNAH_API}/collections`),
  HADITH_COLLECTION_BOOKS: (collectionName: string) =>
    proxyUrl(`${SUNNAH_API}/collections/${collectionName}/books`),
  HADITHS: (params?: Record<string, string | number | undefined>) =>
    proxyUrl(buildUrl(`${SUNNAH_API}/hadiths`, params)),
  HADITHS_BY_BOOK: (
    collection: string,
    book: number,
    params?: Record<string, string | number | undefined>,
  ) =>
    proxyUrl(
      buildUrl(
        `${SUNNAH_API}/collections/${collection}/books/${book}/hadiths`,
        params,
      ),
    ),
} as const;
