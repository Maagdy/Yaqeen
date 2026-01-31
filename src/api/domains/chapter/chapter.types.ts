import type { JuzData } from "../juz";

// Mp3Quran API v3 Response
export interface Mp3QuranSurahResponse {
  suwar: Mp3QuranSurah[];
}

export interface Mp3QuranSurah {
  id: number;
  name: string; // This will be English or Arabic depending on language param
  start_page: number;
  end_page: number;
  makkia: number; // 0 = Madani, 1 = Makki
  type: number; // 0 = Makki, 1 = Madani (same as makkia)
  arabicName?: string; // Optional - we'll add this ourselves
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Edition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction?: string;
}

export interface Ayah {
  number: number;
  text: string;
  surah: Surah;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda:
    | boolean
    | {
        id: number;
        recommended: boolean;
        obligatory: boolean;
      };
  // Audio fields (present when using audio editions like ar.alafasy)
  audio?: string;
  audioSecondary?: string[];
}

export interface JuzResponse {
  code: number;
  status: string;
  data: JuzData;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
  edition: Edition;
}

export interface SurahResponse {
  code: number;
  status: string;
  data: SurahData;
}

// Utility function to map Mp3QuranSurah to Surah format
export const mapMp3QuranSurahToSurah = (mp3Surah: Mp3QuranSurah): Surah => {
  // Static data for number of ayahs per surah (standard Quran)
  const ayahCounts = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128,
    111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73,
    54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49,
    62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28,
    28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
    15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5,
    6,
  ];

  return {
    number: mp3Surah.id,
    // Use arabicName if available (we add it from Arabic API), otherwise use name
    name: mp3Surah.arabicName?.trim() || mp3Surah.name.trim(),
    englishName: mp3Surah.name.trim(),
    englishNameTranslation: mp3Surah.name.trim(),
    numberOfAyahs: ayahCounts[mp3Surah.id - 1] || 0,
    revelationType: mp3Surah.makkia === 1 ? "Meccan" : "Medinan",
  };
};
