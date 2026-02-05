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
