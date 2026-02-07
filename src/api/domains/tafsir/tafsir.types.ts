export interface TafsirBook {
  id: number;
  name: string;
  language: string;
  author: string;
  book_name: string;
}

// Single audio segment
export interface TafsirSegment {
  id: number;
  tafsir_id: number;
  name: string;
  url: string;
  sura_id: number;
}

// Map of suraId -> segments[]
export type SoarMap = Record<string, TafsirSegment[]>;

// Tafsir info
export interface TafsirData {
  name: string;
  soar: SoarMap;
}

// Root API response
export interface TafsirResponse {
  tafasir: TafsirData;
}

export interface AyahTafsir {
  tafseer_id: number;
  tafseer_name: string;
  ayah_url: string;
  ayah_number: number;
  text: string;
}

// Hadith API Types
export interface HadithCollectionInfo {
  lang: string;
  title: string;
  shortIntro: string;
}

export interface HadithCollection {
  name: string;
  hasBooks: boolean;
  hasChapters: boolean;
  collection: HadithCollectionInfo[];
  totalHadith: number;
  totalAvailableHadith: number;
}

export interface HadithResponse {
  data: HadithCollection[];
  total: number;
  limit: number;
  previous: number;
  next: number;
}

export interface HadithParams {
  collection?: string;
  book?: number;
  hadithNumber?: number;
  limit?: number;
  page?: number;
}
